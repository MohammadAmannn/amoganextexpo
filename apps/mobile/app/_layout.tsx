import '../global.css'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { PortalHost } from '@rn-primitives/portal'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
} from '@expo-google-fonts/open-sans'

import { LogBox, Platform } from 'react-native'
import { ThemeSettingsDrawer } from '@/components/theme/ThemeSettingsDrawer'

LogBox.ignoreLogs([
  'Failed to connect to MetaMask',
  'MetaMask',
  'chrome-extension://',
])

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const isExtensionError = (error: any, filename?: string) => {
    const errorStr = String(error?.message || error?.stack || error || '')
    const fileStr = String(filename || '')
    return (
      errorStr.includes('MetaMask') ||
      errorStr.includes('chrome-extension://') ||
      errorStr.includes('moz-extension://') ||
      fileStr.includes('chrome-extension://') ||
      fileStr.includes('moz-extension://') ||
      fileStr.includes('inpage.js')
    )
  }

  window.addEventListener(
    'error',
    (event) => {
      if (isExtensionError(event.error, event.filename)) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
      }
    },
    true
  )

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isExtensionError(event.reason)) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
      }
    },
    true
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Open Sans': OpenSans_400Regular,
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
  })

  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style='auto' />
        <Stack screenOptions={{ headerShown: false }} />
        <ThemeSettingsDrawer />
        <PortalHost />
      </AuthProvider>
    </ThemeProvider>
  )
}
