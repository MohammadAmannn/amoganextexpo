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
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : colors.secondary,
          borderBottomColor: colors.border,
        },
      ]}
    >
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

            return (
              <Pressable
                key={cat}
                onPress={() => onSelectCategory(cat)}
                style={({ pressed }) => [
                  styles.chip,
                  isActive
                    ? {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      }
                    : {
                        backgroundColor: isDark ? colors.background : '#ffffff',
                        borderColor: colors.border,
                      },
                  pressed && styles.chipPressed,
                ]}
                accessibilityRole='button'
                accessibilityState={{ selected: isActive }}
              >
                <IconComponent
                  size={14}
                  color={
                    isActive
                      ? colors.primaryForeground || '#ffffff'
                      : colors.mutedForeground
                  }
                  strokeWidth={isActive ? 2.2 : 2}
                />
                <Text
                  style={[
                    styles.chipLabel,
                    {
                      color: isActive
                        ? colors.primaryForeground || '#ffffff'
                        : colors.foreground,
                      fontWeight: isActive ? '700' : '500',
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
                        ? 'rgba(255, 255, 255, 0.25)'
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
                        color: isActive
                          ? colors.primaryForeground || '#ffffff'
                          : colors.mutedForeground,
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
    maxHeight: 130,
    borderBottomWidth: 1,
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
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    lineHeight: 12,
  },
})
