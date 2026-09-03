import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export function AreaChartPreview() {
  const steps = [
    { label: 'W1', value: 40 },
    { label: 'W2', value: 65 },
    { label: 'W3', value: 55 },
    { label: 'W4', value: 85 },
    { label: 'W5', value: 92 },
    { label: 'W6', value: 78 },
  ]

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Area Chart - Active Growth</Text>
        <Text style={styles.subtitle}>Weekly activity rate</Text>
      </View>

      <View style={styles.chartWrapper}>
        <View style={styles.barsContainer}>
          {steps.map((s, idx) => (
            <View key={idx} style={styles.col}>
              <View
                style={[
                  styles.areaFill,
                  { height: `${s.value}%` },
                ]}
              />
              <Text style={styles.label}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          Trending up by <Text style={{ color: '#059669', fontWeight: '700' }}>+12.4%</Text> this week
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  chartWrapper: {
    height: 160,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  col: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    flex: 1,
  },
  areaFill: {
    width: '70%',
    backgroundColor: 'rgba(16, 185, 129, 0.4)',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: '#059669',
  },
  label: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
  summaryRow: {
    paddingTop: 4,
  },
  summaryText: {
    fontSize: 12,
    color: '#64748b',
  },
})
