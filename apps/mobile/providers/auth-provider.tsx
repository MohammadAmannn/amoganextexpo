import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext<{
  session: Session | null
  user: User | null
  loading: boolean
  signOut(): Promise<void>
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    // Fallback: don't let loading stay true for more than 1.5s
    const timer = setTimeout(() => {
      if (active && loading) setLoading(false)
    }, 1500)

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) {
          setSession(data?.session ?? null)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.warn('Session fetch warning:', err)
        if (active) setLoading(false)
      })

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (active) setSession(next)
    })

    // Listen for incoming deep links from OAuth
    const handleUrl = async (url: string | null) => {
      if (!url) return
      try {
        const hashPart = url.includes('#') ? url.split('#')[1] : null
        const queryPart = url.includes('?') ? url.split('?')[1] : null
        const paramsStr = hashPart || queryPart
        if (!paramsStr) return

        const searchParams = new URLSearchParams(paramsStr)
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const code = searchParams.get('code')

        if (code) {
          const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)
          if (!error && sessionData.session && active) {
            setSession(sessionData.session)
          }
        } else if (accessToken && refreshToken) {
          const { data: sessionData, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (!error && sessionData.session && active) {
            setSession(sessionData.session)
          }
        }
      } catch (err) {
        console.warn('OAuth redirect session error:', err)
      }
    }

    Linking.getInitialURL().then(handleUrl)
    const linkSub = Linking.addEventListener('url', (event) => handleUrl(event.url))

    return () => {
      active = false
      clearTimeout(timer)
      data.subscription.unsubscribe()
      linkSub.remove()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signOut: async () => {
        await supabase.auth.signOut()
      },
    }),
    [session, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
