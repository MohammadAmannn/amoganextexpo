import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Menu, Search, Bell } from 'lucide-react-native'
import { useNotificationStore } from '../../stores/notification-store'
import { useRouter } from 'expo-router'
import { useTheme } from '@/providers/theme-provider'

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
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftGroup}>
        {/* On mobile, show the drawer hamburger trigger */}
        {!isDesktop && (
          <Pressable
            onPress={onOpenMobileDrawer}
            style={({ pressed }) => [
              styles.iconBtn,
              { backgroundColor: pressed ? colors.secondary : 'transparent' },
            ]}
            accessibilityRole='button'
            accessibilityLabel='Open Navigation Menu'
            hitSlop={8}
          >
            <Menu size={20} color={colors.foreground} strokeWidth={2.2} />
          </Pressable>
        )}

        <Text
          style={[styles.title, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View style={styles.rightGroup}>
        {children}

        <Pressable
          onPress={onSearchPress}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: pressed ? colors.secondary : 'transparent' },
          ]}
          accessibilityRole='button'
          accessibilityLabel='Search'
          hitSlop={8}
        >
          <Search size={18} color={colors.mutedForeground} strokeWidth={2} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/message' as any)}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: pressed ? colors.secondary : 'transparent' },
          ]}
          accessibilityRole='button'
          accessibilityLabel='Notifications'
          hitSlop={8}
        >
          <Bell size={18} color={colors.mutedForeground} strokeWidth={2} />
          {unreadCount > 0 && (
            <View
              style={[
                styles.unreadBadge,
                { backgroundColor: colors.destructive || '#ef4444' },
              ]}
            >
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
    borderBottomWidth: 1,
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
  unreadBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
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
    fontFamily: 'Open Sans',
  },
})
