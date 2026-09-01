import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { stringToUuid } from '@/lib/auth'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const USER_DATA_COOKIE = 'auth_user_data'
const ACCESS_TOKEN_COOKIE = 'thisisjustarandomstring'

/**
 * GET /api/auth/callback/github
 * Direct, independent GitHub OAuth code exchange handler.
 * Completely independent of Supabase OAuth / GoTrue provider setup.
 * Automatically saves user profile into Supabase `profiles` table for Chat & Messages.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  if (error || !code) {
    console.error('❌ [GitHub OAuth Callback] Error received:', error)
    const redirectUrl = new URL('/sign-in', origin)
    redirectUrl.searchParams.set('error', error || 'No authorization code returned from GitHub')
    return NextResponse.redirect(redirectUrl)
  }

  // Retrieve client credentials from temporary cookie or fallback to environment variables
  const cookieStore = await cookies()
  const customConfigRaw = cookieStore.get('auth_custom_github')?.value

  let clientId = process.env.GITHUB_CLIENT_ID || process.env.GITHUB_ID || ''
  let clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_SECRET || ''

  if (customConfigRaw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(customConfigRaw))
      if (parsed.clientId) clientId = parsed.clientId
      if (parsed.clientSecret) clientSecret = parsed.clientSecret
    } catch (e) {
      console.warn('⚠️ [GitHub OAuth Callback] Failed to parse custom GitHub config cookie:', e)
    }
  }

  if (!clientId || !clientSecret) {
    console.error('❌ [GitHub OAuth Callback] Missing GitHub Client ID or Secret.')
    const redirectUrl = new URL('/sign-in', origin)
    redirectUrl.searchParams.set('error', 'Missing GitHub Client ID or Secret in App Settings.')
    return NextResponse.redirect(redirectUrl)
  }

  try {
    // 1. Exchange code for access token directly with GitHub
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.error('❌ [GitHub OAuth Callback] Token exchange failed:', tokenData)
      throw new Error(tokenData.error_description || 'Failed to exchange GitHub authorization code')
    }

    const accessToken = tokenData.access_token

    // 2. Fetch authenticated GitHub user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Amoga-Auth-System',
        Accept: 'application/json',
      },
    })

    if (!userRes.ok) {
      throw new Error('Failed to fetch GitHub profile')
    }

    const githubUser = await userRes.json()

    // 3. Resolve user email (fetch from /user/emails if primary email is private)
    let userEmail: string = githubUser.email || ''
    if (!userEmail) {
      try {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'Amoga-Auth-System',
            Accept: 'application/json',
          },
        })
        if (emailsRes.ok) {
          const emails = await emailsRes.json()
          if (Array.isArray(emails)) {
            const primary = emails.find((e: any) => e.primary && e.verified) || emails[0]
            if (primary?.email) {
              userEmail = primary.email
            }
          }
        }
      } catch (e) {
        console.warn('⚠️ [GitHub OAuth Callback] Could not fetch private emails:', e)
      }
    }

    if (!userEmail) {
      userEmail = `${githubUser.login}@users.noreply.github.com`
    }

    const canonicalId = stringToUuid(userEmail.toLowerCase())
    const userName = githubUser.name || githubUser.login || userEmail.split('@')[0]
    const userAvatar = githubUser.avatar_url || null

    // 4. Upsert user into Supabase `profiles` table so Chat & Messages work seamlessly
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY)

        // Check if existing profile matches by email
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, auth_user_id')
          .eq('email', userEmail.toLowerCase())
          .maybeSingle()

        const profileId = existingProfile?.id || canonicalId

        const profileRecord: any = {
          id: profileId,
          name: userName,
          email: userEmail.toLowerCase(),
          avatar: userAvatar,
          updated_at: new Date().toISOString(),
          auth_user_id: existingProfile?.auth_user_id || profileId,
        }

        if (existingProfile) {
          await supabase
            .from('profiles')
            .update(profileRecord)
            .eq('id', existingProfile.id)
        } else {
          await supabase.from('profiles').insert(profileRecord)
        }

        console.log('✅ [GitHub OAuth Callback] Synced user to Supabase profiles:', profileId)
      } catch (dbErr) {
        console.error('⚠️ [GitHub OAuth Callback] Database sync to profiles error:', dbErr)
      }
    }

    // 5. Construct authenticated response and set cookies
    let targetPath = '/'
    if (state) {
      try {
        const decoded = decodeURIComponent(state)
        targetPath = decoded.startsWith('/') ? decoded : '/'
      } catch {
        targetPath = '/'
      }
    }
    const cleanPath = targetPath.split('?')[0] || '/'
    const finalRedirectUrl = new URL(cleanPath === '' ? '/' : cleanPath, origin)
    const response = NextResponse.redirect(finalRedirectUrl)

    const expTime = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days

    const authUserData = {
      id: canonicalId,
      accountNo: canonicalId,
      email: userEmail.toLowerCase(),
      name: userName,
      picture: userAvatar,
      role: ['user'],
      exp: expTime,
    }

    // Set auth cookies
    response.cookies.set(USER_DATA_COOKIE, JSON.stringify(authUserData), {
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
      httpOnly: false, // Allow client hydration in useAuthStore
    })

    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
      httpOnly: false,
    })

    // Also set next-auth session cookie for middleware parity
    response.cookies.set('next-auth.session-token', accessToken, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
      httpOnly: true,
    })

    // Clean up temporary credentials cookie
    response.cookies.delete('auth_custom_github')

    return response
  } catch (err: any) {
    console.error('❌ [GitHub OAuth Callback] Authentication failed:', err)
    const redirectUrl = new URL('/sign-in', origin)
    redirectUrl.searchParams.set('error', err.message || 'GitHub login failed. Please try again.')
    return NextResponse.redirect(redirectUrl)
  }
}
