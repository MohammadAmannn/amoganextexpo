import React, { useState } from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import {
  Bell,
  Bot,
  Calendar,
  FileText,
  Mail,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  X,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import {
  NotificationCardItem,
  type NotificationItem,
} from './notification-card-item'
import { NotificationDetailPanel } from './notification-detail-panel'

export const mockNotificationsData: NotificationItem[] = [
  {
    id: 'demo-notif-001',
    user_id: 'preview-user',
    message_text: 'Alex Johnson send you a msg: "Hey, are the designs ready?"',
    read: false,
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    sender_id: 'user-preview-alex',
    sender: {
      id: 'user-001',
      name: 'Alex Johnson',
      email: 'alex@demo.com',
      avatar: null,
    },
    messageDetail: {
      id: 'msg-notif-001',
      conversation_id: 'conv-001',
      sender_user_id: 'user-001',
      message:
        'Hey, please review the latest sprint updates and let me know if you need any clarification on the OAuth deliverables.',
      message_type: 'text',
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      sender: {
        id: 'user-001',
        name: 'Alex Johnson',
        email: 'alex@demo.com',
        avatar: null,
      },
    },
  },
  {
    id: 'demo-notif-002',
    user_id: 'preview-user',
    message_text: 'Sam Rivera send you a msg: "Q3-Report-2026.pdf shared"',
    read: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    sender_id: 'user-preview-sam',
    sender: {
      id: 'user-002',
      name: 'Sam Rivera',
      email: 'sam.rivera@company.com',
      avatar: null,
    },
    messageDetail: {
      id: 'msg-notif-002',
      conversation_id: 'conv-002',
      sender_user_id: 'user-002',
      message:
        'Here is the completed Q3 performance report for review. All metrics are updated according to latest data.',
      message_type: 'document',
      file_url: 'https://example.com/Q3-Report-2026.pdf',
      file_name: 'Q3-Report-2026.pdf',
      file_size: 1548576,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      sender: {
        id: 'user-002',
        name: 'Sam Rivera',
        email: 'sam.rivera@company.com',
        avatar: null,
      },
    },
  },
  {
    id: 'demo-notif-003',
    user_id: 'preview-user',
    message_text: 'Jordan Lee send you a msg: "Please review the Q3 update"',
    read: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sender_id: 'user-preview-jordan',
    sender: {
      id: 'user-003',
      name: 'Jordan Lee',
      email: 'jordan.lee@domain.org',
      avatar: null,
    },
    messageDetail: {
      id: 'msg-notif-003',
      conversation_id: 'conv-003',
      sender_user_id: 'user-003',
      message:
        'Please review the Q3 update when you have a moment. Everything has been tested and ready for deployment.',
      message_type: 'text',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sender: {
        id: 'user-003',
        name: 'Jordan Lee',
        email: 'jordan.lee@domain.org',
        avatar: null,
      },
    },
  },
]

interface CompleteNotificationPageProps {
  initialNotifications?: NotificationItem[]
  onNotificationSelect?: (notification: NotificationItem) => void
  style?: any
}

export function CompleteNotificationPage({
  initialNotifications = mockNotificationsData,
  onNotificationSelect,
  style,
}: CompleteNotificationPageProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotifications
  )
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(notifications[0] || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('mail')

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleSelect = (notif: NotificationItem) => {
    setSelectedNotification(notif)
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    )
    onNotificationSelect?.(notif)
  }

  const handleDelete = (notifId: string) => {
    setNotifications((prev) => {
      const remaining = prev.filter((n) => n.id !== notifId)
      if (selectedNotification?.id === notifId) {
        setSelectedNotification(remaining[0] || null)
      }
      return remaining
    })
  }

  const filteredNotifications = notifications.filter((n) =>
    n.message_text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#09090b' : '#ffffff',
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
      <View
        style={[
          styles.sidebar,
          {
            backgroundColor: isDark ? '#0f0f12' : '#f8fafc',
            borderRightColor: isDark ? colors.border : '#e2e8f0',
          },
        ]}
      >
        {/* 1. Sidebar Header */}
        <View
          style={[
            styles.sidebarHeader,
            { borderBottomColor: isDark ? colors.border : '#f1f5f9' },
          ]}
        >
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Messages
          </Text>

          <View style={styles.headerIcons}>
            <Pressable
              hitSlop={6}
              style={styles.iconBtn}
              accessibilityLabel="Settings"
            >
              <Settings
                size={16}
                color={colors.mutedForeground}
                strokeWidth={1.8}
              />
            </Pressable>

            <Pressable
              hitSlop={6}
              style={[
                styles.iconBtn,
                styles.activeIconBtn,
                { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff' },
              ]}
              accessibilityLabel="Notifications"
            >
              <Bell
                size={16}
                color={isDark ? '#a5b4fc' : '#4f46e5'}
                strokeWidth={1.8}
              />
              {unreadCount > 0 && (
                <View style={styles.unreadCountBadge}>
                  <Text style={styles.unreadCountText}>
                    {unreadCount > 5 ? '5+' : unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* 2. Category Toolbar */}
        <View style={styles.toolbarContainer}>
          <View
            style={[
              styles.toolbarBox,
              { backgroundColor: isDark ? '#18181b' : 'rgba(0,0,0,0.03)' },
            ]}
          >
            {/* Task / Calendar */}
            <Pressable
              onPress={() => setActiveCategory('tasks')}
              style={[
                styles.toolBtn,
                activeCategory === 'tasks' && {
                  backgroundColor: isDark
                    ? 'rgba(168, 85, 247, 0.2)'
                    : '#f3e8ff',
                },
              ]}
            >
              <Calendar
                size={15}
                color={
                  activeCategory === 'tasks'
                    ? isDark
                      ? '#c084fc'
                      : '#9333ea'
                    : colors.mutedForeground
                }
                strokeWidth={1.8}
              />
            </Pressable>

            {/* Mail */}
            <Pressable
              onPress={() => setActiveCategory('mail')}
              style={[
                styles.toolBtn,
                activeCategory === 'mail' && {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.2)'
                    : '#e0e7ff',
                },
              ]}
            >
              <Mail
                size={15}
                color={
                  activeCategory === 'mail'
                    ? isDark
                      ? '#a5b4fc'
                      : '#4f46e5'
                    : colors.mutedForeground
                }
                strokeWidth={1.8}
              />
            </Pressable>

            {/* Chat */}
            <Pressable
              onPress={() => setActiveCategory('chat')}
              style={[
                styles.toolBtn,
                activeCategory === 'chat' && {
                  backgroundColor: isDark
                    ? 'rgba(16, 185, 129, 0.2)'
                    : '#d1fae5',
                },
              ]}
            >
              <MessageSquare
                size={15}
                color={
                  activeCategory === 'chat'
                    ? isDark
                      ? '#34d399'
                      : '#059669'
                    : colors.mutedForeground
                }
                strokeWidth={1.8}
              />
            </Pressable>

            {/* AI */}
            <Pressable
              onPress={() => setActiveCategory('ai')}
              style={[
                styles.toolBtn,
                activeCategory === 'ai' && {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.2)'
                    : '#e0e7ff',
                },
              ]}
            >
              <Sparkles
                size={15}
                color={
                  activeCategory === 'ai'
                    ? isDark
                      ? '#a5b4fc'
                      : '#4f46e5'
                    : colors.mutedForeground
                }
                strokeWidth={1.8}
              />
            </Pressable>

            {/* AI Assistant */}
            <Pressable
              onPress={() => setActiveCategory('ai-assistant')}
              style={[
                styles.toolBtn,
                activeCategory === 'ai-assistant' && {
                  backgroundColor: isDark
                    ? 'rgba(99, 102, 241, 0.2)'
                    : '#e0e7ff',
                },
              ]}
            >
              <Bot
                size={15}
                color={
                  activeCategory === 'ai-assistant'
                    ? isDark
                      ? '#a5b4fc'
                      : '#4f46e5'
                    : colors.mutedForeground
                }
                strokeWidth={1.8}
              />
            </Pressable>

            {/* Files */}
            <Pressable
              onPress={() => setActiveCategory('files')}
              style={[
                styles.toolBtn,
                activeCategory === 'files' && {
                  backgroundColor: isDark
                    ? 'rgba(14, 165, 233, 0.2)'
                    : '#e0f2fe',
                },
              ]}
            >
              <FileText
                size={15}
                color={
                  activeCategory === 'files'
                    ? isDark
                      ? '#38bdf8'
                      : '#0284c7'
                    : colors.mutedForeground
                }
                strokeWidth={1.8}
              />
            </Pressable>
          </View>
        </View>

        {/* 3. Search Bar */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? colors.border : '#e2e8f0',
              },
            ]}
          >
            <Search
              size={14}
              color={colors.mutedForeground}
              strokeWidth={1.8}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                <X size={13} color={colors.mutedForeground} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* 4. Section Label */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Bell
              size={13}
              color={isDark ? '#818cf8' : '#4f46e5'}
              strokeWidth={1.8}
            />
            <Text
              style={[styles.sectionTitle, { color: colors.mutedForeground }]}
            >
              NOTIFICATIONS
            </Text>
          </View>
          <Text
            style={[styles.sectionCount, { color: colors.mutedForeground }]}
          >
            {filteredNotifications.length}
          </Text>
        </View>

        {/* 5. Notification Cards List */}
        <ScrollView
          style={styles.cardsList}
          contentContainerStyle={styles.cardsListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.map((notif) => (
            <NotificationCardItem
              key={notif.id}
              notification={notif}
              isSelected={selectedNotification?.id === notif.id}
              onSelect={handleSelect}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── RIGHT MAIN PANEL ──────────────────────────────────── */}
      <View
        style={[
          styles.mainPanel,
          { backgroundColor: isDark ? '#09090b' : '#ffffff' },
        ]}
      >
        {selectedNotification ? (
          <NotificationDetailPanel
            notification={selectedNotification}
            onDelete={() => handleDelete(selectedNotification.id)}
            onClose={() => setSelectedNotification(null)}
          />
        ) : (
          <View style={styles.emptyView}>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              Select a notification from the left to view details
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 520,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: 320,
    height: '100%',
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  headerIcons: {
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
    position: 'relative',
  },
  activeIconBtn: {
    borderRadius: 6,
  },
  unreadCountBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  unreadCountText: {
    color: '#ffffff',
    fontSize: 8.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  toolbarContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  toolbarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  toolBtn: {
    flex: 1,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12,
    fontFamily: 'Open Sans',
    fontWeight: '400',
    padding: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
    fontWeight: '500',
    letterSpacing: 0.8,
  },
  sectionCount: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
  cardsList: {
    flex: 1,
  },
  cardsListContent: {
    paddingVertical: 4,
  },
  mainPanel: {
    flex: 1,
    height: '100%',
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    fontWeight: '400',
  },
})
