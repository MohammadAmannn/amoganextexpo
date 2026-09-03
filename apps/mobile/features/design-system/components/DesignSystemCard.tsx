import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ComponentBadge } from './ComponentBadge'
import type { GalleryEntry } from '../types'
import { useTheme } from '@/providers/theme-provider'

interface DesignSystemCardProps {
  entry: GalleryEntry
  isSelected: boolean
  onSelect: (entry: GalleryEntry) => void
}

export function DesignSystemCard({
  entry,
  isSelected,
  onSelect,
}: DesignSystemCardProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const fileName = entry.filePath.split('/').pop() || entry.filePath

  return (
    <Pressable
      onPress={() => onSelect(entry)}
      style={({ pressed }) => [
        styles.card,
        isSelected
          ? {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(99, 102, 241, 0.08)',
              borderColor: colors.primary,
            }
          : {
              backgroundColor: isDark ? colors.card : '#ffffff',
              borderColor: colors.border,
            },
        pressed && { opacity: 0.8 },
      ]}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
    >
      {isSelected && (
        <View
          style={[
            styles.indicatorBar,
            { backgroundColor: colors.primary },
          ]}
        />
      )}

      <View style={styles.headerRow}>
        <Text
          style={[
            styles.nameText,
            {
              color: isSelected ? colors.foreground : colors.foreground,
              fontWeight: isSelected ? '700' : '500',
            },
          ]}
          numberOfLines={1}
        >
          {entry.name}
        </Text>
        <ComponentBadge category={entry.category} badgeText={entry.badge} />
      </View>

      <Text
        style={[styles.fileNameText, { color: colors.mutedForeground }]}
        numberOfLines={1}
      >
        {fileName}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    overflow: 'hidden',
  },
  indicatorBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Open Sans',
  },
  fileNameText: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'Open Sans',
  },
})
