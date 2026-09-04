import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { GalleryEntry } from '../types'
import { Telescope } from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import { AppThemesPreview } from './previews/AppThemesPreview'
import { LucideIconsPreview } from './previews/LucideIconsPreview'
import { PrimitivesShowcase } from './previews/PrimitivesShowcase'
import { DatePickerPreviews } from './previews/DatePickerPreviews'
import { CalendarPreviews } from './previews/CalendarPreviews'
import { DataCardsPreviews } from './previews/DataCardsPreviews'
import { WizardPreviews } from './previews/WizardPreviews'
import { FilesPreviews } from './previews/FilesPreviews'
import { ChatPreviews } from './previews/ChatPreviews'
import { NotificationPreviews } from './previews/NotificationPreviews'
import { MapPreviews } from './previews/MapPreviews'

interface StagePreviewRendererProps {
  entry: GalleryEntry
}

export function StagePreviewRenderer({ entry }: StagePreviewRendererProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  // 1. Icons gallery preview
  if (
    entry.id === 'lucide-icons-gallery' ||
    entry.name.toLowerCase().includes('icon') ||
    entry.filePath.includes('LucideIconsPreview')
  ) {
    return <LucideIconsPreview />
  }

  // 2. Theme preview
  if (
    entry.category === 'Theme' ||
    entry.id === 'app-themes-settings' ||
    entry.name === 'App Theme & Colors' ||
    entry.filePath.includes('themes-tab')
  ) {
    return <AppThemesPreview />
  }

  // 3. Maps preview
  if (
    entry.category === 'Maps' ||
    entry.id === 'complete-map-template' ||
    entry.name.toLowerCase().includes('map') ||
    entry.filePath.includes('map')
  ) {
    return <MapPreviews entry={entry} />
  }

  // 4. Date Picker preview
  if (
    entry.category === 'Date Picker' ||
    entry.id.startsWith('date-picker-') ||
    entry.name.toLowerCase().includes('date picker')
  ) {
    return <DatePickerPreviews entry={entry} />
  }

  // 5. Calendar preview
  if (
    entry.category === 'Calendar' ||
    entry.id.startsWith('calendar-') ||
    entry.name.toLowerCase().includes('calendar')
  ) {
    return <CalendarPreviews entry={entry} />
  }

  // 6. Data Cards preview
  if (
    entry.category === 'Data Cards' ||
    entry.id.startsWith('card-') ||
    entry.id === 'data-cards-overview' ||
    entry.filePath.includes('DataCardsPreview')
  ) {
    return <DataCardsPreviews entry={entry} />
  }

  // 7. Wizards preview
  if (
    entry.category === 'Wizards' ||
    entry.id.includes('wizard') ||
    entry.filePath.includes('Wizard')
  ) {
    return <WizardPreviews entry={entry} />
  }

  // 8. Files preview
  if (
    entry.category === 'Files' ||
    entry.id.startsWith('file-') ||
    entry.id.startsWith('folder-') ||
    entry.filePath.includes('files')
  ) {
    return <FilesPreviews entry={entry} />
  }

  // 9. Chat preview
  if (
    entry.category === 'Chat' ||
    entry.id.startsWith('chat-') ||
    entry.id.startsWith('message-') ||
    entry.id.startsWith('typing-') ||
    entry.id.startsWith('contact-') ||
    entry.id.startsWith('group-') ||
    entry.filePath.includes('chat')
  ) {
    return <ChatPreviews entry={entry} />
  }

  // 10. Notifications preview
  if (
    entry.category === 'Notifications' ||
    entry.id.includes('notification') ||
    entry.filePath.includes('notification')
  ) {
    return <NotificationPreviews entry={entry} />
  }

  // 11. Primitives showcase
  if (
    entry.category === 'Primitives' ||
    entry.id.startsWith('primitive-') ||
    entry.filePath.startsWith('components/ui/')
  ) {
    return <PrimitivesShowcase entry={entry} />
  }

  // 8. Fallback coming soon
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
