import { supabase } from '@/lib/supabase'
import type { AuthUser } from '@/stores/auth-store'

export interface ProfileRecord {
  id: string
  name: string
  email: string
  avatar?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  last_seen?: string
  mobile?: string
}

export interface ConversationMemberRecord {
  conversation_id: string
  user_id: string
  role?: string
  unread_count?: number
  profiles?: ProfileRecord
}

export interface ChatMessageRecord {
  id: string
  conversation_id: string
  owner_user_id: string
  sender_user_id: string
  message: string
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'system' | 'other'
  direction: 'Sent' | 'Received'
  sent: boolean
  received: boolean
  created_at: string
  file_url?: string
  file_name?: string
  file_size?: number
  mime_type?: string
  thumbnail?: string
  reply?: boolean
  replyto_message_id?: string
  replyto_user_id?: string
  star?: boolean
  pin?: boolean
  flag?: boolean
  sender?: ProfileRecord
}

export interface ConversationItem {
  id: string
  type: 'direct' | 'group' | 'channel_group' | 'message_group'
  name: string
  image?: string
  created_by?: string
  created_at: string
  unreadCount: number
  membersCount: number
  onlineCount: number
  lastMessage?: string
  lastMessageTime?: string
  otherMember?: ProfileRecord
  members: ProfileRecord[]
}

export interface ContactData {
  id: string
  name: string
  email: string
  avatarUrl?: string
  initials?: string
  isEnabled?: boolean
  mobile?: string
  contactUserId?: string
}

export interface GroupData {
  id: string
  name: string
  ownerEmail?: string
  membersCount?: number
  avatarUrl?: string
  isEnabled?: boolean
  description?: string
}

/**
 * Ensures the authenticated user has an active row in public.profiles
 */
