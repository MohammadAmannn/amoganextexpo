import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Menu, Search, Bell } from 'lucide-react-native'
import { useNotificationStore } from '../../stores/notification-store'
import { useRouter } from 'expo-router'

interface AppHeaderProps {
  title: string
  isDesktop?: boolean
  isSidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  onOpenMobileDrawer?: () => void
  onSearchPress?: () => void
  children?: React.ReactNode
}

export function AppHeader({
  title,
  isDesktop = false,
  isSidebarCollapsed = false,
  onToggleSidebar,
  onOpenMobileDrawer,
  onSearchPress,
  children,
}: AppHeaderProps) {
  const router = useRouter()
  const { unreadCount } = useNotificationStore()

  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        {/* On mobile, show the drawer hamburger trigger */}
        {!isDesktop && (
          <Pressable
            onPress={onOpenMobileDrawer}
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.iconBtnPressed,
            ]}
            accessibilityRole='button'
            accessibilityLabel='Open Navigation Menu'
            hitSlop={8}
          >
            <Menu size={20} color='#0f172a' strokeWidth={2.2} />
          </Pressable>
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightGroup}>
        {children}

        <Pressable
          onPress={onSearchPress}
          style={({ pressed }) => [
            styles.iconBtn,
            pressed && styles.iconBtnPressed,
          ]}
          accessibilityRole='button'
          accessibilityLabel='Search'
          hitSlop={8}
        >
          <Search size={18} color='#64748b' strokeWidth={2} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/message' as any)}
          style={({ pressed }) => [
            styles.iconBtn,
            pressed && styles.iconBtnPressed,
          ]}
          accessibilityRole='button'
          accessibilityLabel='Notifications'
          hitSlop={8}
        >
          <Bell size={18} color='#64748b' strokeWidth={2} />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount > 5 ? '5+' : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: 'Open Sans',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    backgroundColor: '#f1f5f9',
  },
  unreadBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
})
