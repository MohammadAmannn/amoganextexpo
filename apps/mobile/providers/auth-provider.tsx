import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext<{ session: Session | null; user: User | null; loading: boolean; signOut(): Promise<void> } | null>(null)
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

    return () => {
      active = false
      clearTimeout(timer)
      data.subscription.unsubscribe()
    }
  }, [])
  const value = useMemo(() => ({ session, user: session?.user ?? null, loading, signOut: async () => { await supabase.auth.signOut() } }), [session, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value }
