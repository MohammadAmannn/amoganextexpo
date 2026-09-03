import React from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { LayoutGrid } from 'lucide-react-native'
import { CATEGORY_CONFIG, GALLERY_CATEGORIES } from '../data/categories'
import type { GalleryCategory } from '../types'

interface CategoryFilterProps {
  activeCategory: GalleryCategory
  categoryCounts: Record<string, number>
  onSelectCategory: (category: GalleryCategory) => void
}

export function CategoryFilter({
  activeCategory,
  categoryCounts,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.chipsWrap}>
          {GALLERY_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] ?? 0
            if (count === 0 && cat !== 'All') return null

            const isActive = activeCategory === cat
            const config = CATEGORY_CONFIG[cat]
            const IconComponent = config?.icon || LayoutGrid

            const activeBg = config?.activeBg || 'rgba(16, 185, 129, 0.15)'
            const activeText = config?.activeText || '#059669'
            const activeBorder = config?.activeBorder || 'rgba(16, 185, 129, 0.35)'
            const badgeBg = isActive
              ? config?.badgeActiveBg || 'rgba(16, 185, 129, 0.25)'
              : '#f1f5f9'
            const badgeText = isActive
              ? config?.badgeActiveText || '#047857'
              : '#64748b'

            return (
              <Pressable
                key={cat}
                onPress={() => onSelectCategory(cat)}
                style={({ pressed }) => [
                  styles.chip,
                  isActive
                    ? {
                        backgroundColor: activeBg,
                        borderColor: activeBorder,
                      }
                    : styles.chipInactive,
                  pressed && styles.chipPressed,
                ]}
                accessibilityRole='button'
                accessibilityState={{ selected: isActive }}
              >
                <IconComponent
                  size={14}
                  color={isActive ? activeText : '#64748b'}
                  strokeWidth={isActive ? 2.2 : 2}
                />
                <Text
                  style={[
                    styles.chipLabel,
                    {
                      color: isActive ? activeText : '#64748b',
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                >
                  {cat}
                </Text>
                <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                  <Text style={[styles.badgeText, { color: badgeText }]}>
                    {count}
                  </Text>
                </View>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 130,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: 'rgba(248, 250, 252, 0.6)',
  },
  scrollView: {
    maxHeight: 130,
  },
  scrollContent: {
    padding: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipInactive: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  chipPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  chipLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  badge: {
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 12,
  },
})
