import React from 'react'
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { DesignSystemCard } from './DesignSystemCard'
import type { GalleryEntry } from '../types'
import { useTheme } from '@/providers/theme-provider'

interface DesignSystemListProps {
  entries: GalleryEntry[]
  selectedId: string | null
  searchQuery: string
  onSelectEntry: (entry: GalleryEntry) => void
  onClearSearch: () => void
}

export function DesignSystemList({
  entries,
  selectedId,
  searchQuery,
  onSelectEntry,
  onClearSearch,
}: DesignSystemListProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const renderItem = ({ item }: { item: GalleryEntry }) => (
    <DesignSystemCard
      entry={item}
      isSelected={selectedId === item.id}
      onSelect={onSelectEntry}
    />
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
        No components matching "{searchQuery}"
      </Text>
      <Pressable
        onPress={onClearSearch}
        hitSlop={8}
        style={styles.clearSearchButton}
      >
        <Text style={[styles.clearSearchText, { color: colors.primary }]}>
          Clear search
        </Text>
      </Pressable>
    </View>
  )

  const renderFooter = () => (
    <View
      style={[
        styles.footerContainer,
        {
          borderTopColor: colors.border,
          backgroundColor: isDark ? colors.card : colors.secondary,
        },
      ]}
    >
      <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
        shadcn/ui • TailwindCSS • React 19
      </Text>
    </View>
  )

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={entries.length > 0 ? renderFooter : null}
      contentContainerStyle={[
        styles.listContent,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps='handled'
      initialNumToRender={15}
      maxToRenderPerBatch={20}
      windowSize={10}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    padding: 8,
    gap: 4,
  },
  emptyContainer: {
    paddingVertical: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  clearSearchButton: {
    marginTop: 8,
    padding: 4,
  },
  clearSearchText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
  },
})
