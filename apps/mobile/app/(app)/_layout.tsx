import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/providers/auth-provider'
export default function AppLayout() { const { session, loading } = useAuth(); if (!loading && !session) return <Redirect href='/(auth)/sign-in' />; return <Stack screenOptions={{ headerShown: true }} /> }
