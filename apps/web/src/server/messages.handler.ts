import { NextRequest, NextResponse } from 'next/server'
import { getConversationMessages, createMessage } from '@/features/chattemplate/chat/repositories/message-repository'
import { getOrCreateDirectConversation } from '@/features/chattemplate/chat/repositories/conversation-repository'

export async function handleMessagesGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const recipientId = searchParams.get('recipientId')
    const senderId = searchParams.get('senderId')

    if (!conversationId && !recipientId) {
      return NextResponse.json({ error: 'conversationId or recipientId is required' }, { status: 400 })
    }

    if (!senderId) {
      return NextResponse.json({ error: 'senderId (owner_user_id) is required' }, { status: 400 })
    }

    let targetConvoId = conversationId

    if (!targetConvoId && recipientId) {
      targetConvoId = await getOrCreateDirectConversation(senderId, recipientId)
    }

    if (!targetConvoId) {
      return NextResponse.json([])
    }

    const messages = await getConversationMessages(targetConvoId, senderId)
    return NextResponse.json(messages)
  } catch (err) {
    console.error('GET messages error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function handleMessagesPost(request: NextRequest) {
  try {
    const body = await request.json()

    const isAttachment = body.messageType && body.messageType !== 'text'
    const hasContent = body.message?.trim() || (isAttachment && body.fileUrl)

    if (!hasContent) {
      return NextResponse.json(
        { error: 'message (or fileUrl for attachments) is required' },
        { status: 400 }
      )
    }

    let targetConvoId = body.conversationId

    if (!targetConvoId && body.recipientId) {
      const senderId = body.senderId
      if (!senderId) {
        return NextResponse.json(
          { error: 'senderId is required to resolve conversation' },
          { status: 400 }
        )
      }
      targetConvoId = await getOrCreateDirectConversation(senderId, body.recipientId)
    }

    if (!targetConvoId) {
      return NextResponse.json(
        { error: 'Could not resolve or create conversation' },
        { status: 400 }
      )
    }

    const msg = await createMessage({
      conversationId: targetConvoId,
      senderId: body.senderId,
      message: body.message,
      messageType: body.messageType || 'text',
      fileUrl: body.fileUrl,
      replyMetadata: body.replyToMessageId
        ? {
            replyto_message_id: body.replyToMessageId,
            replyto_user_id: body.replyToUserId || null,
            replyemoji: null,
            parent_message_id: null,
          }
        : undefined,
      locationData: body.location,
    })

    if (!msg) {
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      )
    }

    return NextResponse.json(msg, { status: 201 })
  } catch (err) {
    console.error('POST message error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create message' },
      { status: 500 }
    )
  }
}
