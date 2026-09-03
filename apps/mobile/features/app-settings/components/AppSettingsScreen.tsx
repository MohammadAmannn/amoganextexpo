import React, { useState } from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native'
import { UniversalLayout } from '../../../components/layout'
import { useAuthStore } from '../../../stores/auth-store'
import {
  Settings,
  Mail,
  Server,
  Shield,
  CheckCircle2,
  Bell,
  Lock,
} from 'lucide-react-native'
import { Button } from '../../../components/ui'

export function AppSettingsScreen() {
  const { auth } = useAuthStore()

  // Profile fields
  const [name, setName] = useState(auth.user?.name || 'Alex Rivera')
  const [email, setEmail] = useState(auth.user?.email || 'alex@amoga.io')

  // Email Server config
  const [smtpHost, setSmtpHost] = useState('smtp.mailgun.org')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpUser, setSmtpUser] = useState('postmaster@amoga.io')
  const [imapHost, setImapHost] = useState('imap.mailgun.org')
  const [imapPort, setImapPort] = useState('993')
  const [useSsl, setUseSsl] = useState(true)

  // Notification prefs
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)

  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleTestConnection = () => {
    setTesting(true)
    setTimeout(() => {
      setTesting(false)
      Alert.alert(
        'Connection Successful',
        `Connected to SMTP ${smtpHost}:${smtpPort} and IMAP ${imapHost}:${imapPort} with SSL: ${useSsl ? 'Active' : 'Inactive'}`
      )
    }, 600)
  }

  const handleSaveSettings = () => {
    setSaving(true)
    setTimeout(() => {
      auth.setUser({
        ...(auth.user || {
          id: 'user-1',
          accountNo: 'ACC-001',
          role: ['admin'],
        }),
        name,
        email,
      })
      setSaving(false)
      Alert.alert('Saved', 'Application settings have been updated.')
    }, 400)
  }

  return (
    <UniversalLayout title='App Settings'>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* PROFILE SECTION */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Settings size={18} color='#059669' />
              <Text style={styles.sectionTitle}>Account Profile</Text>
            </View>

            <View style={styles.fieldsGrid}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Display Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.fieldInput}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  style={styles.fieldInput}
                />
              </View>
            </View>
          </View>

          {/* EMAIL SERVER (SMTP/IMAP) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Server size={18} color='#059669' />
              <Text style={styles.sectionTitle}>Email Server Settings (SMTP / IMAP)</Text>
            </View>

            <View style={styles.fieldsGrid}>
              <View style={styles.rowTwo}>
                <View style={[styles.fieldGroup, { flex: 2 }]}>
                  <Text style={styles.fieldLabel}>SMTP Host</Text>
                  <TextInput
                    value={smtpHost}
                    onChangeText={setSmtpHost}
                    style={styles.fieldInput}
                  />
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>SMTP Port</Text>
                  <TextInput
                    value={smtpPort}
                    onChangeText={setSmtpPort}
                    keyboardType='numeric'
                    style={styles.fieldInput}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>SMTP Username</Text>
                <TextInput
                  value={smtpUser}
                  onChangeText={setSmtpUser}
                  style={styles.fieldInput}
                />
              </View>

              <View style={styles.rowTwo}>
                <View style={[styles.fieldGroup, { flex: 2 }]}>
                  <Text style={styles.fieldLabel}>IMAP Host</Text>
                  <TextInput
                    value={imapHost}
                    onChangeText={setImapHost}
                    style={styles.fieldInput}
                  />
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>IMAP Port</Text>
                  <TextInput
                    value={imapPort}
                    onChangeText={setImapPort}
                    keyboardType='numeric'
                    style={styles.fieldInput}
                  />
                </View>
              </View>

              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>Require SSL / TLS</Text>
                  <Text style={styles.toggleSub}>
                    Encrypt all communication channels with email relays
                  </Text>
                </View>
                <Switch
                  value={useSsl}
                  onValueChange={setUseSsl}
                  trackColor={{ true: '#059669', false: '#cbd5e1' }}
                />
              </View>
            </View>

            <View style={styles.testBtnBox}>
              <Button
                variant='outline'
                loading={testing}
                onPress={handleTestConnection}
                style={styles.testBtn}
              >
                <Text style={styles.testBtnText}>Test Server Connection</Text>
              </Button>
            </View>
          </View>

          {/* NOTIFICATION PREFERENCES */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Bell size={18} color='#059669' />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>Email Alerts</Text>
                <Text style={styles.toggleSub}>
                  Receive digests and critical security updates via email
                </Text>
              </View>
              <Switch
                value={emailNotifs}
                onValueChange={setEmailNotifs}
                trackColor={{ true: '#059669', false: '#cbd5e1' }}
              />
            </View>

            <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleLabel}>Push Notifications</Text>
                <Text style={styles.toggleSub}>
                  Instant device notifications for mentions and messages
                </Text>
              </View>
              <Switch
                value={pushNotifs}
                onValueChange={setPushNotifs}
                trackColor={{ true: '#059669', false: '#cbd5e1' }}
              />
            </View>
          </View>

          {/* Save Button */}
          <Button
            loading={saving}
            onPress={handleSaveSettings}
            style={styles.saveBtn}
          >
            <View style={styles.saveBtnContent}>
              <CheckCircle2 size={16} color='#ffffff' />
              <Text style={styles.saveBtnText}>Save Preferences</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 720,
    gap: 20,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  fieldsGrid: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  fieldInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  toggleSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  testBtnBox: {
    marginTop: 4,
  },
  testBtn: {
    height: 38,
    borderRadius: 8,
    borderColor: '#e2e8f0',
  },
  testBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  saveBtn: {
    backgroundColor: '#059669',
    height: 44,
    borderRadius: 10,
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
})
