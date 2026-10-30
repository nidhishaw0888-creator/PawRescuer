import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RescueProvider } from './context/RescueContext'
import { ToastProvider } from './context/ToastContext'
import { NotificationGate } from './context/NotificationGate'
import { RealtimeNotifications } from './context/RealtimeNotifications'
import { router } from './routes/router'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RescueProvider>
          <NotificationGate>
            <RealtimeNotifications>
              <RouterProvider router={router} />
            </RealtimeNotifications>
          </NotificationGate>
        </RescueProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
