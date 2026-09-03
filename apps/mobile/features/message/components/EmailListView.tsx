import React from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import type { Email } from '../data/mock-emails'
import { Paperclip } from 'lucide-react-native'

interface EmailListViewProps {
  emails: Email[]
  selectedEmailId: string | null
  onSelectEmail: (email: Email) => void
}

export function EmailListView({
  emails,
  selectedEmailId,
  onSelectEmail,
}: EmailListViewProps) {
  const renderItem = ({ item }: { item: Email }) => {
    const isSelected = selectedEmailId === item.id
    const timeStr = new Date(item.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })

    return (
      <Pressable
        onPress={() => onSelectEmail(item)}
        style={({ pressed }) => [
          styles.card,
          !item.read && styles.cardUnread,
          isSelected && styles.cardSelected,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.senderGroup}>
            {!item.read && <View style={styles.unreadDot} />}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.avatarInitials}</Text>
            </View>
            <Text
              style={[
                styles.senderName,
                !item.read && styles.senderNameUnread,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
          <Text style={styles.timeText}>{timeStr}</Text>
        </View>

        <Text
          style={[styles.subject, !item.read && styles.subjectUnread]}
          numberOfLines={1}
        >
          {item.subject}
        </Text>

        <Text style={styles.preview} numberOfLines={2}>
          {item.preview}
        </Text>

        {item.attachments && item.attachments.length > 0 && (
          <View style={styles.attachmentPill}>
            <Paperclip size={11} color='#64748b' />
            <Text style={styles.attachmentText} numberOfLines={1}>
              {item.attachments[0].name}
            </Text>
          </View>
        )}
      </Pressable>
    )
  }

  return (
    <FlatList
      data={emails}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    padding: 8,
    gap: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  cardUnread: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSelected: {
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
    borderColor: '#94a3b8',
  },
  cardPressed: {
    opacity: 0.88,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  senderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0f172a',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  senderName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    flexShrink: 1,
  },
  senderNameUnread: {
    fontWeight: '700',
    color: '#0f172a',
  },
  timeText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  subject: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
    marginTop: 2,
  },
  subjectUnread: {
    fontWeight: '700',
    color: '#0f172a',
  },
  preview: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  attachmentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  attachmentText: {
    fontSize: 11,
    color: '#64748b',
  },
})
