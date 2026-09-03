import React from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Search, X } from 'lucide-react-native'

interface DesignSystemSearchProps {
  value: string
  onChangeText: (text: string) => void
  onClear: () => void
  inputRef?: React.RefObject<TextInput | null>
}

export function DesignSystemSearch({
  value,
  onChangeText,
  onClear,
  inputRef,
}: DesignSystemSearchProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search size={14} color='#94a3b8' strokeWidth={2} style={styles.searchIcon} />
        <TextInput
          ref={inputRef as any}
          value={value}
          onChangeText={onChangeText}
          placeholder='Search components, files...'
          placeholderTextColor='#94a3b8'
          style={styles.input}
          autoCapitalize='none'
          autoCorrect={false}
          clearButtonMode='never'
        />
        {value.length > 0 && (
          <Pressable
            onPress={onClear}
            hitSlop={8}
            style={styles.clearButton}
            accessibilityRole='button'
            accessibilityLabel='Clear search'
          >
            <X size={13} color='#64748b' strokeWidth={2.2} />
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: '#ffffff',
  },
  inputWrapper: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#0f172a',
    padding: 0,
  },
  clearButton: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
