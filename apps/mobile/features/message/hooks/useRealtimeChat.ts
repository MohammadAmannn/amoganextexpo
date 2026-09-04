import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/auth-provider'
import { useAuthStore } from '@/stores/auth-store'
import {
  ensureUserProfile,
  fetchUserConversations,
  fetchConversationMessages,
  getOrCreateDirectConversation,
  sendChatMessage,
  fetchUserContacts,
  addUserContact,
  deleteUserContact,
  fetchUserGroups,
  createGroupConversation,
  ConversationItem,
  ChatMessageRecord,
  ContactData,
  GroupData,
} from '../services/supabase-chat.service'

export function useRealtimeChat() {
  const { user: authUser } = useAuth()
  const storeUser = useAuthStore((state) => state.auth.user)
  const currentUserId = authUser?.id || storeUser?.id

  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessageRecord[]>([])
  const [contacts, setContacts] = useState<ContactData[]>([])
  const [groups, setGroups] = useState<GroupData[]>([])
  const [activeTab, setActiveTab] = useState<'chats' | 'contact' | 'groups' | 'folder'>('chats')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // 1. Initial Load & Ensure Profile
  const loadConversations = useCallback(async () => {
    if (!currentUserId) return
    setIsLoadingConversations(true)
    try {
      await ensureUserProfile(storeUser)
      const convos = await fetchUserConversations(currentUserId)
      setConversations(convos)
      if (convos.length > 0 && !selectedConvoId) {
        setSelectedConvoId(convos[0].id)
      }
    } catch (err) {
      console.warn('[useRealtimeChat] Failed to load conversations:', err)
    } finally {
      setIsLoadingConversations(false)
    }
  }, [currentUserId, storeUser, selectedConvoId])

  const loadContactsAndGroups = useCallback(async () => {
    if (!currentUserId) return
    try {
      const [cts, grps] = await Promise.all([
        fetchUserContacts(currentUserId),
        fetchUserGroups(currentUserId),
      ])
      setContacts(cts)
      setGroups(grps)
    } catch (err) {
      console.warn('[useRealtimeChat] Failed to load contacts/groups:', err)
    }
  }, [currentUserId])

  useEffect(() => {
    if (currentUserId) {
      void loadConversations()
      void loadContactsAndGroups()
    }
  }, [currentUserId])

  // 2. Load Messages when Selected Conversation changes
  useEffect(() => {
    if (!selectedConvoId || !currentUserId) {
      setMessages([])
      return
    }

    let active = true
    setIsLoadingMessages(true)

    fetchConversationMessages(selectedConvoId, currentUserId)
      .then((msgs) => {
        if (active) {
          setMessages(msgs)
          setIsLoadingMessages(false)
        }
      })
      .catch((err) => {
        console.warn('[useRealtimeChat] Error loading messages:', err)
        if (active) setIsLoadingMessages(false)
      })

    return () => {
      active = false
    }
  }, [selectedConvoId, currentUserId])

  // 3. Supabase Realtime Subscription for incoming messages
  useEffect(() => {
    if (!currentUserId) return

    const channel = supabase
      .channel(`user-chat-messages-${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `owner_user_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessageRecord

          // If message is for active conversation, append it
          if (newMsg.conversation_id === selectedConvoId) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          }

          // Update snippet in conversations list
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === newMsg.conversation_id) {
                return {
                  ...c,
                  lastMessage: newMsg.message || (newMsg.file_name ? `📎 ${newMsg.file_name}` : ''),
                  lastMessageTime: newMsg.created_at,
                  unreadCount:
                    newMsg.conversation_id === selectedConvoId
                      ? 0
                      : c.unreadCount + (newMsg.direction === 'Received' ? 1 : 0),
                }
              }
              return c
            })
          )
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [currentUserId, selectedConvoId])

  // 4. Send Message Handler
  const handleSendMessage = async (
    text: string,
    options?: {
      fileUrl?: string
      fileName?: string
      fileSize?: number
      mimeType?: string
      replyToMessageId?: string
      messageType?: 'text' | 'image' | 'video' | 'audio' | 'document' | 'system' | 'other'
    }
  ) => {
    if (!selectedConvoId || !currentUserId || (!text.trim() && !options?.fileUrl)) return

    setIsSending(true)

    // Optimistic message
    const tempId = `temp-${Date.now()}`
    const optimisticMsg: ChatMessageRecord = {
      id: tempId,
      conversation_id: selectedConvoId,
      owner_user_id: currentUserId,
      sender_user_id: currentUserId,
      message: text.trim(),
      message_type: options?.messageType || (options?.fileUrl ? 'image' : 'text'),
      direction: 'Sent',
      sent: true,
      received: true,
      created_at: new Date().toISOString(),
      file_url: options?.fileUrl,
      file_name: options?.fileName,
      file_size: options?.fileSize,
      mime_type: options?.mimeType,
      reply: !!options?.replyToMessageId,
      replyto_message_id: options?.replyToMessageId,
    }

    setMessages((prev) => [...prev, optimisticMsg])

    try {
      const created = await sendChatMessage({
        conversationId: selectedConvoId,
        senderId: currentUserId,
        message: text.trim(),
        messageType: options?.messageType || (options?.fileUrl ? 'image' : 'text'),
        fileUrl: options?.fileUrl,
        fileName: options?.fileName,
        fileSize: options?.fileSize,
        mimeType: options?.mimeType,
        replyToMessageId: options?.replyToMessageId,
      })

      if (created) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? created : m))
        )
      }
    } catch (err) {
      console.error('[useRealtimeChat] Failed to send message:', err)
    } finally {
      setIsSending(false)
    }
  }

  // 5. Start Direct Chat with Contact or User
  const handleStartDirectChat = async (targetUserId: string, targetEmail: string, nickname?: string) => {
    if (!currentUserId) return

    try {
      let resolvedUserId = targetUserId

      // If no valid UUID, check profile by email
      if (!resolvedUserId) {
        const { data: p } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', targetEmail.trim().toLowerCase())
          .maybeSingle()

        if (p?.id) {
          resolvedUserId = p.id
        }
      }

      if (!resolvedUserId) {
        console.warn('Could not resolve user ID for direct chat:', targetEmail)
        return
      }

      const convoId = await getOrCreateDirectConversation(currentUserId, resolvedUserId)
      if (convoId) {
        await loadConversations()
        setSelectedConvoId(convoId)
        setActiveTab('chats')
      }
    } catch (err) {
      console.error('[useRealtimeChat] Failed to start direct chat:', err)
    }
  }

  // 6. Contact Management Actions
  const handleAddContact = async (newContact: { name: string; email: string }) => {
    if (!currentUserId) return
    const created = await addUserContact(currentUserId, newContact.email, newContact.name)
    if (created) {
      setContacts((prev) => [created, ...prev])
    }
  }

  const handleDeleteContact = async (contact: ContactData) => {
    if (!currentUserId) return
    const ok = await deleteUserContact(contact.id, currentUserId)
    if (ok) {
      setContacts((prev) => prev.filter((c) => c.id !== contact.id))
    }
  }

  // 7. Group Management Actions
  const handleAddGroup = async (newGroup: { name: string; description?: string }) => {
    if (!currentUserId) return
    const created = await createGroupConversation(newGroup.name, currentUserId, [], newGroup.description)
    if (created) {
      await loadConversations()
      await loadContactsAndGroups()
      setSelectedConvoId(created.id)
      setActiveTab('chats')
    }
  }

  const selectedConversation =
    conversations.find((c) => c.id === selectedConvoId) || null

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.trim().toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
  })

  return {
    currentUserId,
    conversations: filteredConversations,
    allConversationsCount: conversations.length,
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
    selectConversation: setSelectedConvoId,
    sendMessage: handleSendMessage,
    startDirectChat: handleStartDirectChat,
    addContact: handleAddContact,
    deleteContact: handleDeleteContact,
    addGroup: handleAddGroup,
    refreshConversations: loadConversations,
  }
}
