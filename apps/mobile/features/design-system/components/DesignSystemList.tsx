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
  const renderItem = ({ item }: { item: GalleryEntry }) => (
    <DesignSystemCard
      entry={item}
      isSelected={selectedId === item.id}
      onSelect={onSelectEntry}
    />
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No components matching "{searchQuery}"
      </Text>
      <Pressable onPress={onClearSearch} hitSlop={8} style={styles.clearSearchButton}>
        <Text style={styles.clearSearchText}>Clear search</Text>
      </Pressable>
    </View>
  )

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>shadcn/ui • TailwindCSS • React 19</Text>
    </View>
  )

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={entries.length > 0 ? renderFooter : null}
      contentContainerStyle={styles.listContent}
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
    color: '#64748b',
    textAlign: 'center',
  },
  clearSearchButton: {
    marginTop: 8,
    padding: 4,
  },
  clearSearchText: {
    fontSize: 12,
    color: '#059669',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  footerContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#64748b',
    textAlign: 'center',
  },
})
