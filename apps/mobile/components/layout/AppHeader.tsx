import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Command, Search, Bell } from 'lucide-react-native'
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
      {/* Left side: Logo + Page title */}
      {!isDesktop ? (
        <Pressable
          style={styles.leftGroup}
          onPress={onOpenMobileDrawer}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityLabel='Open Navigation Menu'
        >
          <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
            <Command
              size={16}
              color={colors.primaryForeground || '#ffffff'}
              strokeWidth={2.2}
            />
          </View>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.leftGroup}>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}

      {/* Right side: Actions, Search, Notifications */}
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
          <Search size={16} color={colors.mutedForeground} strokeWidth={2} />
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
          <Bell size={16} color={colors.mutedForeground} strokeWidth={2} />
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
    height: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: -0.3,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
})
