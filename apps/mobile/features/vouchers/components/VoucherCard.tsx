import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { VoucherItem } from '../types'
import { FileText, Ticket } from 'lucide-react-native'

interface VoucherCardProps {
  voucher: VoucherItem
  isSelected?: boolean
  onSelect: (voucher: VoucherItem) => void
}

export function VoucherCard({
  voucher,
  isSelected = false,
  onSelect,
}: VoucherCardProps) {
  const getStatusColor = (status: VoucherItem['status']) => {
    switch (status) {
      case 'Active':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          text: '#059669',
          border: 'rgba(16, 185, 129, 0.3)',
        }
      case 'Redeemed':
        return {
          bg: 'rgba(99, 102, 241, 0.12)',
          text: '#4f46e5',
          border: 'rgba(99, 102, 241, 0.3)',
        }
      case 'Expired':
        return {
          bg: 'rgba(148, 163, 184, 0.15)',
          text: '#64748b',
          border: 'rgba(148, 163, 184, 0.3)',
        }
    }
  }

  const statusStyle = getStatusColor(voucher.status)

  return (
    <Pressable
      onPress={() => onSelect(voucher)}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.voucherNoGroup}>
          <Ticket size={16} color='#4f46e5' />
          <Text style={styles.voucherNo}>{voucher.voucherNo}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusStyle.bg,
              borderColor: statusStyle.border,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {voucher.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.fromText}>{voucher.from}</Text>

      <View style={styles.bottomRow}>
        <View style={styles.fileBox}>
          <FileText size={12} color='#64748b' />
          <Text style={styles.fileName} numberOfLines={1}>
            {voucher.fileName}
          </Text>
        </View>

        {voucher.amount !== undefined && (
          <Text style={styles.amountText}>
            ${voucher.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        )}
      </View>

      <Text style={styles.dateText}>{voucher.date}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 6,
  },
  cardSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
    borderColor: '#c7d2fe',
  },
  cardPressed: {
    opacity: 0.88,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voucherNoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voucherNo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  fromText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  fileName: {
    fontSize: 11,
    color: '#64748b',
    flexShrink: 1,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  dateText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
})
