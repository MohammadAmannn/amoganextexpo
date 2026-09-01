import { z } from 'zod'

const publicSupabaseSchema = z.object({ url: z.string().url(), publishableKey: z.string().min(10) })
export function parsePublicSupabaseConfig(input: { url?: string; publishableKey?: string }) {
  return publicSupabaseSchema.parse(input)
}
export interface AppConfig { id: string; name: string; skin: string; features: Record<string, boolean> }
