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
                ? 'rgba(99, 102, 241, 0.14)'
                : '#eef2ff',
            }
          : {
              backgroundColor: pressed
                ? isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : 'rgba(0, 0, 0, 0.03)'
                : 'transparent',
            },
      ]}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
    >
      {isSelected && (
        <View
          style={[
            styles.indicatorBar,
            { backgroundColor: colors.primary || '#4f46e5' },
          ]}
        />
      )}

      <View style={styles.headerRow}>
        <Text
          style={[
            styles.nameText,
            {
              color: colors.foreground,
              fontWeight: isSelected ? '500' : '400',
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0,
    gap: 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  indicatorBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3.5,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 18,
    fontFamily: 'Open Sans',
    letterSpacing: -0.2,
  },
  fileNameText: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
})
