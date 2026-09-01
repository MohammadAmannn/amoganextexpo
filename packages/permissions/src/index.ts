export type Permission = string
export function can(role: string, permission: Permission) {
  if (role === 'owner' || role === 'admin') return true
  const matrix: Record<string, string[]> = { manager: ['todo.read','todo.create','todo.update'], member: ['todo.read','todo.create'], viewer: ['todo.read'] }
  return matrix[role]?.includes(permission) ?? false
}
