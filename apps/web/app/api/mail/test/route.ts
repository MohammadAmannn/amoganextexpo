import { handleMailTestGet } from '@/server/mail.handler'

export const dynamic = 'force-dynamic'

export async function GET() {
  return handleMailTestGet()
}
