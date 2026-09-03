import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const universalStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key)
        }
      } catch {}
    }
    return AsyncStorage.getItem(key)
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value)
          return
        }
      } catch {}
    }
    return AsyncStorage.setItem(key, value)
  },

  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key)
          return
        }
      } catch {}
    }
    return AsyncStorage.removeItem(key)
  },
}