export async function ensureUserProfile(user: AuthUser | null): Promise<ProfileRecord | null> {
  if (!user || !user.id) return null

  try {
    const { data: existing, error: fetchErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (existing && !fetchErr) {
      // Update status to online
      await supabase
        .from('profiles')
        .update({ status: 'online', last_seen: new Date().toISOString() })
        .eq('id', user.id)
      return existing as ProfileRecord
    }

    const newProfile = {
      id: user.id,
      name: user.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: user.picture || '',
      status: 'online',
      last_seen: new Date().toISOString(),
    }

    const { data: inserted, error: insertErr } = await supabase
      .from('profiles')
      .upsert(newProfile)
      .select()
      .maybeSingle()

    if (insertErr) {
      console.warn('[ChatService] Error upserting profile:', insertErr)
    }

    return (inserted || newProfile) as ProfileRecord
  } catch (err) {
    console.error('[ChatService] Exception in ensureUserProfile:', err)
    return null
  }
}

/**
 * Fetch all conversations for a user
 */
export async function fetchUserConversations(userId: string): Promise<ConversationItem[]> {
  try {
    // 1. Get conversation memberships
    const { data: memberRows, error: memberErr } = await supabase
      .from('conversation_members')
      .select('conversation_id, unread_count, role')
      .eq('user_id', userId)

    if (memberErr || !memberRows || memberRows.length === 0) {
      return []
    }

    const convoIds = memberRows.map((m) => m.conversation_id)

    // 2. Fetch conversations
    const { data: convos, error: convoErr } = await supabase
      .from('conversations')
      .select(`
        id,
        type,
        name,
        image,
        created_by,
        created_at,
        conversation_members (
          user_id,
          role,
          unread_count,
          profiles:user_id (
            id,
            name,
            email,
            avatar,
            status,
            last_seen
          )
        )
      `)
      .in('id', convoIds)
      .order('created_at', { ascending: false })

    if (convoErr || !convos) {
      console.warn('[ChatService] Error fetching conversations:', convoErr)
      return []
    }

    // 3. For each conversation, fetch the latest message copy owned by this user
    const formattedList: ConversationItem[] = []

    for (const c of convos) {
      const { data: latestMsgs } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', c.id)
        .eq('owner_user_id', userId)
        .eq('deleted', false)
        .order('created_at', { ascending: false })
        .limit(1)

      const lastMsg = latestMsgs?.[0]

      const membersList: ProfileRecord[] = []
      let onlineCount = 0

      if (Array.isArray(c.conversation_members)) {
        for (const cm of c.conversation_members as any[]) {
          if (cm.profiles) {
            membersList.push(cm.profiles as ProfileRecord)
            if (cm.profiles.status === 'online') {
              onlineCount++
            }
          }
        }
      }

      const selfMember = (c.conversation_members as any[])?.find(
        (cm) => cm.user_id === userId
      )
      const unreadCount = selfMember?.unread_count || 0

      let displayName = c.name || ''
      let displayImage = c.image || ''
      let otherMember: ProfileRecord | undefined

      if (c.type === 'direct') {
        otherMember = membersList.find((m) => m.id !== userId)
        if (otherMember) {
          displayName = otherMember.name || otherMember.email || 'Chat User'
          displayImage = otherMember.avatar || ''
        } else {
          displayName = 'You (Note)'
        }
      }

      let lastMsgSnippet = lastMsg?.message || ''
      if (lastMsg?.file_name) {
        lastMsgSnippet = lastMsgSnippet
          ? `${lastMsgSnippet} (${lastMsg.file_name})`
          : `📎 ${lastMsg.file_name}`
      }

      formattedList.push({
        id: c.id,
        type: c.type as any,
        name: displayName,
        image: displayImage,
        created_by: c.created_by,
        created_at: c.created_at,
        unreadCount,
        membersCount: membersList.length,
        onlineCount,
        lastMessage: lastMsgSnippet,
        lastMessageTime: lastMsg?.created_at || c.created_at,
        otherMember,
        members: membersList,
      })
    }

    // Sort by latest activity
    formattedList.sort(
      (a, b) =>
        new Date(b.lastMessageTime || b.created_at).getTime() -
        new Date(a.lastMessageTime || a.created_at).getTime()
    )

    return formattedList
  } catch (err) {
    console.error('[ChatService] Exception in fetchUserConversations:', err)
    return []
  }
}

/**
 * Get or create a direct 1-to-1 conversation between userA and userB
 */
export async function getOrCreateDirectConversation(
  userAId: string,
  userBId: string
): Promise<string | null> {
  try {
    // 1. Check if direct conversation already exists
    const { data: membersA } = await supabase
      .from('conversation_members')
      .select('conversation_id, conversations!inner(id, type)')
      .eq('user_id', userAId)
      .eq('conversations.type', 'direct')

    if (membersA && membersA.length > 0) {
      const convoIds = membersA.map((m) => m.conversation_id)

      const { data: membersB } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .in('conversation_id', convoIds)
        .eq('user_id', userBId)

      if (membersB && membersB.length > 0) {
        return membersB[0].conversation_id
      }
    }

    // 2. Create new direct conversation
    const { data: newConvo, error: createErr } = await supabase
      .from('conversations')
      .insert({
        type: 'direct',
        created_by: userAId,
      })
      .select()
      .single()

    if (createErr || !newConvo) {
      console.error('[ChatService] Failed to create conversation:', createErr)
      return null
    }

    // 3. Add members
    const membersToInsert = [{ conversation_id: newConvo.id, user_id: userAId }]
    if (userAId !== userBId) {
      membersToInsert.push({ conversation_id: newConvo.id, user_id: userBId })
    }

    await supabase.from('conversation_members').insert(membersToInsert)

    return newConvo.id
  } catch (err) {
    console.error('[ChatService] Exception in getOrCreateDirectConversation:', err)
    return null
  }
}

/**
 * Fetch messages for a specific conversation and user copy
 */
export async function fetchConversationMessages(
  conversationId: string,
  userId: string
): Promise<ChatMessageRecord[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles!sender_user_id (
          id,
          name,
          email,
          avatar
        )
      `)
      .eq('conversation_id', conversationId)
      .eq('owner_user_id', userId)
      .eq('deleted', false)
      .order('created_at', { ascending: true })

    if (error || !data) {
      console.warn('[ChatService] Error fetching messages:', error)
      return []
    }

    // Clear unread count for this user in this conversation
    void supabase
      .from('conversation_members')
      .update({ unread_count: 0 })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)

    return data as ChatMessageRecord[]
  } catch (err) {
    console.error('[ChatService] Exception in fetchConversationMessages:', err)
    return []
  }
}

/**
 * Send a message to a conversation (creates member copies for all conversation members)
 */
export async function sendChatMessage(params: {
  conversationId: string
  senderId: string
  message: string
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'document' | 'system' | 'other'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  replyToMessageId?: string
}): Promise<ChatMessageRecord | null> {
  const {
    conversationId,
    senderId,
    message,
    messageType = 'text',
    fileUrl,
    fileName,
    fileSize,
    mimeType,
    replyToMessageId,
  } = params

  try {
    // 1. Get all members in the conversation
    const { data: members, error: memErr } = await supabase
      .from('conversation_members')
      .select('user_id, unread_count')
      .eq('conversation_id', conversationId)

    if (memErr || !members || members.length === 0) {
      throw new Error('No members found in conversation')
    }

    const now = new Date().toISOString()
    const senderCopyId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`

    // 2. Build rows for each member
    const recordsToInsert = members.map((member) => {
      const isSender = member.user_id === senderId
      const id = isSender
        ? senderCopyId
        : typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

      return {
        id,
        conversation_id: conversationId,
        owner_user_id: member.user_id,
        sender_user_id: senderId,
        message: message.trim(),
        message_type: messageType,
        direction: isSender ? 'Sent' : 'Received',
        sent: true,
        received: isSender,
        created_at: now,
        file_url: fileUrl || null,
        file_name: fileName || null,
        file_size: fileSize || null,
        mime_type: mimeType || null,
        reply: !!replyToMessageId,
        replyto_message_id: replyToMessageId || null,
        deleted: false,
      }
    })

    const { error: insertErr } = await supabase
      .from('chat_messages')
      .insert(recordsToInsert)

    if (insertErr) {
      console.error('[ChatService] Error inserting message copies:', insertErr)
      throw insertErr
    }

    // 3. Increment unread count for recipients
    for (const member of members) {
      if (member.user_id !== senderId) {
        await supabase
          .from('conversation_members')
          .update({ unread_count: (member.unread_count || 0) + 1 })
          .eq('conversation_id', conversationId)
          .eq('user_id', member.user_id)
      }
    }

    // Return the sender's created copy
    return {
      id: senderCopyId,
      conversation_id: conversationId,
      owner_user_id: senderId,
      sender_user_id: senderId,
      message,
      message_type: messageType,
      direction: 'Sent',
      sent: true,
      received: true,
      created_at: now,
      file_url: fileUrl,
      file_name: fileName,
      file_size: fileSize,
      mime_type: mimeType,
      reply: !!replyToMessageId,
      replyto_message_id: replyToMessageId,
    } as ChatMessageRecord
  } catch (err) {
    console.error('[ChatService] Exception in sendChatMessage:', err)
    return null
  }
}

