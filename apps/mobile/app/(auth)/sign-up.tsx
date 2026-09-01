import { useState } from 'react'
import { Alert, View } from 'react-native'
import { Link, router } from 'expo-router'
import { signUpSchema } from '@amoga/schemas'
import { supabase } from '@/lib/supabase'
import { Button, Card, Input, Text } from '@/components/ui'

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    const parsed = signUpSchema.safeParse({ fullName, email, password })
    if (!parsed.success) return Alert.alert('Check your details', parsed.error.issues[0]?.message)
    setBusy(true)
    const { error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { full_name: parsed.data.fullName } } })
    setBusy(false)
    if (error) return Alert.alert('Sign up failed', error.message)
    Alert.alert('Account created', 'Check your email if confirmation is enabled.')
    router.replace('/')
  }

  return <View style={{ flex: 1 }} className='flex-1 justify-center bg-background px-6'><Card><Text className='mb-5 text-2xl font-bold'>Create account</Text><Input placeholder='Full name' value={fullName} onChangeText={setFullName} className='mb-3'/><Input autoCapitalize='none' keyboardType='email-address' placeholder='Email' value={email} onChangeText={setEmail} className='mb-3'/><Input placeholder='Password (8+ characters)' secureTextEntry value={password} onChangeText={setPassword} className='mb-4'/><Button disabled={busy} onPress={submit}>{busy ? 'Creating…' : 'Create account'}</Button><Link href='/(auth)/sign-in' className='mt-5 text-center text-primary'>Already have an account? Sign in</Link></Card></View>
}
