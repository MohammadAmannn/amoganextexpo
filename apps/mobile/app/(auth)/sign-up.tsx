import { useState } from 'react'
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
import { Command, Eye, EyeOff, Mail, User } from 'lucide-react-native'
import { signUpSchema } from '@amoga/schemas'
import { supabase } from '@/lib/supabase'
import { Button, Card, Text } from '@/components/ui'

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSignUp() {
    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedFullName) {
      return Alert.alert('Full Name Required', 'Please enter your full name.')
    }
    if (!trimmedEmail) {
      return Alert.alert('Email Required', 'Please enter your email address.')
    }
    if (!password) {
      return Alert.alert('Password Required', 'Please enter a password.')
    }

    const parsed = signUpSchema.safeParse({
      fullName: trimmedFullName,
      email: trimmedEmail,
      password,
    })

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Please check your details.'
      return Alert.alert('Check your details', msg)
    }

    setBusy(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            full_name: parsed.data.fullName,
          },
        },
      })

      if (error) {
        Alert.alert('Sign up failed', error.message)
        return
      }

      if (data?.session) {
        router.replace('/(app)')
      } else {
        Alert.alert(
          'Account Created',
          'Please check your email to confirm your account, then sign in.',
          [
            {
              text: 'Go to Sign In',
              onPress: () => router.replace('/(auth)/sign-in'),
            },
          ]
        )
      }
    } catch (e: any) {
      Alert.alert('Sign up error', e?.message || 'An unexpected error occurred.')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogleSignUp() {
    setBusy(true)
    try {
      const redirectUrl = Linking.createURL('/')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      })

      if (error) {
        Alert.alert('Google Sign-in Error', error.message)
        return
      }

      if (data?.url) {
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
      <View pointerEvents='none' style={styles.topGlow} />
      <View pointerEvents='none' style={styles.bottomGlow} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.contentWrapper}>
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.brandIconBox}>
              <Command size={22} color='#7c3aed' />
            </View>
            <Text style={styles.brandTitle}>AmogaApp</Text>
          </View>

          {/* Main Card */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Create an account</Text>
              <Text style={styles.cardDescription}>
                Enter your information below to create your account. Already have an account?{' '}
                <Link href='/(auth)/sign-in' style={styles.linkText}>
                  Sign In
                </Link>
              </Text>
            </View>

            <View style={styles.formContainer}>
              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <User size={18} color='#94a3b8' style={styles.inputIcon} />
                  <TextInput
                    placeholder='John Doe'
                    placeholderTextColor='#94a3b8'
                    value={fullName}
                    onChangeText={setFullName}
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Email Input */}
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

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password (8+ characters)</Text>
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

              {/* Submit Button */}
              <Button
                loading={busy}
                onPress={handleSignUp}
                style={styles.primaryButton}
              >
                Create Account
              </Button>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Button */}
              <Button
                variant='outline'
                loading={busy}
                onPress={handleGoogleSignUp}
                style={styles.socialButton}
              >
                <View style={styles.googleIconBadge}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.socialButtonText}>Sign up with Google</Text>
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>
                By creating an account, you agree to our{' '}
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
