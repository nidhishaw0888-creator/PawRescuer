import { api } from './api'

export async function getNotifications(_userId) {
  const data = await api.get('/notifications')
  return data.items
}

export async function markNotificationRead(notificationId) {
  const data = await api.patch(`/notifications/${notificationId}/read`)
  return data.notification
}

export async function markAllNotificationsRead(_userId) {
  await api.patch('/notifications/read-all')
  return true
}
