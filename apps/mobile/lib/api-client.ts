import { Platform } from 'react-native'
import { universalStorage } from './storage'

const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    // In web browser, relative URLs work if hosted on same origin or proxy
    if (typeof window !== 'undefined' && window.location.origin) {
      return process.env.EXPO_PUBLIC_API_URL || window.location.origin
    }
  }
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const fullUrl = cleanEndpoint.startsWith('http')
    ? cleanEndpoint
    : `${baseUrl}${cleanEndpoint}`

  const token = await universalStorage.getItem('access_token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    let parsed
    try {
      parsed = JSON.parse(errorBody)
    } catch {
      parsed = { message: errorBody || response.statusText }
    }
    throw new Error(parsed.message || `API error: ${response.status}`)
  }

  return response.json()
}