/**
 * Fetch contacts for a user
 */
export async function fetchUserContacts(userId: string): Promise<ContactData[]> {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select(`
        id,
        owner_id,
        contact_user_id,
        nickname,
        email,
        profiles:contact_user_id (
          id,
          name,
          email,
          avatar,
          mobile,
          status
        )
      `)
      .eq('owner_id', userId)

    if (error || !contacts) {
      console.warn('[ChatService] Error fetching contacts:', error)
      return []
    }

    return contacts.map((c: any) => {
      const p = c.profiles
      const name = c.nickname || p?.name || c.email?.split('@')[0] || 'Contact'
      const email = c.email || p?.email || ''
      const initials = name.slice(0, 2).toUpperCase()

      return {
        id: c.id,
        name,
        email,
        avatarUrl: p?.avatar,
        initials,
        isEnabled: true,
        mobile: p?.mobile,
        contactUserId: c.contact_user_id || p?.id,
      }
    })
  } catch (err) {
    console.error('[ChatService] Exception in fetchUserContacts:', err)
    return []
  }
}

/**
 * Add a new contact for a user
 */
export async function addUserContact(
  ownerId: string,
  targetEmail: string,
  nickname?: string
): Promise<ContactData | null> {
  try {
    // 1. Look up profile by email if exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, email, avatar')
      .eq('email', targetEmail.trim().toLowerCase())
      .maybeSingle()

    const contactUserId = profile?.id || null
    const finalNickname = nickname || profile?.name || targetEmail.split('@')[0]

    const { data: newContact, error } = await supabase
      .from('contacts')
      .insert({
        owner_id: ownerId,
        contact_user_id: contactUserId,
        email: targetEmail.trim().toLowerCase(),
        nickname: finalNickname,
      })
      .select()
      .single()

    if (error || !newContact) {
      console.error('[ChatService] Error adding contact:', error)
      return null
    }

    return {
      id: newContact.id,
      name: finalNickname,
      email: targetEmail,
      avatarUrl: profile?.avatar,
      initials: finalNickname.slice(0, 2).toUpperCase(),
      isEnabled: true,
      contactUserId: contactUserId || undefined,
    }
  } catch (err) {
    console.error('[ChatService] Exception in addUserContact:', err)
    return null
  }
}

