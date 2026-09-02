import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Card, Text } from '@/components/ui'
import { useAuth } from '@/providers/auth-provider'

export default function HomeScreen() {
  const { signOut } = useAuth()

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.safeArea}
    >
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.welcomeText}>
            Hello, Welcome to AmogaNextPods
          </Text>
          <Button
            variant='outline'
            onPress={signOut}
            style={styles.signOutButton}
          >
            Sign Out
          </Button>
        </Card>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0f172a',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  signOutButton: {
    marginTop: 24,
    width: '100%',
  },
})
