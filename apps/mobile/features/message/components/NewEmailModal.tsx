import React, { useState } from 'react'
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Send, X } from 'lucide-react-native'
import { Button } from '../../../components/ui'

interface NewEmailModalProps {
  visible: boolean
  onClose: () => void
  onSend: (email: { to: string; subject: string; body: string }) => void
}

export function NewEmailModal({
  visible,
  onClose,
  onSend,
}: NewEmailModalProps) {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSend = () => {
    if (!to.trim()) return Alert.alert('Recipient Required', 'Please enter a recipient email.')
    if (!subject.trim()) return Alert.alert('Subject Required', 'Please enter a subject.')
    if (!body.trim()) return Alert.alert('Message Required', 'Please write your message body.')

    setBusy(true)
    setTimeout(() => {
      onSend({ to, subject, body })
      setTo('')
      setSubject('')
      setBody('')
      setBusy(false)
      onClose()
    }, 400)
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>New Message</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.btnPressed]}
              hitSlop={8}
            >
              <X size={18} color='#64748b' />
            </Pressable>
          </View>

          {/* Fields */}
          <View style={styles.body}>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>To:</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder='recipient@example.com'
                placeholderTextColor='#94a3b8'
                keyboardType='email-address'
                autoCapitalize='none'
                value={to}
                onChangeText={setTo}
              />
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Subject:</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder='Subject'
                placeholderTextColor='#94a3b8'
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <TextInput
              style={styles.textArea}
              placeholder='Write your message here...'
              placeholderTextColor='#94a3b8'
              multiline
              textAlignVertical='top'
              value={body}
              onChangeText={setBody}
            />
          </View>

          {/* Footer actions */}
          <View style={styles.footer}>
            <Button
              loading={busy}
              onPress={handleSend}
              style={styles.sendButton}
            >
              <View style={styles.sendBtnContent}>
                <Send size={14} color='#ffffff' strokeWidth={2} />
                <Text style={styles.sendBtnText}>Send Message</Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 4,
    borderRadius: 6,
  },
  btnPressed: {
    opacity: 0.7,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
    gap: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    width: 60,
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    padding: 0,
  },
  textArea: {
    height: 140,
    fontSize: 14,
    color: '#0f172a',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'flex-end',
  },
  sendButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 8,
  },
  sendBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
})
