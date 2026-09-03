import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { UniversalLayout } from './layout'
import { Telescope } from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'

interface ComingSoonProps {
  title?: string
  description?: string
}

export function ComingSoon({
  title = 'Coming Soon!',
  description = 'This page is currently under development. Stay tuned!',
}: ComingSoonProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <UniversalLayout title={title}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.contentBox}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isDark ? colors.card : colors.secondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Telescope size={44} color={colors.primary} strokeWidth={1.75} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {description}
          </Text>
        </View>
      </View>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Open Sans',
  },
})
