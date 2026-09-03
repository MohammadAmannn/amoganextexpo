import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ComponentBadge } from './ComponentBadge'
import type { GalleryEntry } from '../types'

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
  const fileName = entry.filePath.split('/').pop() || entry.filePath

  return (
    <Pressable
      onPress={() => onSelect(entry)}
      style={({ pressed }) => [
        styles.card,
        isSelected ? styles.cardSelected : styles.cardDefault,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
    >
      {isSelected && <View style={styles.indicatorBar} />}

      <View style={styles.headerRow}>
        <Text
          style={[styles.nameText, isSelected && styles.nameTextSelected]}
          numberOfLines={1}
        >
          {entry.name}
        </Text>
        <ComponentBadge category={entry.category} badgeText={entry.badge} />
      </View>

      <Text style={styles.fileNameText} numberOfLines={1}>
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
  cardDefault: {
    backgroundColor: '#ffffff',
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderColor: 'rgba(199, 210, 254, 0.6)',
  },
  cardPressed: {
    opacity: 0.9,
    backgroundColor: 'rgba(241, 245, 249, 0.6)',
  },
  indicatorBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 2.5,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: '#4f46e5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#1e293b',
  },
  nameTextSelected: {
    fontWeight: '600',
    color: '#0f172a',
  },
  fileNameText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: '#64748b',
  },
})
