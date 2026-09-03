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
  Bell,
  Flag,
  MoreVertical,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image as ImageIcon,
  Paperclip,
} from 'lucide-react-native'

interface EmailViewProps {
  email: Email
  onClose?: () => void
}

export function EmailView({ email, onClose }: EmailViewProps) {
  const [subject, setSubject] = useState(email.subject)
  const [body, setBody] = useState(email.body)

  return (
    <View style={styles.container}>
      {/* HEADER ROW */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{email.avatarInitials || 'R'}</Text>
          </View>

          <View style={styles.senderInfo}>
            <Text style={styles.fromLine} numberOfLines={1}>
              From: "{email.name}" &lt;{email.email}&gt;
            </Text>
            <Text style={styles.emailLine} numberOfLines={1}>
              {email.email}
            </Text>
            <Text style={styles.dateLine}>
              to me Aug 14, 2026 3:35 PM - {email.relativeDate || '20 days ago'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn} hitSlop={6}>
            <Bell size={16} color='#f59e0b' />
          </Pressable>
          <Pressable style={styles.iconBtn} hitSlop={6}>
            <Flag size={16} color='#94a3b8' />
          </Pressable>
          <Pressable style={styles.iconBtn} hitSlop={6}>
            <MoreVertical size={16} color='#94a3b8' />
          </Pressable>
          {onClose && (
            <Pressable onPress={onClose} style={styles.iconBtn} hitSlop={6}>
              <X size={16} color='#94a3b8' />
            </Pressable>
          )}
        </View>
      </View>

      {/* CONTENT SCROLL */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SUBJECT BOX */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Subject</Text>
          <View style={styles.subjectBox}>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              style={styles.subjectInput}
            />
          </View>
        </View>

        {/* EMAIL CONTENT BOX */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Email Content</Text>
          <View style={styles.editorBox}>
            {/* Toolbar */}
            <View style={styles.editorToolbar}>
              <Pressable style={styles.toolBtn}>
                <Bold size={14} color='#334155' />
              </Pressable>
              <Pressable style={styles.toolBtn}>
                <Italic size={14} color='#334155' />
              </Pressable>
              <Pressable style={styles.toolBtn}>
                <Underline size={14} color='#334155' />
              </Pressable>
              <View style={styles.toolDivider} />
              <Pressable style={styles.toolBtn}>
                <List size={14} color='#334155' />
              </Pressable>
              <Pressable style={styles.toolBtn}>
                <ListOrdered size={14} color='#334155' />
              </Pressable>
              <View style={styles.toolDivider} />
              <Pressable style={styles.toolBtn}>
                <Link size={14} color='#334155' />
              </Pressable>
              <Pressable style={styles.toolBtn}>
                <ImageIcon size={14} color='#334155' />
              </Pressable>
              <Pressable style={styles.toolBtn}>
                <Paperclip size={14} color='#334155' />
              </Pressable>
            </View>

            {/* Body */}
            <TextInput
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical='top'
              style={styles.bodyInput}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7e22ce',
  },
  senderInfo: {
    flex: 1,
    gap: 1,
  },
  fromLine: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  emailLine: {
    fontSize: 11,
    color: '#64748b',
  },
  dateLine: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  subjectBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    justifyContent: 'center',
  },
  subjectInput: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    padding: 0,
  },
  editorBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  editorToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  toolBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  bodyInput: {
    padding: 14,
    minHeight: 280,
    fontSize: 13,
    color: '#1e293b',
    lineHeight: 20,
  },
})
