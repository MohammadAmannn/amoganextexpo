import { NextResponse } from 'next/server'
import { createImapClient } from '../lib/email/imap'
import { parseEmail } from '../lib/email/email-parser'
import { transporter } from '../lib/email/mailer'
import mailConfig from '../../config/mail.json'
import { saveAttachmentLocally } from '../lib/email/attachment-storage'

/**
 * Handle GET /api/mail/inbox
 */
export async function handleMailInboxGet(request: Request) {
  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10))

  const client = createImapClient()
  let hasMore = false
  let totalMessages = 0

  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    const emailsList: any[] = []

    try {
      const status = await client.status('INBOX', { messages: true })
      totalMessages = status.messages || 0

      if (totalMessages > 0) {
        const offset = (page - 1) * limit
        const endSeq = Math.max(0, totalMessages - offset)
        const startSeq = Math.max(1, endSeq - limit + 1)

        if (endSeq >= 1) {
          const range = `${startSeq}:${endSeq}`
          hasMore = startSeq > 1

          for await (const message of client.fetch(range, { source: true, flags: true })) {
            const isRead = message.flags && message.flags.has('\\Seen')

            try {
              const parsed = await parseEmail(message.source as Buffer, message.seq, !!isRead)
              emailsList.push(parsed)
            } catch (parseErr) {
              console.error(`Failed to parse email sequence ${message.seq}:`, parseErr)
            }
          }

          emailsList.reverse()
        }
      }
    } finally {
      lock.release()
    }

    await client.logout()

    return NextResponse.json({
      success: true,
      emails: emailsList,
      hasMore,
      total: totalMessages,
      page,
      limit,
    })
  } catch (error: any) {
    console.error('Error reading mailbox via IMAP:', error)
    try {
      await client.logout()
    } catch (_) {}

    return NextResponse.json(
      {
        success: false,
        message: `Failed to load inbox emails: ${error.message || error}`,
      },
      { status: 500 }
    )
  }
}

/**
 * Handle GET /api/mail/sent
 */
export async function handleMailSentGet(request: Request) {
  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10))

  const client = createImapClient()
  let hasMore = false
  let totalMessages = 0

  try {
    await client.connect()

    let mailboxName = 'INBOX.Sent'
    let lock: any

    try {
      lock = await client.getMailboxLock(mailboxName)
    } catch (_) {
      mailboxName = 'Sent'
      lock = await client.getMailboxLock(mailboxName)
    }

    const emailsList: any[] = []

    try {
      const status = await client.status(mailboxName, { messages: true })
      totalMessages = status.messages || 0

      if (totalMessages > 0) {
        const offset = (page - 1) * limit
        const endSeq = Math.max(0, totalMessages - offset)
        const startSeq = Math.max(1, endSeq - limit + 1)

        if (endSeq >= 1) {
          const range = `${startSeq}:${endSeq}`
          hasMore = startSeq > 1

          for await (const message of client.fetch(range, { source: true, flags: true })) {
            try {
              const parsed = await parseEmail(message.source as Buffer, message.seq, true)
              emailsList.push({
                ...parsed,
                isSent: true,
              })
            } catch (parseErr) {
              console.error(`Failed to parse sent email sequence ${message.seq}:`, parseErr)
            }
          }

          emailsList.reverse()
        }
      }
    } finally {
      if (lock) {
        lock.release()
      }
    }

    await client.logout()

    return NextResponse.json({
      success: true,
      emails: emailsList,
      hasMore,
      total: totalMessages,
      page,
      limit,
    })
  } catch (error: any) {
    console.error('Error reading sent mailbox via IMAP:', error)
    try {
      await client.logout()
    } catch (_) {}

    return NextResponse.json(
      {
        success: false,
        message: `Failed to load sent emails: ${error.message || error}`,
      },
      { status: 500 }
    )
  }
}

/**
 * Handle POST /api/mail/send
 */
export async function handleMailSendPost(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html } = body

    if (!to || !subject || !html) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed: 'to', 'subject', and 'html' are required fields.",
        },
        { status: 400 }
      )
    }

    const attachments = (body.attachments || []).map((att: any) => {
      let rawContent = att.content || att.url || ''
      const filename = att.filename || att.name || 'attachment'
      const contentType = att.contentType || att.type || 'application/octet-stream'

      const saved = saveAttachmentLocally(filename, rawContent)

      if (rawContent.includes(';base64,')) {
        rawContent = rawContent.split(';base64,').pop() || ''
      }

      return {
        filename,
        contentType,
        content: Buffer.from(rawContent, 'base64'),
        url: saved.url,
        size: saved.size,
      }
    })

    const mailOptions: any = {
      from: body.from || `"${mailConfig.email.split('@')[0]}" <${mailConfig.email}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    }

    if (attachments.length > 0) {
      mailOptions.attachments = attachments
    }

    const info = await transporter.sendMail(mailOptions)

    try {
      const MailComposer = require('nodemailer/lib/mail-composer')
      const composer = new MailComposer(mailOptions)
      const rawMimeBuffer = await composer.compile().build()

      const client = createImapClient()
      await client.connect()
      await client.append('INBOX.Sent', rawMimeBuffer, ['\\Seen'])
      await client.logout()
    } catch (imapErr) {
      console.warn('Could not save to IMAP INBOX.Sent:', imapErr)
    }

    const returnedAttachments = attachments.map((att: any, idx: number) => ({
      id: `sent-att-${Date.now()}-${idx}`,
      name: att.filename,
      type: att.contentType,
      size: att.size,
      url: att.url,
    }))

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      attachments: returnedAttachments,
    })
  } catch (error: any) {
    console.error('Error sending email via Nodemailer:', error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to send email: ${error.message || error}`,
      },
      { status: 500 }
    )
  }
}

/**
 * Handle GET /api/mail/test
 */
export async function handleMailTestGet() {
  try {
    await transporter.verify()
    return NextResponse.json({
      success: true,
      message: 'SMTP connection successful',
    })
  } catch (error: any) {
    console.error('SMTP verification error:', error)
    return NextResponse.json(
      {
        success: false,
        message: `SMTP connection failed: ${error.message || error}`,
      },
      { status: 500 }
    )
  }
}
