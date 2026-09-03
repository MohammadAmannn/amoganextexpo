import React from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Search, Plus } from 'lucide-react-native'

interface EmailSearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onNewClick: () => void
}

export function EmailSearchBar({
  value,
  onChangeText,
  onNewClick,
}: EmailSearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Search size={14} color='#94a3b8' />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder='Search...'
          placeholderTextColor='#94a3b8'
          style={styles.input}
        />
      </View>

      <Pressable
        onPress={onNewClick}
        style={({ pressed }) => [
          styles.newBtn,
          pressed && styles.newBtnPressed,
        ]}
        hitSlop={6}
      >
        <Plus size={14} color='#ffffff' strokeWidth={2.5} />
        <Text style={styles.newBtnText}>New</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 34,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: '#0f172a',
    padding: 0,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0f172a',
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  newBtnPressed: {
    opacity: 0.85,
  },
  newBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
})
