import { handleMailSendPost } from '@/server/mail.handler'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return handleMailSendPost(request)
}
