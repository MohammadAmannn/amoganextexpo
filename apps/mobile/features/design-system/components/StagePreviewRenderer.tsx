import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { GalleryEntry } from '../types'
import { Telescope } from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import { AppThemesPreview } from './previews/AppThemesPreview'
import { PrimitivesShowcase } from './previews/PrimitivesShowcase'

interface StagePreviewRendererProps {
  entry: GalleryEntry
}

export function StagePreviewRenderer({ entry }: StagePreviewRendererProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  // 1. Theme preview
  if (
    entry.id === 'app-themes-settings' ||
    entry.name === 'App Theme & Colors' ||
    entry.filePath.includes('themes-tab')
  ) {
    return <AppThemesPreview />
  }

  // 2. Primitives showcase
  if (
    entry.category === 'Primitives' ||
    entry.id.startsWith('primitive-') ||
    entry.filePath.startsWith('components/ui/')
  ) {
    return <PrimitivesShowcase entry={entry} />
  }

  // 3. Fallback coming soon
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.centerContent}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isDark ? colors.card : colors.secondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Telescope size={56} color={colors.primary} strokeWidth={1.6} />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>Coming Soon!</Text>

        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          This page has not been created yet.{'\n'}
          Stay tuned though!
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 480,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    maxWidth: 480,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    fontFamily: 'Open Sans',
    textAlign: 'center',
    lineHeight: 24,
  },
})
