import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'
import { Platform } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth-store'

const AuthContext = createContext<{
  session: Session | null
  user: User | null
  loading: boolean
  signOut(): Promise<void>
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const syncUserToStore = (u: User | null) => {
    if (u) {
      const authUser = {
        id: u.id,
        accountNo: u.id.slice(0, 8),
        email: u.email || '',
        name:
          u.user_metadata?.full_name ||
          u.user_metadata?.name ||
          u.user_metadata?.user_name ||
          u.email?.split('@')[0] ||
          'User',
        picture: u.user_metadata?.avatar_url || u.user_metadata?.picture || '',
        role: ['user'],
      }
      useAuthStore.getState().auth.setUser(authUser)
    }
  }

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
          syncUserToStore(data?.session?.user ?? null)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.warn('Session fetch warning:', err)
        if (active) setLoading(false)
      })

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (active) {
        setSession(next)
        syncUserToStore(next?.user ?? null)
      }
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
          const { data: sessionData, error } =
            await supabase.auth.exchangeCodeForSession(code)
          if (!error && sessionData.session && active) {
            setSession(sessionData.session)
            syncUserToStore(sessionData.session.user)
          }
        } else if (accessToken && refreshToken) {
          const { data: sessionData, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (!error && sessionData.session && active) {
            setSession(sessionData.session)
            syncUserToStore(sessionData.session.user)
          }
        }
      } catch (err) {
        console.warn('OAuth redirect session error:', err)
      }
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      handleUrl(window.location.href)
    } else {
      Linking.getInitialURL().then(handleUrl)
    }

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
        await supabase.auth.signOut().catch(() => {})
        useAuthStore.getState().auth.reset()
        setSession(null)
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
