import React, { useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { UniversalLayout } from '../../../components/layout'
import { CategoryToolbar, CategoryFilterType } from './CategoryToolbar'
import { SubTabsBar } from './SubTabsBar'
import { EmailSearchBar } from './EmailSearchBar'
import { EmailCardItem } from './EmailCardItem'
import { EmailView } from './EmailView'
import { NewEmailModal } from './NewEmailModal'
import { MessageChatSection } from './MessageChatSection'
import { MessageChatView } from './MessageChatView'
import { FileManagerView } from './FileManagerView'
import { initialEmails, Email } from '../data/mock-emails'
import { Mail, Settings, Bell } from 'lucide-react-native'
import { useRouter } from 'expo-router'

export function MessageScreen() {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const isDesktop = width >= 1024

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterType>('mail')
  const [activeSubTab, setActiveSubTab] = useState('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [emails, setEmails] = useState<Email[]>(initialEmails)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(
    emails[1] || emails[0] || null
  )
  const [isComposing, setIsComposing] = useState(false)

  const filteredEmails = emails.filter((e) => {
    const q = searchQuery.trim().toLowerCase()
    return (
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      e.preview.toLowerCase().includes(q)
    )
  })

  const handleSelectEmail = (email: Email) => {
    setEmails((prev) =>
      prev.map((item) => (item.id === email.id ? { ...item, read: true } : item))
    )
    setSelectedEmail({ ...email, read: true })
  }

  const handleSendNewEmail = ({
    to,
    subject,
    body,
  }: {
    to: string
    subject: string
    body: string
  }) => {
    const newMail: Email = {
      id: `mail-${Date.now()}`,
      name: 'Mohammed Aman',
      email: 'itsaman00786@gmail.com',
      replyTo: 'itsaman00786@gmail.com',
      subject,
      preview: body.slice(0, 70),
      body,
      date: new Date().toISOString(),
      relativeDate: 'Just now',
      read: true,
      labels: ['Sent'],
      avatarInitials: 'MA',
    }
    setEmails((prev) => [newMail, ...prev])
    setSelectedEmail(newMail)
  }

  const listPane = (
    <View style={styles.listContainer}>
      {/* Sub Tabs Bar (Inbox, Sent, Folder, Contact, Groups) */}
      <SubTabsBar
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        totalCount={emails.length}
      />

      {/* Search Input + "+ New" */}
      <EmailSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onNewClick={() => setIsComposing(true)}
      />

      {/* List Header */}
      <View style={styles.listSectionHeader}>
        <Text style={styles.listSectionTitle}>✉ INBOX MAILS</Text>
        <Text style={styles.listSectionCount}>{filteredEmails.length}</Text>
      </View>

      {/* Email Cards List */}
      <FlatList
        data={filteredEmails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EmailCardItem
            email={item}
            isSelected={selectedEmail?.id === item.id}
            onSelect={handleSelectEmail}
          />
        )}
        contentContainerStyle={styles.cardsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )

  const detailPane = selectedEmail ? (
    <EmailView
      email={selectedEmail}
      onClose={() => setSelectedEmail(null)}
    />
  ) : (
    <View style={styles.emptyDetail}>
      <Mail size={36} color='#cbd5e1' />
      <Text style={styles.emptyDetailText}>Select an email to inspect</Text>
    </View>
  )

  return (
    <UniversalLayout
      title='Messages'
      headerChildren={
        <View style={styles.headerRightActions}>
          <Pressable
            onPress={() => router.push('/app-settings')}
            style={styles.headerIconBtn}
            hitSlop={6}
          >
            <Settings size={18} color='#64748b' />
          </Pressable>
        </View>
      }
    >
      <View style={styles.container}>
        {/* Category Icons Toolbar */}
        <CategoryToolbar
          categoryFilter={categoryFilter}
          onSelectTasks={() => router.push('/charttemplate')}
          onSelectMail={() => setCategoryFilter('mail')}
          onSelectChat={() => setCategoryFilter('chat')}
          onSelectAi={() => router.push('/ai-chat')}
          onSelectAiAssistant={() => router.push('/ai-chat')}
          onSelectVouchers={() => router.push('/vouchers')}
        />

        {categoryFilter === 'chat' ? (
          <View style={styles.chatSectionContainer}>
            <MessageChatSection />
          </View>
        ) : isDesktop ? (
          <View style={styles.desktopSplit}>
            <View style={styles.desktopSidebarPane}>{listPane}</View>
            <View style={styles.desktopDetailPane}>{detailPane}</View>
          </View>
        ) : selectedEmail ? (
          <EmailView
            email={selectedEmail}
            onClose={() => setSelectedEmail(null)}
          />
        ) : (
          listPane
        )}

        {/* Compose Modal */}
        <NewEmailModal
          visible={isComposing}
          onClose={() => setIsComposing(false)}
          onSend={handleSendNewEmail}
        />
      </View>
    </UniversalLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chatSectionContainer: {
    flex: 1,
    marginTop: 6,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopSplit: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopSidebarPane: {
    width: 340,
    borderRightWidth: 1,
    borderRightColor: 'rgba(226, 232, 240, 0.8)',
    backgroundColor: '#ffffff',
  },
  desktopDetailPane: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  listSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  listSectionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  cardsList: {
    paddingHorizontal: 8,
    paddingBottom: 12,
    gap: 6,
  },
  emptyDetail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyDetailText: {
    fontSize: 13,
    color: '#94a3b8',
  },
})
