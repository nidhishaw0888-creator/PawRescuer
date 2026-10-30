import { useEffect } from 'react'
import { useNotifications } from '../hooks/useContextHooks'
import { getSocket, disconnectSocket } from '../services/socketService'

export function RealtimeNotifications({ children }) {
  const { refresh } = useNotifications()

  useEffect(() => {
    const socket = getSocket()

    const onNotification = () => {
      refresh()
    }

    socket.on('notification', onNotification)

    return () => {
      socket.off('notification', onNotification)
      disconnectSocket()
    }
  }, [refresh])

  return children
}
