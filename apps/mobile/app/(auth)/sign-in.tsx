import { useState, useEffect } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Link, router } from 'expo-router'
import * as Linking from 'expo-linking'
import { Command, Eye, EyeOff, Smartphone, Mail } from 'lucide-react-native'
import { signInSchema } from '@amoga/schemas'
import { supabase } from '@/lib/supabase'
import { Button, Card, Text } from '@/components/ui'
import { useAuth } from '@/providers/auth-provider'

export default function SignInScreen() {
  const { session, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'mobile' | 'login'>('login')

  // Auto redirect as soon as session is active (e.g. from Google OAuth callback)
  useEffect(() => {
    if (session && !authLoading) {
      router.replace('/(app)')
    }
  }, [session, authLoading])

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
    let timer: ReturnType<typeof setTimeout>
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Handle Email / Password Login
  async function handleEmailSignIn() {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      return Alert.alert('Email Required', 'Please enter your email address.')
    }
    if (!password) {
      return Alert.alert('Password Required', 'Please enter your password.')
    }

    const parsed = signInSchema.safeParse({ email: trimmedEmail, password })
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Please check your email and password.'
      return Alert.alert('Check your details', msg)
    }

    setBusy(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      })

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          Alert.alert(
            'Sign In Failed',
            'Invalid email or password. If you do not have an account yet, please click "Sign Up" below.'
          )
        } else {
          Alert.alert('Sign In Failed', error.message)
        }
        return
      }

      if (data?.session) {
        router.replace('/(app)')
      }
    } catch (e: any) {
      Alert.alert('Sign In Error', e?.message || 'An unexpected error occurred.')
    } finally {
      setBusy(false)
    }
  }

  // Handle Send Mobile OTP
  async function handleSendOtp() {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 7) {
      return Alert.alert('Invalid phone number', 'Please enter a valid phone number (7 to 15 digits).')
    }

    const fullNumber = `${countryCode}${cleanPhone}`
    setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullNumber,
      })

      if (error) {
        return Alert.alert('OTP Failed', error.message)
      }

      setOtpSent(true)
      setResendCooldown(30)
      Alert.alert('OTP Sent', `Verification code sent to ${fullNumber}`)
    } catch (e: any) {
      Alert.alert('OTP Error', e?.message || 'Unable to send OTP.')
    } finally {
      setBusy(false)
    }
  }

  // Handle Verify Mobile OTP
  async function handleVerifyOtp() {
    if (!otpCode || otpCode.trim().length < 6) {
      return Alert.alert('Invalid OTP', 'Please enter the 6-digit code sent to your phone.')
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '')
    const fullNumber = `${countryCode}${cleanPhone}`

    setBusy(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullNumber,
        token: otpCode.trim(),
        type: 'sms',
      })

      if (error) {
        return Alert.alert('Verification failed', error.message)
      }

      if (data?.session) {
        router.replace('/(app)')
      }
    } catch (e: any) {
      Alert.alert('Verification Error', e?.message || 'Unable to verify code.')
    } finally {
      setBusy(false)
    }
  }

  // Handle Google Sign-in
  async function handleGoogleSignIn() {
    setBusy(true)
    try {
      const redirectUrl =
        Platform.OS === 'web' && typeof window !== 'undefined'
          ? window.location.origin
          : Linking.createURL('/')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: Platform.OS === 'web' ? false : true,
        },
      })

      if (error) {
        Alert.alert('Google Sign-in Error', error.message)
        return
      }

      if (Platform.OS !== 'web' && data?.url) {
        await Linking.openURL(data.url)
      }
    } catch (e: any) {
      Alert.alert('Google Sign-in Error', e?.message || 'Unable to connect to Google.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      {/* Decorative ambient background accents */}
      <View pointerEvents='none' style={styles.topGlow} />
      <View pointerEvents='none' style={styles.bottomGlow} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.contentWrapper}>
          {/* Web Logo & Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.brandIconBox}>
              <Command size={22} color='#7c3aed' />
            </View>
            <Text style={styles.brandTitle}>AmogaApp</Text>
          </View>

          {/* Main Card Container */}
          <Card style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sign in</Text>
              <Text style={styles.cardDescription}>
                Enter your credentials below to log into your account. Don't have an account?{' '}
                <Link href='/(auth)/sign-up' style={styles.linkText}>
                  Sign Up
                </Link>
              </Text>
            </View>

            {/* Tabs List matching Web (Mobile vs Login) */}
            <View style={styles.tabsList}>
              <Pressable
                onPress={() => setActiveTab('mobile')}
                style={[
                  styles.tabTrigger,
                  activeTab === 'mobile' && styles.tabTriggerActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'mobile' && styles.tabTextActive,
                  ]}
                >
                  Mobile
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('login')}
                style={[
                  styles.tabTrigger,
                  activeTab === 'login' && styles.tabTriggerActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'login' && styles.tabTextActive,
                  ]}
                >
                  Login
                </Text>
              </Pressable>
            </View>

            {/* TAB CONTENT: LOGIN (Email / Password) */}
            {activeTab === 'login' && (
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={18} color='#94a3b8' style={styles.inputIcon} />
                    <TextInput
                      autoCapitalize='none'
                      keyboardType='email-address'
                      placeholder='name@example.com'
                      placeholderTextColor='#94a3b8'
                      value={email}
                      onChangeText={setEmail}
                      style={styles.textInput}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Password</Text>
                    <Pressable
                      onPress={() =>
                        Alert.alert(
                          'Reset Password',
                          'To reset your password, please check your Supabase authentication configuration.'
                        )
                      }
                    >
                      <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </Pressable>
                  </View>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      placeholder='Password'
                      placeholderTextColor='#94a3b8'
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      style={styles.textInput}
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={styles.eyeIconPressable}
                    >
                      {showPassword ? (
                        <EyeOff size={18} color='#94a3b8' />
                      ) : (
                        <Eye size={18} color='#94a3b8' />
                      )}
                    </Pressable>
                  </View>
                </View>

                <Button
                  loading={busy}
                  onPress={handleEmailSignIn}
                  style={styles.primaryButton}
                >
                  Sign In
                </Button>

                {/* Social Login Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google Sign-in Button */}
                <Button
                  variant='outline'
                  loading={busy}
                  onPress={handleGoogleSignIn}
                  style={styles.socialButton}
                >
                  <View style={styles.googleIconBadge}>
                    <Text style={styles.googleIconText}>G</Text>
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </Button>
              </View>
            )}

            {/* TAB CONTENT: MOBILE (OTP Authentication) */}
            {activeTab === 'mobile' && (
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View style={styles.phoneInputRow}>
                    <View style={styles.countryCodeBox}>
                      <TextInput
                        value={countryCode}
                        onChangeText={setCountryCode}
                        keyboardType='phone-pad'
                        style={styles.countryCodeInput}
                      />
                    </View>

                    <View style={[styles.inputWrapper, { flex: 1 }]}>
                      <Smartphone size={18} color='#94a3b8' style={styles.inputIcon} />
                      <TextInput
                        keyboardType='phone-pad'
                        placeholder='Mobile number'
                        placeholderTextColor='#94a3b8'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.textInput}
                      />
                    </View>
                  </View>
                </View>

                {otpSent && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Enter 6-Digit OTP</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        keyboardType='number-pad'
                        maxLength={6}
                        placeholder='123456'
                        placeholderTextColor='#94a3b8'
                        value={otpCode}
                        onChangeText={setOtpCode}
                        style={styles.otpInput}
                      />
                    </View>

                    <View style={styles.otpResendRow}>
                      <Text style={styles.resendPrompt}>Didn't receive code?</Text>
                      <Pressable
                        disabled={resendCooldown > 0 || busy}
                        onPress={handleSendOtp}
                      >
                        <Text
                          style={[
                            styles.resendLink,
                            resendCooldown > 0 && styles.resendDisabled,
                          ]}
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
                  style={styles.primaryButton}
                >
                  {otpSent ? 'Verify & Sign In' : 'Send OTP'}
                </Button>
              </View>
            )}

            {/* Card Footer matching Web */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>
                By clicking sign in, you agree to our{' '}
                <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
                <Text style={styles.footerLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  topGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#7c3aed',
    opacity: 0.08,
  },
  bottomGlow: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#7c3aed',
    opacity: 0.08,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  brandIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 19,
  },
  linkText: {
    color: '#7c3aed',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  tabsList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 20,
  },
  tabTrigger: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabTriggerActive: {
    borderBottomColor: '#7c3aed',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#7c3aed',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    paddingVertical: 10,
  },
  eyeIconPressable: {
    padding: 6,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBox: {
    width: 76,
    minHeight: 46,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  otpInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 6,
    textAlign: 'center',
    color: '#0f172a',
    paddingVertical: 8,
  },
  otpResendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  resendPrompt: {
    fontSize: 12,
    color: '#64748b',
  },
  resendLink: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    color: '#94a3b8',
    textDecorationLine: 'none',
  },
  primaryButton: {
    backgroundColor: '#7c3aed',
    minHeight: 46,
    borderRadius: 10,
    marginTop: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  socialButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 46,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  googleIconText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    color: '#64748b',
    textDecorationLine: 'underline',
  },
})
