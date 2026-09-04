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
import { useTheme } from '@/providers/theme-provider'

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
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
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

            const activeBg =
              config?.activeBg ||
              (isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)')
            const activeBorder =
              config?.activeBorder ||
              (isDark ? 'rgba(168, 85, 247, 0.4)' : '#ddd6fe')
            const activeColor =
              config?.activeText ||
              (isDark ? '#c084fc' : '#7c3aed')
            const badgeBg =
              config?.badgeActiveBg ||
              (isDark ? 'rgba(139, 92, 246, 0.25)' : '#ede9fe')
            const badgeColor =
              config?.badgeActiveText ||
              (isDark ? '#c084fc' : '#7c3aed')

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
                    : {
                        backgroundColor: 'transparent',
                        borderColor: isDark ? colors.border : '#e2e8f0',
                      },
                  pressed && styles.chipPressed,
                ]}
                accessibilityRole='button'
                accessibilityState={{ selected: isActive }}
              >
                <IconComponent
                  size={14}
                  color={isActive ? activeColor : colors.mutedForeground}
                  strokeWidth={isActive ? 2.2 : 1.9}
                />
                <Text
                  style={[
                    styles.chipLabel,
                    {
                      color: isActive ? activeColor : colors.foreground,
                      fontWeight: isActive ? '500' : '400',
                    },
                  ]}
                >
                  {cat}
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isActive
                        ? badgeBg
                        : isDark
                        ? colors.secondary
                        : '#f1f5f9',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: isActive ? badgeColor : colors.mutedForeground,
                        fontWeight: '500',
                      },
                    ]}
                  >
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
    maxHeight: 140,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  scrollView: {
    maxHeight: 140,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  chipLabel: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    lineHeight: 16,
  },
  badge: {
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
    lineHeight: 12,
  },
})
