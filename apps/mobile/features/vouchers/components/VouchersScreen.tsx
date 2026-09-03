import React, { useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import { UniversalLayout } from '../../../components/layout'
import { VoucherCard } from './VoucherCard'
import { InvoiceMakerForm } from './InvoiceMakerForm'
import { initialVouchers } from '../data/mock-vouchers'
import type { VoucherItem } from '../types'
import { Plus, Receipt, Search, Ticket, Sparkles } from 'lucide-react-native'

export function VouchersScreen() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 1024

  const [vouchers, setVouchers] = useState<VoucherItem[]>(initialVouchers)
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherItem | null>(
    vouchers[0] || null
  )
  const [activeTab, setActiveTab] = useState<'list' | 'maker'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredVouchers = vouchers.filter((v) => {
    const matchesStatus = filterStatus === 'All' || v.status === filterStatus
    const q = searchQuery.trim().toLowerCase()
    const matchesQuery =
      !q ||
      v.voucherNo.toLowerCase().includes(q) ||
      v.from.toLowerCase().includes(q)
    return matchesStatus && matchesQuery
  })

  const handleCreateInvoice = (newVoucher: VoucherItem) => {
    setVouchers((prev) => [newVoucher, ...prev])
    setSelectedVoucher(newVoucher)
    setActiveTab('list')
  }

  const listView = (
    <View style={styles.listContainer}>
      {/* Search & Status Filters */}
      <View style={styles.toolbar}>
        <View style={styles.searchBox}>
          <Search size={16} color='#94a3b8' />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Search vouchers...'
            placeholderTextColor='#94a3b8'
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filterRow}>
          {['All', 'Active', 'Redeemed', 'Expired'].map((st) => {
            const isActive = filterStatus === st
            return (
              <Pressable
                key={st}
                onPress={() => setFilterStatus(st)}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {st}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <FlatList
        data={filteredVouchers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VoucherCard
            voucher={item}
            isSelected={selectedVoucher?.id === item.id}
            onSelect={(v) => setSelectedVoucher(v)}
          />
        )}
        contentContainerStyle={styles.cardsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )

  const previewPane = selectedVoucher ? (
    <View style={styles.previewContainer}>
      <View style={styles.previewHeader}>
        <View style={styles.previewTitleGroup}>
          <Ticket size={22} color='#4f46e5' />
          <View>
            <Text style={styles.previewNo}>{selectedVoucher.voucherNo}</Text>
            <Text style={styles.previewDate}>{selectedVoucher.date}</Text>
          </View>
        </View>
      </View>

      <View style={styles.previewBody}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>ISSUED BY / FROM</Text>
          <Text style={styles.infoVal}>{selectedVoucher.from}</Text>

          <Text style={[styles.infoLabel, { marginTop: 12 }]}>STATUS</Text>
          <Text style={styles.infoVal}>{selectedVoucher.status}</Text>

          {selectedVoucher.amount !== undefined && (
            <>
              <Text style={[styles.infoLabel, { marginTop: 12 }]}>TOTAL VALUE</Text>
              <Text style={[styles.infoVal, { color: '#059669', fontSize: 18, fontWeight: '800' }]}>
                ${selectedVoucher.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </>
          )}

          <Text style={[styles.infoLabel, { marginTop: 12 }]}>ATTACHED DOCUMENT</Text>
          <Text style={[styles.infoVal, { color: '#6366f1' }]}>{selectedVoucher.fileName}</Text>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.emptyPreview}>
      <Ticket size={32} color='#cbd5e1' />
      <Text style={styles.emptyPreviewText}>Select a voucher to inspect details</Text>
    </View>
  )

  return (
    <UniversalLayout
      title='Vouchers'
      headerChildren={
        <View style={styles.headerTabs}>
          <Pressable
            onPress={() => setActiveTab('list')}
            style={[
              styles.tabBtn,
              activeTab === 'list' && styles.tabBtnActive,
            ]}
          >
            <Ticket
              size={14}
              color={activeTab === 'list' ? '#059669' : '#64748b'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'list' && styles.tabBtnTextActive,
              ]}
            >
              Vouchers
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('maker')}
            style={[
              styles.tabBtn,
              activeTab === 'maker' && styles.tabBtnActive,
            ]}
          >
            <Receipt
              size={14}
              color={activeTab === 'maker' ? '#059669' : '#64748b'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'maker' && styles.tabBtnTextActive,
              ]}
            >
              Invoice Maker
            </Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.container}>
        {activeTab === 'maker' ? (
          <InvoiceMakerForm onSaveInvoice={handleCreateInvoice} />
        ) : isDesktop ? (
          <View style={styles.desktopSplit}>
            <View style={styles.desktopListPane}>{listView}</View>
            <View style={styles.desktopPreviewPane}>{previewPane}</View>
          </View>
        ) : (
          listView
        )}
      </View>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  tabBtnTextActive: {
    fontWeight: '600',
    color: '#059669',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  toolbar: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    height: 38,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  filterChipActive: {
    backgroundColor: '#059669',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  cardsList: {
    padding: 12,
    gap: 8,
  },
  desktopSplit: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopListPane: {
    width: 380,
    borderRightWidth: 1,
    borderRightColor: 'rgba(226, 232, 240, 0.8)',
  },
  desktopPreviewPane: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  previewHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  previewTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewNo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  previewDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  previewBody: {
    padding: 24,
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 3,
  },
  emptyPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyPreviewText: {
    fontSize: 13,
    color: '#94a3b8',
  },
})
