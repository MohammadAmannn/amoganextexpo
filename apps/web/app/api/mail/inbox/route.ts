import { handleMailInboxGet } from '@/server/mail.handler'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return handleMailInboxGet(request)
}
