import { createBrowserClient } from '@supabase/ssr'

let clientSingleton: ReturnType<typeof createBrowserClient> | null = null
let cachedChatUrl: string | null = null
let cachedChatKey: string | null = null

let storageClientSingleton: ReturnType<typeof createBrowserClient> | null = null
let cachedStorageUrl: string | null = null
let cachedStorageKey: string | null = null

/**
 * Sanitizes Supabase Project URL to ensure proper base URL format without /rest/v1 or trailing slashes
 */
export function sanitizeSupabaseUrl(url?: string | null): string {
  if (!url) return ''
  let cleaned = url.trim()
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`
  }
  // Strip any trailing endpoint paths
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '')
  cleaned = cleaned.replace(/\/auth\/v1\/?$/i, '')
  cleaned = cleaned.replace(/\/storage\/v1\/?$/i, '')
  cleaned = cleaned.replace(/\/+$/, '')
  return cleaned
}

/**
 * Returns the active Supabase client for real-time Chat and general database operations.
 * If the user configured and enabled custom Supabase credentials in App Settings (Chat tab),
 * this returns a client connected to their personal Supabase project without needing .env.
 * Otherwise, it falls back seamlessly to the default Amoga Supabase instance from process.env.
 */
export function createClient(): ReturnType<typeof createBrowserClient> {
  const envUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  const envKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim()

  if (typeof window === 'undefined') {
    return createBrowserClient(envUrl, envKey)
  }

  try {
    const raw = localStorage.getItem('email-settings-workspace')
    if (raw) {
      const parsed = JSON.parse(raw)
      const chatAccounts = parsed?.state?.config?.chatAccounts
      const activeAccount = Array.isArray(chatAccounts)
        ? chatAccounts.find((acc: any) => acc.isEnabled && acc.supabaseUrl && acc.supabaseAnonKey)
        : null

      if (activeAccount) {
        const cleanUrl = sanitizeSupabaseUrl(activeAccount.supabaseUrl)
        const cleanKey = activeAccount.supabaseAnonKey.trim()

        if (
          !clientSingleton ||
          cachedChatUrl !== cleanUrl ||
          cachedChatKey !== cleanKey
        ) {
          cachedChatUrl = cleanUrl
          cachedChatKey = cleanKey
          clientSingleton = createBrowserClient(cleanUrl, cleanKey)
        }
        return clientSingleton
      }
    }
  } catch (e) {
    console.error('Failed to read custom chat Supabase settings from localStorage:', e)
  }

  if (!clientSingleton || cachedChatUrl !== envUrl || cachedChatKey !== envKey) {
    cachedChatUrl = envUrl
    cachedChatKey = envKey
    clientSingleton = createBrowserClient(envUrl, envKey)
  }
  return clientSingleton
}

/**
 * Returns the active Supabase client for file storage & document operations.
 * If the user configured and enabled custom Supabase credentials in App Settings (Files tab),
 * this returns a client connected to their personal Supabase project.
 * Otherwise, it falls back seamlessly to the default Amoga Supabase instance.
 */
export function getStorageSupabaseClient(): ReturnType<typeof createBrowserClient> {
  if (typeof window === 'undefined') {
    return createClient()
  }

  try {
    const raw = localStorage.getItem('email-settings-workspace')
    if (raw) {
      const parsed = JSON.parse(raw)
      const storageAccounts = parsed?.state?.config?.storageAccounts
      const activeAccount = Array.isArray(storageAccounts)
        ? storageAccounts.find((acc: any) => acc.isEnabled && acc.supabaseUrl && acc.supabaseAnonKey)
        : null

      if (activeAccount) {
        const cleanUrl = sanitizeSupabaseUrl(activeAccount.supabaseUrl)
        const cleanKey = activeAccount.supabaseAnonKey.trim()

        if (
          !storageClientSingleton ||
          cachedStorageUrl !== cleanUrl ||
          cachedStorageKey !== cleanKey
        ) {
          cachedStorageUrl = cleanUrl
          cachedStorageKey = cleanKey
          storageClientSingleton = createBrowserClient(cleanUrl, cleanKey)
        }
        return storageClientSingleton
      }

      const storage = parsed?.state?.config?.storage
      if (storage?.isCustomEnabled && storage?.supabaseUrl && storage?.supabaseAnonKey) {
        const cleanUrl = sanitizeSupabaseUrl(storage.supabaseUrl)
        const cleanKey = storage.supabaseAnonKey.trim()

        if (
          !storageClientSingleton ||
          cachedStorageUrl !== cleanUrl ||
          cachedStorageKey !== cleanKey
        ) {
          cachedStorageUrl = cleanUrl
          cachedStorageKey = cleanKey
          storageClientSingleton = createBrowserClient(cleanUrl, cleanKey)
        }
        return storageClientSingleton
      }
    }
  } catch (e) {
    console.error('Failed to read custom storage settings from localStorage:', e)
  }

  return createClient()
}

/**
 * Returns the base URL of the active file storage Supabase instance.
 */
export function getStorageSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('email-settings-workspace')
      if (raw) {
        const parsed = JSON.parse(raw)
        const storageAccounts = parsed?.state?.config?.storageAccounts
        const activeAccount = Array.isArray(storageAccounts)
          ? storageAccounts.find((acc: any) => acc.isEnabled && acc.supabaseUrl)
          : null

        if (activeAccount?.supabaseUrl) {
          return sanitizeSupabaseUrl(activeAccount.supabaseUrl)
        }

        const storage = parsed?.state?.config?.storage
        if (storage?.isCustomEnabled && storage?.supabaseUrl) {
          return sanitizeSupabaseUrl(storage.supabaseUrl)
        }
      }
    } catch {
      // fallback
    }
  }
  return sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
}


let emailStorageClientSingleton: ReturnType<typeof createBrowserClient> | null = null
let cachedEmailStorageUrl: string | null = null
let cachedEmailStorageKey: string | null = null

/**
 * Returns the active Supabase client for email files & attachments.
 * If the user configured and enabled custom Supabase credentials in App Settings (Email Files tab),
 * this returns a client connected directly to their personal Supabase bucket.
 * Otherwise, it falls back seamlessly to getStorageSupabaseClient() or default instance.
 */
export function getEmailStorageSupabaseClient(): ReturnType<typeof createBrowserClient> {
  if (typeof window === 'undefined') {
    return createClient()
  }

  try {
    const raw = localStorage.getItem('email-settings-workspace')
    if (raw) {
      const parsed = JSON.parse(raw)
      const emailFileAccounts = parsed?.state?.config?.emailFileAccounts
      const activeAccount = Array.isArray(emailFileAccounts)
        ? emailFileAccounts.find((acc: any) => acc.isEnabled && acc.supabaseUrl && acc.supabaseAnonKey)
        : null

      if (activeAccount) {
        const cleanUrl = sanitizeSupabaseUrl(activeAccount.supabaseUrl)
        const cleanKey = activeAccount.supabaseAnonKey.trim()

        if (
          !emailStorageClientSingleton ||
          cachedEmailStorageUrl !== cleanUrl ||
          cachedEmailStorageKey !== cleanKey
        ) {
          cachedEmailStorageUrl = cleanUrl
          cachedEmailStorageKey = cleanKey
          emailStorageClientSingleton = createBrowserClient(cleanUrl, cleanKey)
        }
        return emailStorageClientSingleton
      }
    }
  } catch (e) {
    console.error('Failed to read custom email storage settings from localStorage:', e)
  }

  return getStorageSupabaseClient()
}

/**
 * Returns the active bucket name and default folder configured for email attachments.
 */
export function getEmailStorageConfig(): { bucketName: string; defaultFolder: string } {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('email-settings-workspace')
      if (raw) {
        const parsed = JSON.parse(raw)
        const emailFileAccounts = parsed?.state?.config?.emailFileAccounts
        const activeAccount = Array.isArray(emailFileAccounts)
          ? emailFileAccounts.find((acc: any) => acc.isEnabled && acc.supabaseUrl && acc.supabaseAnonKey)
          : null

        if (activeAccount) {
          return {
            bucketName: activeAccount.bucketName || 'email-attachments',
            defaultFolder: activeAccount.defaultFolder || 'EmailAttachments',
          }
        }
      }
    } catch {
      // fallback
    }
  }

  return {
    bucketName: 'email-attachments',
    defaultFolder: 'EmailAttachments',
  }
}