/**
 * Delete a contact
 */
export async function deleteUserContact(contactId: string, ownerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
      .eq('owner_id', ownerId)

    return !error
  } catch (err) {
    console.error('[ChatService] Exception in deleteUserContact:', err)
    return false
  }
}

/**
 * Fetch group channels for a user
 */
export async function fetchUserGroups(userId: string): Promise<GroupData[]> {
  try {
    const { data: memberRows } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', userId)

    if (!memberRows || memberRows.length === 0) return []

    const convoIds = memberRows.map((m) => m.conversation_id)

    const { data: groupConvos, error } = await supabase
      .from('conversations')
      .select(`
        id,
        name,
        image,
        created_by,
        conversation_members (
          user_id
        )
      `)
      .in('id', convoIds)
      .neq('type', 'direct')

    if (error || !groupConvos) return []

    return groupConvos.map((g: any) => ({
      id: g.id,
      name: g.name || 'Group Chat',
      avatarUrl: g.image,
      membersCount: g.conversation_members?.length || 1,
      isEnabled: true,
      description: 'Group Conversation',
    }))
  } catch (err) {
    console.error('[ChatService] Exception in fetchUserGroups:', err)
    return []
  }
}

/**
 * Create a new group conversation
 */
export async function createGroupConversation(
  name: string,
  creatorId: string,
  memberUserIds: string[] = [],
  description?: string
): Promise<ConversationItem | null> {
  try {
    const { data: newConvo, error: createErr } = await supabase
      .from('conversations')
      .insert({
        type: 'group',
        name,
        created_by: creatorId,
      })
      .select()
      .single()

    if (createErr || !newConvo) {
      console.error('[ChatService] Error creating group:', createErr)
      return null
    }

    const allMemberIds = Array.from(new Set([creatorId, ...memberUserIds]))
    const membersToInsert = allMemberIds.map((uid) => ({
      conversation_id: newConvo.id,
      user_id: uid,
    }))

    await supabase.from('conversation_members').insert(membersToInsert)

    // Insert group created system message
    await sendChatMessage({
      conversationId: newConvo.id,
      senderId: creatorId,
      message: `Group "${name}" created`,
      messageType: 'system',
    })

    return {
      id: newConvo.id,
      type: 'group',
      name,
      created_by: creatorId,
      created_at: newConvo.created_at,
      unreadCount: 0,
      membersCount: allMemberIds.length,
      onlineCount: 1,
      lastMessage: `Group "${name}" created`,
      lastMessageTime: newConvo.created_at,
      members: [],
    }
  } catch (err) {
    console.error('[ChatService] Exception in createGroupConversation:', err)
    return null
  }
}
