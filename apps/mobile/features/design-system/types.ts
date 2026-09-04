import type { ComponentType } from 'react'

export type GalleryCategory =
  | 'All'
  | 'Primitives'
  | 'Wizards'
  | 'Vouchers'
  | 'Kanban Board'
  | 'Data Cards'
  | 'Analytics'
  | 'Stats'
  | 'Charts'
  | 'Maps'
  | 'Task'
  | 'Mail'
  | 'Notifications'
  | 'Files'
  | 'Chat'
  | 'AI'
  | 'Shared'
  | 'Date Picker'
  | 'Calendar'
  | 'Rich Editor'
  | 'Theme'
  | 'Primitives'

export interface GalleryEntry {
  id: string
  name: string
  category: GalleryCategory
  badge: string
  description: string
  filePath: string
}

export interface CategoryColorStyle {
  bg: string
  text: string
  border: string
}

export interface CategoryConfigItem {
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
  activeBg: string
  activeText: string
  activeBorder: string
  badgeActiveBg: string
  badgeActiveText: string
}
