import React, { useState } from 'react'
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Plus, Trash2, CheckCircle2, Receipt } from 'lucide-react-native'
import type { InvoiceLineItem, VoucherItem } from '../types'
import { Button } from '../../../components/ui'

interface InvoiceMakerFormProps {
  onSaveInvoice: (voucher: VoucherItem) => void
}

export function InvoiceMakerForm({ onSaveInvoice }: InvoiceMakerFormProps) {
  const [billTo, setBillTo] = useState('Acme Corporation')
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-4)}`)
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item-1',
      description: 'Cloud Infrastructure & Hosting (Monthly)',
      quantity: 1,
      rate: 850,
      amount: 850,
    },
    {
      id: 'item-2',
      description: 'Custom React Native Module Consulting',
      quantity: 5,
      rate: 120,
      amount: 600,
    },
  ])

  const [busy, setBusy] = useState(false)

  const handleAddItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}`,
      description: 'New Service Item',
      quantity: 1,
      rate: 100,
      amount: 100,
    }
    setLineItems((prev) => [...prev, newItem])
  }

  const handleRemoveItem = (id: string) => {
    if (lineItems.length <= 1) {
      return Alert.alert('Warning', 'An invoice requires at least one line item.')
    }
    setLineItems((prev) => prev.filter((it) => it.id !== id))
  }

  const handleUpdateItem = (
    id: string,
    field: 'description' | 'quantity' | 'rate',
    val: string
  ) => {
    setLineItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it
        const updated = { ...it }
        if (field === 'description') updated.description = val
        if (field === 'quantity') {
          const q = parseInt(val, 10) || 0
          updated.quantity = q
          updated.amount = q * updated.rate
        }
        if (field === 'rate') {
          const r = parseFloat(val) || 0
          updated.rate = r
          updated.amount = updated.quantity * r
        }
        return updated
      })
    )
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSave = () => {
    if (!billTo.trim()) return Alert.alert('Error', 'Please enter Bill To.')

    setBusy(true)
    setTimeout(() => {
      const newVoucher: VoucherItem = {
        id: `voucher-${Date.now()}`,
        voucherNo: invoiceNo,
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        from: billTo,
        status: 'Active',
        fileName: `${invoiceNo.toLowerCase()}.pdf`,
        amount: total,
      }
      onSaveInvoice(newVoucher)
      setBusy(false)
      Alert.alert('Success', 'Invoice generated and added to voucher records!')
    }, 400)
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Receipt size={20} color='#059669' />
          <Text style={styles.title}>Invoice Maker</Text>
        </View>
        <Text style={styles.subtitle}>
          Draft, calculate taxes, and export invoice records
        </Text>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Bill To</Text>
            <TextInput
              value={billTo}
              onChangeText={setBillTo}
              placeholder='Client or company'
              style={styles.input}
            />
          </View>

          <View style={{ width: 140 }}>
            <Text style={styles.label}>Invoice #</Text>
            <TextInput
              value={invoiceNo}
              onChangeText={setInvoiceNo}
              style={styles.input}
            />
          </View>
        </View>
      </View>

      {/* Line Items */}
      <View style={styles.itemsSection}>
        <View style={styles.itemsHeader}>
          <Text style={styles.itemsTitle}>LINE ITEMS</Text>
          <Pressable
            onPress={handleAddItem}
            style={styles.addItemBtn}
            hitSlop={8}
          >
            <Plus size={14} color='#059669' strokeWidth={2.5} />
            <Text style={styles.addItemBtnText}>Add Item</Text>
          </Pressable>
        </View>

        {lineItems.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <TextInput
              value={item.description}
              onChangeText={(v) => handleUpdateItem(item.id, 'description', v)}
              placeholder='Description'
              style={[styles.input, { flex: 2 }]}
            />
            <TextInput
              value={String(item.quantity)}
              onChangeText={(v) => handleUpdateItem(item.id, 'quantity', v)}
              keyboardType='numeric'
              placeholder='Qty'
              style={[styles.input, { width: 50, textAlign: 'center' }]}
            />
            <TextInput
              value={String(item.rate)}
              onChangeText={(v) => handleUpdateItem(item.id, 'rate', v)}
              keyboardType='numeric'
              placeholder='Rate'
              style={[styles.input, { width: 70, textAlign: 'right' }]}
            />
            <Text style={styles.itemAmount}>
              ${item.amount.toFixed(2)}
            </Text>
            <Pressable
              onPress={() => handleRemoveItem(item.id)}
              style={styles.deleteBtn}
              hitSlop={8}
            >
              <Trash2 size={16} color='#ef4444' />
            </Pressable>
          </View>
        ))}
      </View>

      {/* Financial Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (10%):</Text>
          <Text style={styles.summaryVal}>${tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Due:</Text>
          <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <Button
        loading={busy}
        onPress={handleSave}
        style={styles.saveBtn}
      >
        <View style={styles.saveBtnContent}>
          <CheckCircle2 size={16} color='#ffffff' />
          <Text style={styles.saveBtnText}>Save & Create Voucher</Text>
        </View>
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  itemsSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  addItemBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemAmount: {
    width: 70,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  deleteBtn: {
    padding: 6,
  },
  summaryBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  saveBtn: {
    backgroundColor: '#059669',
    height: 44,
    borderRadius: 10,
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
})
