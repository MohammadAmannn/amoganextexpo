import { create } from 'zustand'
import { universalStorage } from '../lib/storage'

const ACCESS_TOKEN = 'access_token'
const USER_DATA = 'auth_user_data'

export interface AuthUser {
  id: string
  accountNo: string
  email: string
  name?: string
  picture?: string
  role: string[]
  exp?: number
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
  // Asynchronously load initial user and token from storage
  universalStorage.getItem(USER_DATA).then((userStr) => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user && (!user.exp || user.exp > Date.now())) {
          universalStorage.getItem(ACCESS_TOKEN).then((token) => {
            set((state) => ({
              auth: {
                ...state.auth,
                user,
                accessToken: token || '',
              },
            }))
          })
        }
      } catch {}
    }
  })

  return {
    auth: {
      user: null,
      setUser: (user) => {
        if (user) {
          universalStorage.setItem(USER_DATA, JSON.stringify(user))
        } else {
          universalStorage.removeItem(USER_DATA)
        }
        set((state) => ({ auth: { ...state.auth, user } }))
      },
      accessToken: '',
      setAccessToken: (accessToken) => {
        universalStorage.setItem(ACCESS_TOKEN, accessToken)
        set((state) => ({ auth: { ...state.auth, accessToken } }))
      },
      resetAccessToken: () => {
        universalStorage.removeItem(ACCESS_TOKEN)
        set((state) => ({ auth: { ...state.auth, accessToken: '' } }))
      },
      reset: () => {
        universalStorage.removeItem(ACCESS_TOKEN)
        universalStorage.removeItem(USER_DATA)
        set((state) => ({
          auth: {
            ...state.auth,
            user: null,
            accessToken: '',
          },
        }))
      },
    },
  }
})
