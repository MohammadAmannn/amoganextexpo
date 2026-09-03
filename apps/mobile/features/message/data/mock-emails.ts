export interface Email {
  id: string
  name: string
  email: string
  replyTo: string
  subject: string
  preview: string
  body: string
  date: string
  relativeDate: string
  read: boolean
  labels: string[]
  avatarInitials: string
  important?: boolean
  attachments?: { id?: string; name: string; type: string; size: string; url?: string }[]
}

export const initialEmails: Email[] = [
  {
    id: 'email-1',
    name: 'ask',
    email: 'ask@morrai.com',
    replyTo: 'ask@morrai.com',
    subject: 'for me',
    preview: 'Weekly updates and status reports for the engineering team.',
    body: 'Hi Aman,\n\nHere are the weekly updates and status reports for the engineering team.\n\nPlease review and let me know if you have any questions.\n\nBest,\nAsk',
    date: new Date(Date.now() - 20 * 86400000).toISOString(),
    relativeDate: '20 days ago',
    read: false,
    labels: ['Inbox'],
    avatarInitials: 'A',
  },
  {
    id: 'email-2',
    name: 'Raju Krishna',
    email: 'n.rajukrishna@gmail.com',
    replyTo: 'n.rajukrishna@gmail.com',
    subject: 'Fwd: with attachemtns',
    preview: 'test -------- Forwarded message -------- From: Raju Krishna <n.rajukrishna@gmail.com> Date: Fri, 14 Aug 2026 at 15:20...',
    body: `test\n\n-------- Forwarded message --------\nFrom: Raju Krishna <n.rajukrishna@gmail.com>\nDate: Fri, 14 Aug 2026 at 15:20\nSubject: Fwd: with attachemtns\nTo: ask <ask@morrai.com>\n\n\n-------- Forwarded message --------\nFrom: Raju Krishna <n.rajukrishna@gmail.com>\nDate: Fri, 14 Aug 2026 at 12:57\nSubject: with attachemtns\nTo: ask <ask@morrai.com>\n\nwith attachemtns`,
    date: '2026-08-14T15:35:00.000Z',
    relativeDate: '20 days ago',
    read: false,
    labels: ['Unread', 'Inbox'],
    avatarInitials: 'R',
    attachments: [
      { id: 'att-1', name: 'document-spec.pdf', type: 'pdf', size: '1.4 MB' },
    ],
  },
  {
    id: 'email-3',
    name: 'Mohammed Aman',
    email: 'itsaman00786@gmail.com',
    replyTo: 'itsaman00786@gmail.com',
    subject: 'Re:',
    preview: 'Fff On Fri, 14 Aug 2026, 15:28 Mohammed Aman,...',
    body: 'Fff On Fri, 14 Aug 2026, 15:28 Mohammed Aman wrote:\n\nConfirmed, the cross platform Expo web layout is working smoothly.',
    date: '2026-08-14T15:28:00.000Z',
    relativeDate: '20 days ago',
    read: false,
    labels: ['Unread', 'Inbox'],
    avatarInitials: 'MA',
  },
  {
    id: 'email-4',
    name: 'Mohammed Aman',
    email: 'itsaman00786@gmail.com',
    replyTo: 'itsaman00786@gmail.com',
    subject: 'Re:',
    preview: 'Gggg On Fri, 14 Aug 2026, 15:27 Mohammed Aman,...',
    body: 'Gggg On Fri, 14 Aug 2026, 15:27 Mohammed Aman wrote:\n\nReviewing next release candidate.',
    date: '2026-08-14T15:27:00.000Z',
    relativeDate: '20 days ago',
    read: false,
    labels: ['Unread', 'Inbox'],
    avatarInitials: 'MA',
  },
  {
    id: 'email-5',
    name: 'Mohammed Aman',
    email: 'itsaman00786@gmail.com',
    replyTo: 'itsaman00786@gmail.com',
    subject: 'Re:',
    preview: 'Yuy On Fri, 14 Aug 2026, 15:27 Mohammed Aman,...',
    body: 'Yuy On Fri, 14 Aug 2026, 15:27 Mohammed Aman wrote:\n\nStatus approved.',
    date: '2026-08-14T15:27:00.000Z',
    relativeDate: '20 days ago',
    read: false,
    labels: ['Unread', 'Inbox'],
    avatarInitials: 'MA',
  },
]
