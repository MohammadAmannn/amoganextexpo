import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_DATA = 'auth_user_data'

interface AuthUser {
  id: string  // 👈 ADD THIS - the auth.uid() from Supabase
  accountNo: string
  email: string
  name?: string
  picture?: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  let initToken = ''
  if (cookieState) {
    try {
      initToken = cookieState.startsWith('"') ? JSON.parse(cookieState) : cookieState
    } catch {
      initToken = cookieState
    }
  }

  const userCookie = getCookie(USER_DATA)
  let initUser: AuthUser | null = null
  if (userCookie) {
    try {
      let raw = userCookie
      if (raw.includes('%')) {
        try { raw = decodeURIComponent(raw) } catch {}
      }
      if (raw.includes('%')) {
        try { raw = decodeURIComponent(raw) } catch {}
      }
      const parsed = JSON.parse(raw)
      if (parsed && parsed.exp && parsed.exp > Date.now()) {
        initUser = parsed
      } else if (parsed && !parsed.exp) {
        initUser = parsed
      } else {
        removeCookie(ACCESS_TOKEN)
        removeCookie(USER_DATA)
      }
    } catch (err) {
      console.warn('Could not parse userCookie in useAuthStore:', err)
      initUser = null
    }
  }

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(USER_DATA, encodeURIComponent(JSON.stringify(user)))
          } else {
            removeCookie(USER_DATA)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initUser ? initToken : '',
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(USER_DATA)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})