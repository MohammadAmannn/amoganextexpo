import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Command, Search, Bell } from 'lucide-react-native'

interface DesignSystemHeaderProps {
  onSearchPress?: () => void
  onNotificationsPress?: () => void
}

export function DesignSystemHeader({
  onSearchPress,
  onNotificationsPress,
}: DesignSystemHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftGroup}>
        <View style={styles.logoBox}>
          <Command size={16} color='#ffffff' strokeWidth={2.2} />
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Design System
        </Text>
      </View>

      <View style={styles.rightGroup}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onSearchPress}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityLabel='Search components'
        >
          <Search size={16} color='#64748b' strokeWidth={2} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onNotificationsPress}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityLabel='Notifications'
        >
          <Bell size={16} color='#64748b' strokeWidth={2} />
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
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#059669', // Emerald primary
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
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
  iconButtonPressed: {
    backgroundColor: '#f1f5f9',
  },
})
