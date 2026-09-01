import { NextRequest, NextResponse } from 'next/server'
import {
  getUserContacts,
  createContact,
} from '@/features/chattemplate/contacts/repositories/contact-repository'

export async function handleContactsGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 })
    }

    const contacts = await getUserContacts(userId)
    return NextResponse.json(contacts)
  } catch (err) {
    console.error('GET contacts error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function handleContactsPost(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.ownerId) {
      return NextResponse.json({ error: 'ownerId is required' }, { status: 400 })
    }

    if (!body.email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    const result = await createContact(body.ownerId, body.email, body.nickname)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to create contact' }, { status: 409 })
    }

    return NextResponse.json({ success: true, message: 'Contact added successfully' }, { status: 201 })
  } catch (err) {
    console.error('POST contact error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create contact' },
      { status: 500 }
    )
  }
}
