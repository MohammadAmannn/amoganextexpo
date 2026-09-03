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
        <PortalHost />
      </AuthProvider>
    </ThemeProvider>
  )
}
