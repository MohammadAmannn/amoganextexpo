import React, { useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Upload,
  Download,
  MoreVertical,
} from 'lucide-react-native'

interface FileItem {
  id: string
  name: string
  category: 'pdf' | 'doc' | 'sheet' | 'image'
  size: string
  updatedAt: string
}

export function FileManagerView() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const files: FileItem[] = [
    {
      id: 'f1',
      name: 'Q3-Financial-Report.pdf',
      category: 'pdf',
      size: '3.4 MB',
      updatedAt: '2 days ago',
    },
    {
      id: 'f2',
      name: 'Brand-Guidelines-2026.pdf',
      category: 'pdf',
      size: '12.8 MB',
      updatedAt: '3 days ago',
    },
    {
      id: 'f3',
      name: 'Enterprise-Architecture-Spec.docx',
      category: 'doc',
      size: '1.2 MB',
      updatedAt: 'Yesterday',
    },
    {
      id: 'f4',
      name: 'User-Onboarding-Metrics.xlsx',
      category: 'sheet',
      size: '840 KB',
      updatedAt: 'Today',
    },
    {
      id: 'f5',
      name: 'AppStore-Screenshots-Hero.png',
      category: 'image',
      size: '4.6 MB',
      updatedAt: 'Just now',
    },
  ]

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'pdf', label: 'PDFs' },
    { id: 'doc', label: 'Docs' },
    { id: 'sheet', label: 'Sheets' },
    { id: 'image', label: 'Images' },
  ]

  const filtered = files.filter(
    (f) => activeCategory === 'all' || f.category === activeCategory
  )

  const getFileIcon = (cat: FileItem['category']) => {
    switch (cat) {
      case 'pdf':
        return <FileText size={20} color='#ef4444' />
      case 'doc':
        return <FileCode size={20} color='#3b82f6' />
      case 'sheet':
        return <FileSpreadsheet size={20} color='#10b981' />
      case 'image':
        return <ImageIcon size={20} color='#f59e0b' />
      default:
        return <FileText size={20} color='#64748b' />
    }
  }

  const renderItem = ({ item }: { item: FileItem }) => (
    <View style={styles.fileCard}>
      <View style={styles.iconContainer}>{getFileIcon(item.category)}</View>
      <View style={styles.fileMeta}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.fileSub}>
          {item.size} • {item.updatedAt}
        </Text>
      </View>
      <Pressable style={styles.actionIcon} hitSlop={8}>
        <Download size={16} color='#64748b' />
      </Pressable>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Category Pills */}
      <View style={styles.pillRow}>
        {categories.map((c) => {
          const isActive = activeCategory === c.id
          return (
            <Pressable
              key={c.id}
              onPress={() => setActiveCategory(c.id)}
              style={[
                styles.pill,
                isActive ? styles.pillActive : styles.pillInactive,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  isActive && styles.pillTextActive,
                ]}
              >
                {c.label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* File List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.filesList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafaf9',
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: '#ffffff',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  pillInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  pillText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  filesList: {
    padding: 16,
    gap: 10,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileMeta: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  fileSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  actionIcon: {
    padding: 6,
    borderRadius: 6,
  },
})
