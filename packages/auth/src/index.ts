export interface AuthActions {
  signIn(email: string, password: string): Promise<void>
  signUp(email: string, password: string, fullName?: string): Promise<void>
  signOut(): Promise<void>
  resetPassword(email: string): Promise<void>
}

export function normalizeAuthError(error: unknown) {
  return error instanceof Error ? error.message : 'Authentication failed'
}
