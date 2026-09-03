import React from 'react'
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Plus, Trash2, Link2 } from 'lucide-react-native'
import { useLinkMakerStore } from '../store'

export function LinksEditorTab() {
  const { config, addLink, updateLink, removeLink } = useLinkMakerStore()
  const { links } = config

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>MY LINKS ({links.length})</Text>
        <Pressable onPress={addLink} style={styles.addBtn} hitSlop={8}>
          <Plus size={14} color='#ffffff' strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Add Link</Text>
        </Pressable>
      </View>

      <View style={styles.linksList}>
        {links.map((link) => (
          <View key={link.id} style={styles.linkCard}>
            <View style={styles.linkHeader}>
              <Link2 size={16} color='#059669' />
              <TextInput
                value={link.title}
                onChangeText={(v) => updateLink(link.id, { title: v })}
                placeholder='Link Title'
                style={styles.titleInput}
              />
              <Switch
                value={link.isEnabled}
                onValueChange={(val) => updateLink(link.id, { isEnabled: val })}
                trackColor={{ true: '#059669', false: '#cbd5e1' }}
              />
              <Pressable
                onPress={() => removeLink(link.id)}
                style={styles.deleteBtn}
                hitSlop={8}
              >
                <Trash2 size={16} color='#ef4444' />
              </Pressable>
            </View>

            <TextInput
              value={link.url}
              onChangeText={(v) => updateLink(link.id, { url: v })}
              placeholder='https://yourwebsite.com'
              autoCapitalize='none'
              keyboardType='url'
              style={styles.urlInput}
            />
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  linksList: {
    gap: 10,
  },
  linkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 8,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    padding: 0,
  },
  deleteBtn: {
    padding: 4,
  },
  urlInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#64748b',
  },
})
