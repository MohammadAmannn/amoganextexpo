import { View } from 'react-native'
import { Link } from 'expo-router'
import { Button, Card, Text } from '@/components/ui'
import { useAuth } from '@/providers/auth-provider'
import { useAmogaTheme } from '@/providers/theme-provider'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const theme = useAmogaTheme()
  return (
    <View style={{ flex: 1 }} className='flex-1 gap-4 bg-background p-5'>
      <Text className='text-3xl font-bold'>Amoga Starter</Text>
      <Card>
        <Text className='font-semibold'>Authenticated</Text>
        <Text className='text-muted-foreground'>{user?.email}</Text>
      </Card>
      <Link href='/(app)/todos' asChild>
        <Button>Open CRUD example</Button>
      </Link>
      <Link href='/(app)/themes' asChild>
        <Button>Browse 50 themes</Button>
      </Link>
      <Button className='bg-secondary' onPress={theme.toggleMode}>
        Toggle light / dark
      </Button>
      <Button className='bg-destructive' onPress={signOut}>
        Sign out
      </Button>
    </View>
  )
}
