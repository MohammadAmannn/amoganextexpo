import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface DbNotification {
  id: string
  user_id: string
  sender_id: string | null
  message_id: string | null
  message_text: string
  read: boolean
  created_at: string
}

interface NotificationState {
  notifications: DbNotification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: (userId: string) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: (userId: string) => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  subscribeToNotifications: (userId: string) => void
  unsubscribe: () => void
}

let activeChannel: RealtimeChannel | null = null

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId: string) => {
    if (!userId) return
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const notifications = (data as DbNotification[]) || []
      const unreadCount = notifications.filter((n) => !n.read).length
      set({ notifications, unreadCount })
    } catch (e) {
      console.warn('[NotificationStore] Failed to fetch notifications:', e)
    } finally {
      set({ isLoading: false })
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
        const unreadCount = updated.filter((n) => !n.read).length
        return { notifications: updated, unreadCount }
      })
    } catch (e) {
      console.warn('[NotificationStore] Failed to mark as read:', e)
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }))
    } catch (e) {
      console.warn('[NotificationStore] Failed to mark all as read:', e)
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      set((state) => {
        const updated = state.notifications.filter((n) => n.id !== notificationId)
        const unreadCount = updated.filter((n) => !n.read).length
        return { notifications: updated, unreadCount }
      })
    } catch (e) {
      console.warn('[NotificationStore] Failed to delete notification:', e)
    }
  },

  subscribeToNotifications: (userId: string) => {
    if (!userId || activeChannel) return

    activeChannel = supabase
      .channel(`public:notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as DbNotification
          set((state) => {
            const exists = state.notifications.some((n) => n.id === newNotif.id)
            if (exists) return state
            const updated = [newNotif, ...state.notifications]
            const unreadCount = updated.filter((n) => !n.read).length
            return { notifications: updated, unreadCount }
          })
        }
      )
      .subscribe()
  },

  unsubscribe: () => {
    if (activeChannel) {
      supabase.removeChannel(activeChannel)
      activeChannel = null
    }
  },
}))
