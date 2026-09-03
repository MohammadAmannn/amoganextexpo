import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { useLinkMakerStore } from '../store'

export function ProfileEditorTab() {
  const { config, updateProfile } = useLinkMakerStore()
  const { profile } = config

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          value={profile.name}
          onChangeText={(v) => updateProfile({ name: v })}
          placeholder='Alex Rivera'
          style={styles.input}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Bio / Description</Text>
        <TextInput
          value={profile.bio}
          onChangeText={(v) => updateProfile({ bio: v })}
          placeholder='Crafting digital experiences ✨'
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  group: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
})
