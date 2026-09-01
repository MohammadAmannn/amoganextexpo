export type UUID = string
export type ISODateString = string
export type Role = 'owner' | 'admin' | 'manager' | 'member' | 'viewer'

export interface Profile {
  id: UUID
  email: string | null
  fullName: string | null
  avatarUrl: string | null
  createdAt: ISODateString
}

export interface Organization {
  id: UUID
  name: string
  slug: string
  createdAt: ISODateString
}

export interface Membership {
  organizationId: UUID
  userId: UUID
  role: Role
}

export interface Todo {
  id: UUID
  organizationId: UUID
  title: string
  completed: boolean
  createdBy: UUID
  createdAt: ISODateString
  updatedAt: ISODateString
}
