import {
  handleNotificationsGet,
  handleNotificationsPost,
  handleNotificationsPatch,
} from '@/server/notifications.handler'

export const GET = handleNotificationsGet
export const POST = handleNotificationsPost
export const PATCH = handleNotificationsPatch
