import { View, type ViewProps, StyleSheet } from 'react-native'

export function Card({ className, style, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      style={[styles.card, style]}
      className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className ?? ''}`}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
})
