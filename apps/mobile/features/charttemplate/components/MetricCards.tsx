import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TrendingUp, TrendingDown, DollarSign, Users, Activity } from 'lucide-react-native'

export function MetricCards() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1% from last month',
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'Active Subscriptions',
      value: '+2,350',
      change: '+180.1% from last month',
      isPositive: true,
      icon: Users,
    },
    {
      title: 'Average Order Value',
      value: '$12,234',
      change: '-4.5% from last month',
      isPositive: false,
      icon: Activity,
    },
  ]

  return (
    <View style={styles.container}>
      {metrics.map((m, idx) => {
        const Icon = m.icon
        return (
          <View key={idx} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{m.title}</Text>
              <Icon size={16} color='#64748b' />
            </View>
            <Text style={styles.value}>{m.value}</Text>
            <View style={styles.changeRow}>
              {m.isPositive ? (
                <TrendingUp size={12} color='#059669' />
              ) : (
                <TrendingDown size={12} color='#ef4444' />
              )}
              <Text
                style={[
                  styles.changeText,
                  { color: m.isPositive ? '#059669' : '#ef4444' },
                ]}
              >
                {m.change}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '500',
  },
})
