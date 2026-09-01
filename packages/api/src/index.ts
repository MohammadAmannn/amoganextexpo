import type { SupabaseClient } from '@supabase/supabase-js'
import type { Todo } from '@amoga/types'
import type { TodoCreateInput } from '@amoga/schemas'

export function createApi(client: SupabaseClient) {
  return {
    todos: {
      async list(organizationId: string) {
        const { data, error } = await client.from('todos').select('*').eq('organization_id', organizationId).order('created_at', { ascending: false })
        if (error) throw error
        return (data ?? []).map((row: any): Todo => ({
          id: row.id, organizationId: row.organization_id, title: row.title, completed: row.completed,
          createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.updated_at,
        }))
      },
      async create(organizationId: string, userId: string, input: TodoCreateInput) {
        const { data, error } = await client.from('todos').insert({ organization_id: organizationId, created_by: userId, title: input.title }).select('*').single()
        if (error) throw error
        return data
      },
      async toggle(id: string, completed: boolean) {
        const { data, error } = await client.from('todos').update({ completed }).eq('id', id).select('*').single()
        if (error) throw error
        return data
      },
      async remove(id: string) {
        const { error } = await client.from('todos').delete().eq('id', id)
        if (error) throw error
      },
    },
  }
}
