import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import type { GalleryEntry } from '../types'
import { Telescope } from 'lucide-react-native'

interface StagePreviewRendererProps {
  entry: GalleryEntry
}

export function StagePreviewRenderer({ entry }: StagePreviewRendererProps) {
  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Telescope size={64} color='#4f46e5' strokeWidth={1.6} />
        </View>

        <Text style={styles.title}>Coming Soon!</Text>

        <Text style={styles.description}>
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
    backgroundColor: '#ffffff',
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
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    fontFamily: 'Open Sans',
    textAlign: 'center',
    lineHeight: 24,
  },
})
