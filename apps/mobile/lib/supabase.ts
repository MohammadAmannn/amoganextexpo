import 'react-native-url-polyfill/auto'
import { AppState, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { parsePublicSupabaseConfig } from '@amoga/config'

const config = parsePublicSupabaseConfig({ url: process.env.EXPO_PUBLIC_SUPABASE_URL, publishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY })
export const supabase = createClient(config.url, config.publishableKey, { auth: { ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}), autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } })
if (Platform.OS !== 'web') AppState.addEventListener('change', (state) => state === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh())
