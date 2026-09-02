import { ActivityIndicator, View } from 'react-native'
import { Redirect } from 'expo-router'
import { useAuth } from '@/providers/auth-provider'

export default function Index() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        className='flex-1 items-center justify-center bg-background'
      >
        <ActivityIndicator size='large' color='#8b5cf6' />
      </View>
    )
  }

  if (session) {
    return <Redirect href='/(app)' />
  }

  return <Redirect href='/(auth)/sign-in' />
}
