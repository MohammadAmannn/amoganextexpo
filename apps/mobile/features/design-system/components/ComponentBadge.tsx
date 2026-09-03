import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CATEGORY_COLORS } from '../data/categories'
import type { GalleryCategory } from '../types'

interface ComponentBadgeProps {
  category: GalleryCategory | string
  badgeText?: string
}

export function ComponentBadge({ category, badgeText }: ComponentBadgeProps) {
  const colorStyle = CATEGORY_COLORS[category] || {
    bg: 'rgba(100, 116, 139, 0.1)',
    text: '#475569',
    border: 'rgba(226, 232, 240, 0.6)',
  }

  const label = (badgeText || category).toUpperCase()

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colorStyle.bg,
          borderColor: colorStyle.border,
        },
      ]}
    >
      <Text
        style={[styles.badgeText, { color: colorStyle.text }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    height: 16,
    paddingHorizontal: 6,
    borderRadius: 9999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    lineHeight: 12,
  },
})
