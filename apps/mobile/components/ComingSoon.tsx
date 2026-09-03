import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { UniversalLayout } from './layout'
import { Telescope } from 'lucide-react-native'

interface ComingSoonProps {
  title?: string
  description?: string
}

export function ComingSoon({
  title = 'Coming Soon!',
  description = 'This page is currently under development. Stay tuned!',
}: ComingSoonProps) {
  return (
    <UniversalLayout title={title}>
      <View style={styles.container}>
        <View style={styles.contentBox}>
          <View style={styles.iconCircle}>
            <Telescope size={48} color='#4f46e5' strokeWidth={1.75} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  contentBox: {
    alignItems: 'center',
    maxWidth: 420,
    gap: 12,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
})
