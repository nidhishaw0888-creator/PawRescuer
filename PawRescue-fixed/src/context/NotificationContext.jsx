import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import * as notificationService from '../services/notificationService'

export const NotificationContext = createContext(null)

// Notifications are loaded for the signed-in account. Call refresh when a panel opens to pick up new events.
export function NotificationProvider({ userId, children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!userId) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      setItems(await notificationService.getNotifications(userId))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const markRead = useCallback(async (notificationId) => {
    await notificationService.markNotificationRead(notificationId)
    setItems((current) => current.map((item) => (item.id === notificationId ? { ...item, read: true } : item)))
  }, [])

  const markAllRead = useCallback(async () => {
    await notificationService.markAllNotificationsRead(userId)
    setItems((current) => current.map((item) => ({ ...item, read: true })))
  }, [userId])

  const value = useMemo(
    () => ({
      items,
      loading,
      unreadCount: items.filter((item) => !item.read).length,
      refresh,
      markRead,
      markAllRead,
    }),
    [items, loading, refresh, markRead, markAllRead],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
