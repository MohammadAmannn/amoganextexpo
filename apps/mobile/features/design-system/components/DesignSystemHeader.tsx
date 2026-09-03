import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Command, Search, Bell } from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

interface DesignSystemHeaderProps {
  onSearchPress?: () => void
  onNotificationsPress?: () => void
}

export function DesignSystemHeader({
  onSearchPress,
  onNotificationsPress,
}: DesignSystemHeaderProps) {
  const { colors } = useTheme()

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftGroup}>
        <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
          <Command size={16} color={colors.primaryForeground || '#ffffff'} strokeWidth={2.2} />
        </View>
        <Text
          style={[styles.headerTitle, { color: colors.foreground }]}
          numberOfLines={1}
        >
          Design System
        </Text>
      </View>

      <View style={styles.rightGroup}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: pressed ? colors.secondary : 'transparent' },
          ]}
          onPress={onSearchPress}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityLabel='Search components'
        >
          <Search size={16} color={colors.mutedForeground} strokeWidth={2} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: pressed ? colors.secondary : 'transparent' },
          ]}
          onPress={onNotificationsPress}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityLabel='Notifications'
        >
          <Bell size={16} color={colors.mutedForeground} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
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
  headerTitle: {
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
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
