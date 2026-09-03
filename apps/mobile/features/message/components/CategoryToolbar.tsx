import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import {
  Calendar,
  Mail,
  MessageSquare,
  Sparkles,
  Bot,
  FileText,
} from 'lucide-react-native'

export type CategoryFilterType =
  | 'tasks'
  | 'mail'
  | 'chat'
  | 'ai'
  | 'ai-assistant'
  | 'vouchers'

interface CategoryToolbarProps {
  categoryFilter: CategoryFilterType
  onSelectTasks: () => void
  onSelectMail: () => void
  onSelectChat: () => void
  onSelectAi: () => void
  onSelectAiAssistant: () => void
  onSelectVouchers: () => void
}

export function CategoryToolbar({
  categoryFilter,
  onSelectTasks,
  onSelectMail,
  onSelectChat,
  onSelectAi,
  onSelectAiAssistant,
  onSelectVouchers,
}: CategoryToolbarProps) {
  const items = [
    {
      id: 'tasks' as CategoryFilterType,
      icon: Calendar,
      onPress: onSelectTasks,
      activeColor: '#9333ea',
      activeBg: '#f3e8ff',
    },
    {
      id: 'mail' as CategoryFilterType,
      icon: Mail,
      onPress: onSelectMail,
      activeColor: '#4f46e5',
      activeBg: '#e0e7ff',
    },
    {
      id: 'chat' as CategoryFilterType,
      icon: MessageSquare,
      onPress: onSelectChat,
      activeColor: '#059669',
      activeBg: '#d1fae5',
    },
    {
      id: 'ai' as CategoryFilterType,
      icon: Sparkles,
      onPress: onSelectAi,
      activeColor: '#4f46e5',
      activeBg: '#e0e7ff',
    },
    {
      id: 'ai-assistant' as CategoryFilterType,
      icon: Bot,
      onPress: onSelectAiAssistant,
      activeColor: '#4f46e5',
      activeBg: '#e0e7ff',
    },
    {
      id: 'vouchers' as CategoryFilterType,
      icon: FileText,
      onPress: onSelectVouchers,
      activeColor: '#4f46e5',
      activeBg: '#e0e7ff',
    },
  ]

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = categoryFilter === item.id
        return (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            style={[
              styles.iconBtn,
              isActive && { backgroundColor: item.activeBg },
            ]}
            hitSlop={6}
          >
            <Icon
              size={16}
              color={isActive ? item.activeColor : '#64748b'}
              strokeWidth={isActive ? 2.4 : 2}
            />
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 3,
    marginHorizontal: 12,
    marginTop: 8,
  },
  iconBtn: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
})
