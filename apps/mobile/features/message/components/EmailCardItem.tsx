import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { Email } from '../data/mock-emails'

interface EmailCardItemProps {
  email: Email
  isSelected: boolean
  onSelect: (email: Email) => void
}

export function EmailCardItem({
  email,
  isSelected,
  onSelect,
}: EmailCardItemProps) {
  return (
    <Pressable
      onPress={() => onSelect(email)}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Top row: Sender Name + Badges + Date */}
      <View style={styles.topRow}>
        <View style={styles.senderAndBadges}>
          <Text style={styles.senderName} numberOfLines={1}>
            {email.name}
          </Text>

          {email.labels.map((lbl, idx) => (
            <View key={idx} style={styles.badgePill}>
              {lbl.toLowerCase() === 'unread' && (
                <View style={styles.unreadDot} />
              )}
              <Text style={styles.badgeText}>{lbl}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.dateText}>{email.relativeDate || '20 days ago'}</Text>
      </View>

      {/* Subject Line */}
      <Text style={styles.subjectText} numberOfLines={1}>
        {email.subject}
      </Text>

      {/* Preview Snippet */}
      <Text style={styles.previewText} numberOfLines={1}>
        {email.preview}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    gap: 3,
  },
  cardSelected: {
    backgroundColor: '#f5f3ff',
    borderColor: '#c7d2fe',
    borderLeftWidth: 3.5,
    borderLeftColor: '#4f46e5',
  },
  cardPressed: {
    opacity: 0.88,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  senderAndBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    flexShrink: 1,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  unreadDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#3b82f6',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#475569',
  },
  dateText: {
    fontSize: 10,
    color: '#94a3b8',
    flexShrink: 0,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  previewText: {
    fontSize: 11,
    color: '#94a3b8',
  },
})
