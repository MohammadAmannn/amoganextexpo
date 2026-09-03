import React from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Search, X } from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

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
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: isDark ? colors.card : colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <Search
          size={14}
          color={colors.mutedForeground}
          strokeWidth={2}
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef as any}
          value={value}
          onChangeText={onChangeText}
          placeholder='Search components, files...'
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.foreground }]}
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
            <X size={13} color={colors.mutedForeground} strokeWidth={2.2} />
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
  },
  inputWrapper: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
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
    fontSize: 13,
    fontFamily: 'Open Sans',
    padding: 0,
  },
  clearButton: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
