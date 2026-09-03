import React, { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Command, Mail } from 'lucide-react-native'
import { supabase } from '@/lib/supabase'
import { Button, Card, Text } from '@/components/ui'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleResetPassword() {
    const trimmed = email.trim()
    if (!trimmed) {
      return Alert.alert('Email Required', 'Please enter your registered email address.')
    }

    setBusy(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed)
      if (error) {
        Alert.alert('Reset Failed', error.message)
        return
      }

      Alert.alert(
        'Check Your Email',
        'We have sent password reset instructions to your email address.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/sign-in') }]
      )
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to process reset request.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.contentWrapper}>
          <View style={styles.brandHeader}>
            <View style={styles.brandIconBox}>
              <Command size={22} color='#059669' strokeWidth={2.5} />
            </View>
            <Text style={styles.brandTitle}>AmogaApp</Text>
          </View>

          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Forgot Password</Text>
              <Text style={styles.cardDescription}>
                Enter your registered email and we will send you a link to reset your password.
              </Text>
            </View>

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

              <Button
                loading={busy}
                onPress={handleResetPassword}
                style={styles.primaryButton}
              >
                Send Reset Link
              </Button>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>
                Remember your password?{' '}
                <Link href='/(auth)/sign-in' style={styles.footerLink}>
                  Sign in
                </Link>
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
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
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
  primaryButton: {
    backgroundColor: '#059669',
    minHeight: 46,
    borderRadius: 10,
    marginTop: 6,
  },
  cardFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
  },
  footerLink: {
    color: '#059669',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
})
