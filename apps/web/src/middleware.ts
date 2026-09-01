import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data?.user || null
  } catch (err) {
    console.error('[Middleware] Error calling getUser:', err)
  }

  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // Public paths
  const isPublicPath =
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/otp') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'

  const hasNextAuthToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('auth_user_data')?.value

  const isAuthUser = Boolean(user || hasNextAuthToken)

  // If user is authenticated and accessing /sign-in or /sign-up, redirect to home (System Design)
  if (isAuthUser && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    const rawRedirect = searchParams.get('redirect')
    let target = '/'
    if (rawRedirect) {
      try {
        target = decodeURIComponent(rawRedirect)
      } catch {
        target = rawRedirect
      }
      if (target.startsWith('/sign-in') || target.startsWith('/sign-up') || !target) {
        target = '/'
      }
    }
    const [cleanPathname, queryString] = target.split('?')
    const url = request.nextUrl.clone()
    url.pathname = cleanPathname.startsWith('/') ? cleanPathname : `/${cleanPathname}`
    url.search = queryString ? `?${queryString}` : ''
    url.searchParams.delete('redirect')
    const redirectResponse = NextResponse.redirect(url)
    redirectResponse.headers.set('x-middleware-cache', 'no-cache')
    return redirectResponse
  }

  // If unauthenticated and accessing protected route (like /), redirect to /sign-in
  if (!isAuthUser && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'

    const fullPath = request.nextUrl.search
      ? `${pathname}${request.nextUrl.search}`
      : pathname

    url.searchParams.set('redirect', fullPath)
    const redirectResponse = NextResponse.redirect(url)
    redirectResponse.headers.set('x-middleware-cache', 'no-cache')
    return redirectResponse
  }

  supabaseResponse.headers.set('x-middleware-cache', 'no-cache')
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
