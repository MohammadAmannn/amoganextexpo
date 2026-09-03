import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export function BarChartPreview() {
  const data = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Feb', desktop: 305, mobile: 200 },
    { month: 'Mar', desktop: 237, mobile: 120 },
    { month: 'Apr', desktop: 273, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'Jun', desktop: 314, mobile: 240 },
  ]

  const maxVal = 350
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Bar Chart - Multiple Metrics</Text>
        <Text style={styles.subtitle}>January - June 2026</Text>
      </View>

      {/* Chart Plot Area */}
      <View style={styles.plotArea}>
        {data.map((item, idx) => {
          const isSelected = selectedIdx === idx
          const desktopHeight = (item.desktop / maxVal) * 160
          const mobileHeight = (item.mobile / maxVal) * 160

          return (
            <Pressable
              key={item.month}
              onPress={() => setSelectedIdx(isSelected ? null : idx)}
              style={styles.colContainer}
            >
              {isSelected && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>
                    D: {item.desktop} | M: {item.mobile}
                  </Text>
                </View>
              )}

              <View style={styles.barsRow}>
                <View
                  style={[
                    styles.bar,
                    styles.barDesktop,
                    { height: desktopHeight },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    styles.barMobile,
                    { height: mobileHeight },
                  ]}
                />
              </View>

              <Text style={styles.monthLabel}>{item.month}</Text>
            </Pressable>
          )
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
          <Text style={styles.legendText}>Desktop Visitors</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} />
          <Text style={styles.legendText}>Mobile Visitors</Text>
        </View>
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
  plotArea: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  colContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: -20,
    backgroundColor: '#0f172a',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 10,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barDesktop: {
    backgroundColor: '#059669',
  },
  barMobile: {
    backgroundColor: '#6366f1',
  },
  monthLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
})
