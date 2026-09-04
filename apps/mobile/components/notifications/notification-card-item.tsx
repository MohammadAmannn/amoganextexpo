import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/providers/theme-provider'

export interface NotificationItem {
  id: string
  user_id?: string
  message_text: string
  read?: boolean
  created_at: string
  sender_id?: string
  sender?: {
    id: string
    name: string
    email: string
    avatar?: string | null
  }
  messageDetail?: {
    id: string
    conversation_id?: string
    sender_user_id?: string | null
    message: string
    message_type?: string
    created_at?: string
    file_url?: string
    file_name?: string
    file_size?: number
    sender?: {
      id: string
      name: string
      email: string
      avatar?: string | null
    }
  }
}

interface NotificationCardItemProps {
  notification: NotificationItem
  isSelected: boolean
  onSelect: (notification: NotificationItem) => void
  style?: any
}

function formatRelativeTime(dateString: string): string {
  try {
    const diff = Date.now() - new Date(dateString).getTime()
    const mins = Math.floor(diff / (1000 * 60))
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  } catch {
    return 'just now'
  }
}

export function NotificationCardItem({
  notification,
  isSelected,
  onSelect,
  style,
}: NotificationCardItemProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const senderName =
    notification.sender?.name ||
    notification.message_text.split(' send you a msg')[0] ||
    'Someone'

  const isUnread = !notification.read

  return (
    <Pressable
      onPress={() => onSelect(notification)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isSelected
            ? isDark
              ? 'rgba(99, 102, 241, 0.18)'
              : 'rgba(99, 102, 241, 0.08)'
            : isUnread
            ? isDark
              ? 'rgba(99, 102, 241, 0.06)'
              : 'rgba(99, 102, 241, 0.03)'
            : 'transparent',
          borderColor: isSelected
            ? isDark
              ? 'rgba(99, 102, 241, 0.35)'
              : 'rgba(199, 210, 254, 0.6)'
            : 'transparent',
        },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {/* Left Active Accent Indicator */}
      {isSelected && (
        <View
          style={[
            styles.indicatorBar,
            { backgroundColor: isDark ? '#818cf8' : '#4f46e5' },
          ]}
        />
      )}

      {/* Top Row: Sender Name + Unread Dot + Notification Badge + Time */}
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <Text
            style={[
              styles.senderText,
              {
                color: colors.foreground,
                fontWeight: isUnread ? '500' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {senderName}
          </Text>

          {isUnread && (
            <View
              style={[
                styles.unreadDot,
                { backgroundColor: isDark ? '#818cf8' : '#4f46e5' },
              ]}
            />
          )}

          <View
            style={[
              styles.badge,
              {
                backgroundColor: isDark
                  ? 'rgba(99, 102, 241, 0.18)'
                  : 'rgba(99, 102, 241, 0.1)',
                borderColor: isDark
                  ? 'rgba(99, 102, 241, 0.3)'
                  : 'rgba(199, 210, 254, 0.5)',
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: isDark ? '#a5b4fc' : '#4f46e5' },
              ]}
            >
              Notification
            </Text>
          </View>
        </View>

        <Text
          style={[styles.timeText, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {formatRelativeTime(notification.created_at)}
        </Text>
      </View>

      {/* Snippet message text */}
      <Text
        style={[styles.messageSnippet, { color: colors.mutedForeground }]}
        numberOfLines={1}
      >
        {notification.message_text}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    marginHorizontal: 12,
    marginVertical: 2,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    gap: 3,
  },
  indicatorBar: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    width: 3,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  senderText: {
    fontSize: 13,
    fontFamily: 'Open Sans',
    maxWidth: 120,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  messageSnippet: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    lineHeight: 16,
  },
})
