import React, { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import type { Email } from '../data/mock-emails'
import {
  ArrowLeft,
  Archive,
  Trash2,
  CornerUpLeft,
  CornerUpRight,
  MoreVertical,
  Paperclip,
  Send,
} from 'lucide-react-native'

interface EmailDetailViewProps {
  email: Email
  onBack?: () => void
  onReply?: () => void
}

export function EmailDetailView({
  email,
  onBack,
  onReply,
}: EmailDetailViewProps) {
  const [quickReply, setQuickReply] = useState('')
  const [replySent, setReplySent] = useState(false)

  const formattedDate = new Date(email.date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const handleSendQuickReply = () => {
    if (!quickReply.trim()) return
    setReplySent(true)
    setQuickReply('')
    setTimeout(() => setReplySent(false), 3000)
  }

  return (
    <View style={styles.container}>
      {/* Top Action Bar */}
      <View style={styles.topBar}>
        <View style={styles.leftActions}>
          {onBack && (
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.iconBtn,
                pressed && styles.btnPressed,
              ]}
              hitSlop={8}
            >
              <ArrowLeft size={18} color='#0f172a' strokeWidth={2.2} />
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.btnPressed,
            ]}
            hitSlop={8}
          >
            <Archive size={16} color='#64748b' />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.btnPressed,
            ]}
            hitSlop={8}
          >
            <Trash2 size={16} color='#ef4444' />
          </Pressable>
        </View>

        <View style={styles.rightActions}>
          <Pressable
            onPress={onReply}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.btnPressed,
            ]}
            hitSlop={8}
          >
            <CornerUpLeft size={15} color='#334155' />
            <Text style={styles.actionBtnText}>Reply</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.btnPressed,
            ]}
            hitSlop={8}
          >
            <MoreVertical size={16} color='#64748b' />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Subject */}
        <Text style={styles.subject}>{email.subject}</Text>

        {/* Sender Info */}
        <View style={styles.senderCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{email.avatarInitials}</Text>
          </View>
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{email.name}</Text>
            <Text style={styles.senderEmail}>From: {email.email}</Text>
          </View>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* Attachments */}
        {email.attachments && email.attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={styles.attachmentsHeading}>ATTACHMENTS</Text>
            {email.attachments.map((att, index) => (
              <View key={index} style={styles.attachmentBox}>
                <Paperclip size={14} color='#059669' />
                <Text style={styles.attachmentName}>{att.name}</Text>
                <Text style={styles.attachmentSize}>{att.size}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Body Content */}
        <View style={styles.bodyBox}>
          <Text style={styles.bodyText}>{email.body}</Text>
        </View>

        {/* Inline Quick Reply Card */}
        <View style={styles.quickReplyCard}>
          <Text style={styles.quickReplyTitle}>Quick Reply</Text>
          <TextInput
            value={quickReply}
            onChangeText={setQuickReply}
            placeholder={`Reply to ${email.name}...`}
            placeholderTextColor='#94a3b8'
            multiline
            style={styles.quickReplyInput}
          />
          <View style={styles.quickReplyFooter}>
            {replySent && (
              <Text style={styles.sentNotification}>✓ Reply sent</Text>
            )}
            <Pressable
              disabled={!quickReply.trim()}
              onPress={handleSendQuickReply}
              style={[
                styles.quickSendBtn,
                !quickReply.trim() && styles.quickSendBtnDisabled,
              ]}
            >
              <Send size={13} color='#ffffff' strokeWidth={2.2} />
              <Text style={styles.quickSendBtnText}>Send</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  btnPressed: {
    opacity: 0.7,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  subject: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 23,
  },
  senderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12,
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  senderEmail: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  dateText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  attachmentsSection: {
    gap: 6,
  },
  attachmentsHeading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#94a3b8',
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  attachmentName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0f172a',
    flex: 1,
  },
  attachmentSize: {
    fontSize: 11,
    color: '#64748b',
  },
  bodyBox: {
    paddingTop: 4,
  },
  bodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 21,
  },
  quickReplyCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  quickReplyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  quickReplyInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    minHeight: 70,
    fontSize: 13,
    color: '#0f172a',
    textAlignVertical: 'top',
  },
  quickReplyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  sentNotification: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  quickSendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickSendBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  quickSendBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
})
