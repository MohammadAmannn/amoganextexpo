import React, { useState } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  ChatSidebar,
  ChatCardItem,
  ChatHeader,
  ChatMessageList,
  ChatBubble,
  ChatInput,
  ChatEmptyState,
  ContactManager,
  GroupManager,
  AttachmentOptionType,
} from '@/components/chat'
import { useTheme } from '@/providers/theme-provider'
import { useRealtimeChat } from '../hooks/useRealtimeChat'

export function MessageChatSection() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const { width } = useWindowDimensions()
  const isDesktop = width >= 1024

  const {
    currentUserId,
    conversations,
    allConversationsCount,
    selectedConvoId,
    selectedConversation,
    messages,
    contacts,
    groups,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    selectConversation,
    sendMessage,
    startDirectChat,
    addContact,
    deleteContact,
    addGroup,
  } = useRealtimeChat()

  const [typedMessage, setTypedMessage] = useState('')

  const handleSend = () => {
    if (!typedMessage.trim()) return
    const text = typedMessage.trim()
    setTypedMessage('')
    void sendMessage(text)
  }

  const handleSelectAttachmentOption = (type: AttachmentOptionType) => {
    // Demo attachment helper for quick testing
    if (type === 'images') {
      void sendMessage('Sent an image attachment', {
        fileUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop',
        fileName: 'design_preview.png',
        fileSize: 342100,
        messageType: 'image',
      })
    } else if (type === 'documents') {
      void sendMessage('Shared a project document', {
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'Project_Specification.pdf',
        fileSize: 524288,
        messageType: 'document',
      })
    }
  }

  // 1. Sidebar Component
  const sidebarElement = (
    <ChatSidebar
      tabs={[
        { id: 'chats', label: 'Chats', count: allConversationsCount },
        { id: 'contact', label: 'Contact', count: contacts.length },
        { id: 'groups', label: 'Groups', count: groups.length },
        { id: 'folder', label: 'Folder' },
      ]}
      activeTab={activeTab}
      onTabChange={(t: any) => setActiveTab(t)}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder='Search chats or people...'
      sectionLabel={activeTab.toUpperCase()}
      sectionCount={
        activeTab === 'chats'
          ? conversations.length
          : activeTab === 'contact'
          ? contacts.length
          : groups.length
      }
    >
      {conversations.length === 0 ? (
        <View style={styles.emptySidebar}>
          <Text style={[styles.emptySidebarText, { color: colors.mutedForeground }]}>
            {isLoadingConversations ? 'Loading conversations...' : 'No conversations found'}
          </Text>
        </View>
      ) : (
        conversations.map((convo) => {
          const isSelected = selectedConvoId === convo.id
          return (
            <ChatCardItem
              key={convo.id}
              id={convo.id}
              title={convo.name}
              badgeLabel={convo.type === 'direct' ? 'Direct' : 'Group'}
              lastMessage={convo.lastMessage || 'No messages yet'}
              time={convo.lastMessageTime ? new Date(convo.lastMessageTime) : undefined}
              membersCount={convo.membersCount}
              onlineCount={convo.onlineCount}
              unreadCount={convo.unreadCount}
              isActive={isSelected}
              isGroup={convo.type !== 'direct'}
              onClick={() => {
                selectConversation(convo.id)
                if (activeTab !== 'chats') setActiveTab('chats')
              }}
            />
          )
        })
      )}
    </ChatSidebar>
  )

  // 2. Active Chat Viewport
  const renderChatViewport = () => {
    if (activeTab === 'contact') {
      return (
        <ContactManager
          contacts={contacts}
          onChatClick={(contact) => {
            void startDirectChat(
              contact.contactUserId || '',
              contact.email,
              contact.name
            )
          }}
          onAddContact={(newC) => void addContact(newC)}
          onDeleteClick={(c) => void deleteContact(c)}
        />
      )
    }

    if (activeTab === 'groups') {
      return (
        <GroupManager
          groups={groups}
          onChatClick={(g) => {
            selectConversation(g.id)
            setActiveTab('chats')
          }}
          onAddGroup={(newG) => void addGroup(newG)}
        />
      )
    }

    if (activeTab === 'folder') {
      return (
        <ChatEmptyState
          title='Chat Storage Folder'
          description='Shared documents, media, and attachments will appear here.'
        />
      )
    }

    if (!selectedConversation) {
      return (
        <ChatEmptyState
          title='No conversation selected'
          description='Select a chat from the sidebar or choose a contact to start messaging in real-time.'
        />
      )
    }

    const partnerStatus =
      selectedConversation.otherMember?.status === 'online' ? 'online' : 'offline'

    return (
      <View style={styles.chatViewportContainer}>
        {/* Header */}
        <ChatHeader
          title={selectedConversation.name}
          subtitle={
            selectedConversation.type === 'direct'
              ? partnerStatus === 'online'
                ? 'Online now'
                : 'Last seen recently'
              : `${selectedConversation.membersCount} members • ${selectedConversation.onlineCount} online`
          }
          status={partnerStatus}
          isGroup={selectedConversation.type !== 'direct'}
          memberCount={selectedConversation.membersCount}
          avatarUrl={selectedConversation.image}
        />

        {/* Message Stream */}
        <ChatMessageList>
          {messages.length === 0 ? (
            <View style={styles.emptyMessagesBox}>
              <Text style={[styles.emptyMessagesText, { color: colors.mutedForeground }]}>
                {isLoadingMessages
                  ? 'Loading message history...'
                  : `This is the start of your 1-to-1 conversation with ${selectedConversation.name}.`}
              </Text>
            </View>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender_user_id === currentUserId
              const senderDisplayName = isOwn
                ? 'You'
                : msg.sender?.name || selectedConversation.name

              const attachmentsList = msg.file_url
                ? [
                    {
                      id: msg.id,
                      name: msg.file_name || 'Attachment',
                      url: msg.file_url,
                      size: msg.file_size,
                      type: msg.message_type || 'file',
                    },
                  ]
                : undefined

              return (
                <ChatBubble
                  key={msg.id}
                  id={msg.id}
                  content={msg.message}
                  isOwn={isOwn}
                  senderName={senderDisplayName}
                  senderAvatar={msg.sender?.avatar}
                  time={msg.created_at ? new Date(msg.created_at) : new Date()}
                  status={msg.sent ? (msg.received ? 'read' : 'delivered') : 'sending'}
                  attachments={attachmentsList}
                />
              )
            })
          )}
        </ChatMessageList>

        {/* Chat Input Composer */}
        <View style={styles.inputContainer}>
          <ChatInput
            value={typedMessage}
            onChange={setTypedMessage}
            onSend={handleSend}
            isLoading={isSending}
            placeholder={`Message ${selectedConversation.name}...`}
            onSelectAttachmentType={handleSelectAttachmentOption}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isDesktop ? (
        <View style={styles.desktopLayout}>
          <View
            style={[
              styles.desktopSidebarPane,
              {
                borderRightColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
          >
            {sidebarElement}
          </View>
          <View
            style={[
              styles.desktopViewportPane,
              { backgroundColor: isDark ? '#09090b' : '#f8fafc' },
            ]}
          >
            {renderChatViewport()}
          </View>
        </View>
      ) : selectedConversation && activeTab === 'chats' ? (
        <View style={styles.mobileViewportPane}>{renderChatViewport()}</View>
      ) : (
        <View style={styles.mobileSidebarPane}>{sidebarElement}</View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopSidebarPane: {
    width: 340,
    borderRightWidth: 1,
  },
  desktopViewportPane: {
    flex: 1,
  },
  mobileSidebarPane: {
    flex: 1,
  },
  mobileViewportPane: {
    flex: 1,
  },
  chatViewportContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 4,
  },
  emptySidebar: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySidebarText: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  emptyMessagesBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyMessagesText: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
    textAlign: 'center',
    lineHeight: 18,
  },
})
