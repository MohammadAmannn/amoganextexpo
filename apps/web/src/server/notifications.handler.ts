import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/features/chattemplate/shared/api/apiClient'
import { createQuery } from '@/features/chattemplate/shared/api/queryBuilder'

export async function handleNotificationsGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const readFilter = searchParams.get('read')
    const limit = searchParams.get('limit')

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 })
    }

    const query = createQuery()
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (readFilter !== null) {
      query.eq('read', readFilter)
    }

    if (limit) {
      query.limit(parseInt(limit, 10))
    }

    const notifications = await apiClient.get<any[]>(`/rest/v1/notifications${query.toString()}`)
    return NextResponse.json(notifications)
  } catch (err) {
    console.error('GET notifications error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function handleNotificationsPost(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.userId || !body.messageText) {
      return NextResponse.json(
        { error: 'userId and messageText are required' },
        { status: 400 }
      )
    }

    const newNotification = await apiClient.post<any>('/rest/v1/notifications', {
      user_id: body.userId,
      sender_id: body.senderId || null,
      message_id: body.messageId || null,
      message_text: body.messageText,
      read: false,
    })

    return NextResponse.json(newNotification, { status: 201 })
  } catch (err) {
    console.error('POST notification error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function handleNotificationsPatch(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const query = createQuery().eq('id', body.id)
    const updated = await apiClient.patch<any>(`/rest/v1/notifications${query.toString()}`, {
      read: body.read !== undefined ? body.read : true,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('PATCH notification error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update notification' },
      { status: 500 }
    )
  }
}
