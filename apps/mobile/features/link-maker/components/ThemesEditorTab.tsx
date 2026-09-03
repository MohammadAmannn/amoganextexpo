import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useLinkMakerStore } from '../store'
import type { ThemeConfig } from '../types'
import { Check } from 'lucide-react-native'

const PRESETS: { id: ThemeConfig['preset']; name: string; color: string }[] = [
  { id: 'aura-flow', name: 'Aura Flow', color: '#1e293b' },
  { id: 'sunset-horizon', name: 'Sunset Horizon', color: '#f97316' },
  { id: 'midnight-glow', name: 'Midnight Glow', color: '#0f172a' },
  { id: 'cyber-neo', name: 'Cyber Neo', color: '#064e3b' },
  { id: 'minimal-silk', name: 'Minimal Silk', color: '#f1f5f9' },
]

export function ThemesEditorTab() {
  const { config, updateTheme } = useLinkMakerStore()
  const currentPreset = config.theme.preset

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SELECT THEME PRESET</Text>

      <View style={styles.grid}>
        {PRESETS.map((preset) => {
          const isSelected = currentPreset === preset.id
          return (
            <Pressable
              key={preset.id}
              onPress={() => updateTheme({ preset: preset.id })}
              style={[
                styles.themeCard,
                isSelected && styles.themeCardSelected,
              ]}
            >
              <View
                style={[
                  styles.previewBox,
                  { backgroundColor: preset.color },
                ]}
              >
                {isSelected && <Check size={18} color='#ffffff' strokeWidth={3} />}
              </View>
              <Text style={styles.themeName}>{preset.name}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  themeCardSelected: {
    borderColor: '#059669',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
  },
  previewBox: {
    width: '100%',
    height: 60,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
})
