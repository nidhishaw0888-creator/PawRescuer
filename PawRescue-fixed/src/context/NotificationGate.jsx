import { NotificationProvider } from './NotificationContext'
import { useAuth } from '../hooks/useContextHooks'

// Provides notifications for whichever account is currently signed in. When there is no session,
// the provider still mounts so guest pages can use the unread count without crashing.
export function NotificationGate({ children }) {
  const { user } = useAuth()
  return (
    <NotificationProvider key={user?.id ?? 'guest'} userId={user?.id ?? null}>
      {children}
    </NotificationProvider>
  )
}
