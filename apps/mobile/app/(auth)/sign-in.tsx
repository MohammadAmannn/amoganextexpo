import { useState, useEffect } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { Link, router } from 'expo-router'
import { Command, Eye, EyeOff, Smartphone, Mail } from 'lucide-react-native'
import { signInSchema } from '@amoga/schemas'
import { supabase } from '@/lib/supabase'
import { Button, Card, Text } from '@/components/ui'

export default function SignInScreen() {
  const [activeTab, setActiveTab] = useState<'mobile' | 'login'>('login')

  // Email & Password state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)

  // Mobile OTP state
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Handle Email / Password Login
  async function handleEmailSignIn() {
    const parsed = signInSchema.safeParse({ email, password })
    if (!parsed.success) {
      return Alert.alert('Check your details', parsed.error.issues[0]?.message)
    }

    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })
    setBusy(false)

    if (error) {
      return Alert.alert('Sign in failed', error.message)
    }

    router.replace('/(app)')
  }

  // Handle Send Mobile OTP
  async function handleSendOtp() {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 7) {
      return Alert.alert('Invalid phone number', 'Please enter a valid phone number.')
    }

    const fullNumber = `${countryCode}${cleanPhone}`
    setBusy(true)
    const { error } = await supabase.auth.signInWithOtp({
      phone: fullNumber,
    })
    setBusy(false)

    if (error) {
      return Alert.alert('OTP Failed', error.message)
    }

    setOtpSent(true)
    setResendCooldown(30)
    Alert.alert('OTP Sent', `Verification code sent to ${fullNumber}`)
  }

  // Handle Verify Mobile OTP
  async function handleVerifyOtp() {
    if (!otpCode || otpCode.length < 6) {
      return Alert.alert('Invalid OTP', 'Please enter the 6-digit code sent to your phone.')
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '')
    const fullNumber = `${countryCode}${cleanPhone}`

    setBusy(true)
    const { error } = await supabase.auth.verifyOtp({
      phone: fullNumber,
      token: otpCode,
      type: 'sms',
    })
    setBusy(false)

    if (error) {
      return Alert.alert('Verification failed', error.message)
    }

    router.replace('/(app)')
  }

  // Handle Google Sign-in placeholder
  async function handleGoogleSignIn() {
    setBusy(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) Alert.alert('Google Sign-in', error.message)
    } catch (e: any) {
      Alert.alert('Google Sign-in', e.message || 'Unable to connect to Google')
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      className='flex-1 bg-background'
    >
      {/* Decorative ambient background accents */}
      <View
        pointerEvents='none'
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: '#8b5cf6',
          opacity: 0.08,
        }}
      />
      <View
        pointerEvents='none'
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: '#8b5cf6',
          opacity: 0.08,
        }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        style={{ flex: 1 }}
        className='px-5 py-10'
        keyboardShouldPersistTaps='handled'
      >
        <View className='mx-auto w-full max-w-md'>
          {/* Web Logo & Brand Header */}
          <View className='mb-6 flex-row items-center justify-center gap-2.5'>
            <View className='h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20'>
              <Command size={20} color='#8b5cf6' />
            </View>
            <Text className='text-2xl font-bold tracking-tight text-foreground'>
              AmogaApp
            </Text>
          </View>

          {/* Main Card Container */}
          <Card className='rounded-2xl border border-border/80 bg-card/95 p-6 shadow-lg'>
            {/* Card Header */}
            <View className='mb-5'>
              <Text className='text-xl font-bold tracking-tight text-foreground'>
                Sign in
              </Text>
              <Text className='mt-1 text-xs text-muted-foreground leading-relaxed'>
                Enter your credentials below to log into your account. Don't have an account?{' '}
                <Link
                  href='/(auth)/sign-up'
                  className='font-semibold text-primary underline'
                >
                  Sign Up
                </Link>
              </Text>
            </View>

            {/* Tabs List matching Web (Mobile vs Login) */}
            <View className='mb-5 flex-row border-b border-border'>
              <Pressable
                onPress={() => setActiveTab('mobile')}
                className={`flex-1 items-center pb-2.5 ${
                  activeTab === 'mobile'
                    ? 'border-b-2 border-primary'
                    : 'border-transparent'
                }`}
              >
                <Text
                  className={`text-sm ${
                    activeTab === 'mobile'
                      ? 'font-bold text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Mobile
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('login')}
                className={`flex-1 items-center pb-2.5 ${
                  activeTab === 'login'
                    ? 'border-b-2 border-primary'
                    : 'border-transparent'
                }`}
              >
                <Text
                  className={`text-sm ${
                    activeTab === 'login'
                      ? 'font-bold text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Login
                </Text>
              </Pressable>
            </View>

            {/* TAB CONTENT: LOGIN (Email / Password) */}
            {activeTab === 'login' && (
              <View className='space-y-4'>
                <View>
                  <Text className='mb-1.5 text-xs font-semibold text-foreground'>
                    Email
                  </Text>
                  <View className='min-h-11 flex-row items-center rounded-lg border border-border bg-background px-3'>
                    <Mail size={16} color='#64748b' className='mr-2.5' />
                    <TextInput
                      autoCapitalize='none'
                      keyboardType='email-address'
                      placeholder='name@example.com'
                      placeholderTextColor='#64748b'
                      value={email}
                      onChangeText={setEmail}
                      className='flex-1 py-2.5 text-sm text-foreground'
                    />
                  </View>
                </View>

                <View className='mt-3'>
                  <View className='flex-row items-center justify-between mb-1.5'>
                    <Text className='text-xs font-semibold text-foreground'>
                      Password
                    </Text>
                    <Pressable
                      onPress={() =>
                        Alert.alert('Reset Password', 'Check your Supabase project email reset flow.')
                      }
                    >
                      <Text className='text-xs text-primary underline'>
                        Forgot password?
                      </Text>
                    </Pressable>
                  </View>

                  <View className='min-h-11 flex-row items-center rounded-lg border border-border bg-background px-3'>
                    <TextInput
                      placeholder='Password'
                      placeholderTextColor='#64748b'
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      className='flex-1 py-2.5 text-sm text-foreground'
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      className='p-1'
                    >
                      {showPassword ? (
                        <EyeOff size={18} color='#64748b' />
                      ) : (
                        <Eye size={18} color='#64748b' />
                      )}
                    </Pressable>
                  </View>
                </View>

                <Button
                  loading={busy}
                  onPress={handleEmailSignIn}
                  className='mt-4'
                >
                  Sign In
                </Button>

                {/* Social Login Divider */}
                <View className='my-3 flex-row items-center justify-center gap-3'>
                  <View className='h-px flex-1 bg-border/60' />
                  <Text className='text-[11px] uppercase tracking-wider text-muted-foreground'>
                    Or continue with
                  </Text>
                  <View className='h-px flex-1 bg-border/60' />
                </View>

                {/* Google Sign-in Button */}
                <Button
                  variant='outline'
                  loading={busy}
                  onPress={handleGoogleSignIn}
                  className='flex-row items-center justify-center gap-2'
                >
                  <Text className='text-sm font-medium text-foreground'>
                    Continue with Google
                  </Text>
                </Button>
              </View>
            )}

            {/* TAB CONTENT: MOBILE (OTP Authentication) */}
            {activeTab === 'mobile' && (
              <View className='space-y-4'>
                <View>
                  <Text className='mb-1.5 text-xs font-semibold text-foreground'>
                    Mobile Number
                  </Text>
                  <View className='flex-row gap-2'>
                    <View className='w-20 items-center justify-center rounded-lg border border-border bg-muted/40 px-2'>
                      <TextInput
                        value={countryCode}
                        onChangeText={setCountryCode}
                        keyboardType='phone-pad'
                        className='text-center text-sm font-medium text-foreground'
                      />
                    </View>

                    <View className='min-h-11 flex-1 flex-row items-center rounded-lg border border-border bg-background px-3'>
                      <Smartphone size={16} color='#64748b' className='mr-2' />
                      <TextInput
                        keyboardType='phone-pad'
                        placeholder='Mobile number'
                        placeholderTextColor='#64748b'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        className='flex-1 py-2.5 text-sm text-foreground'
                      />
                    </View>
                  </View>
                </View>

                {otpSent && (
                  <View className='mt-3'>
                    <Text className='mb-1.5 text-xs font-semibold text-foreground'>
                      Enter 6-Digit OTP
                    </Text>
                    <View className='min-h-11 flex-row items-center rounded-lg border border-border bg-background px-3'>
                      <TextInput
                        keyboardType='number-pad'
                        maxLength={6}
                        placeholder='123456'
                        placeholderTextColor='#64748b'
                        value={otpCode}
                        onChangeText={setOtpCode}
                        className='flex-1 py-2.5 text-center text-lg font-bold tracking-widest text-foreground'
                      />
                    </View>

                    <View className='mt-2 flex-row justify-between items-center'>
                      <Text className='text-xs text-muted-foreground'>
                        Didn't receive code?
                      </Text>
                      <Pressable
                        disabled={resendCooldown > 0 || busy}
                        onPress={handleSendOtp}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            resendCooldown > 0
                              ? 'text-muted-foreground'
                              : 'text-primary underline'
                          }`}
                        >
                          {resendCooldown > 0
                            ? `Resend in ${resendCooldown}s`
                            : 'Resend OTP'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                <Button
                  loading={busy}
                  onPress={otpSent ? handleVerifyOtp : handleSendOtp}
                  className='mt-4'
                >
                  {otpSent ? 'Verify & Sign In' : 'Send OTP'}
                </Button>
              </View>
            )}

            {/* Card Footer matching Web */}
            <View className='mt-6 border-t border-border/40 pt-4'>
              <Text className='text-center text-[11px] text-muted-foreground leading-relaxed'>
                By clicking sign in, you agree to our{' '}
                <Text className='underline text-foreground'>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text className='underline text-foreground'>
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
