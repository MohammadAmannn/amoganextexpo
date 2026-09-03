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
import { Command, Smartphone } from 'lucide-react-native'
import { supabase } from '@/lib/supabase'
import { Button, Card, Text } from '@/components/ui'

export default function OtpScreen() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSendOtp() {
    const clean = phoneNumber.replace(/\D/g, '')
    if (clean.length < 7) {
      return Alert.alert('Invalid Number', 'Please enter a valid phone number.')
    }
    setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: `+${clean}` })
      if (error) {
        Alert.alert('Error', error.message)
        return
      }
      setOtpSent(true)
      Alert.alert('OTP Sent', 'Please enter the verification code sent to your mobile.')
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to send OTP.')
    } finally {
      setBusy(false)
    }
  }

  async function handleVerifyOtp() {
    if (otpCode.trim().length < 6) {
      return Alert.alert('Invalid Code', 'Please enter the 6-digit OTP.')
    }
    const clean = phoneNumber.replace(/\D/g, '')
    setBusy(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+${clean}`,
        token: otpCode.trim(),
        type: 'sms',
      })
      if (error) {
        Alert.alert('Verification Failed', error.message)
        return
      }
      if (data?.session) {
        router.replace('/(app)')
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Verification failed.')
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
              <Text style={styles.cardTitle}>Mobile Verification</Text>
              <Text style={styles.cardDescription}>
                Enter your mobile number to receive a one-time verification code.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Smartphone size={18} color='#94a3b8' style={styles.inputIcon} />
                  <TextInput
                    keyboardType='phone-pad'
                    placeholder='+1234567890'
                    placeholderTextColor='#94a3b8'
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={styles.textInput}
                    editable={!otpSent}
                  />
                </View>
              </View>

              {otpSent && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>6-Digit OTP</Text>
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
                </View>
              )}

              <Button
                loading={busy}
                onPress={otpSent ? handleVerifyOtp : handleSendOtp}
                style={styles.primaryButton}
              >
                {otpSent ? 'Verify & Login' : 'Send Code'}
              </Button>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>
                Prefer password?{' '}
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
  otpInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 6,
    textAlign: 'center',
    color: '#0f172a',
    paddingVertical: 8,
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
