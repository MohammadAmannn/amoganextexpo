import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'

interface SubTabsBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  totalCount?: number
}

export function SubTabsBar({
  activeTab,
  onTabChange,
  totalCount = 25,
}: SubTabsBarProps) {
  const tabs = [
    { id: 'inbox', label: 'Inbox' },
    { id: 'sent', label: 'Sent' },
    { id: 'folder', label: 'Folder' },
    { id: 'contact', label: 'Contact' },
    { id: 'groups', label: 'Groups' },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.tabsList}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      <View style={styles.paginationBox}>
        <Text style={styles.paginationText}>1-20 of {totalCount}</Text>
        <Pressable style={styles.pageArrow} hitSlop={6}>
          <ChevronLeft size={14} color='#64748b' />
        </Pressable>
        <Pressable style={styles.pageArrow} hitSlop={6}>
          <ChevronRight size={14} color='#64748b' />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabsList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tabBtn: {
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#0f172a',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  paginationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paginationText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  pageArrow: {
    padding: 2,
  },
})
