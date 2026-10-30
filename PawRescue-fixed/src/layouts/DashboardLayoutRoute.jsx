import { Navigate, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuth } from '../hooks/useContextHooks'
import { ROLE_HOME } from '../utils/constants'

export function DashboardRoute({ roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (!roles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />

  return (
    <DashboardLayout>
      <Outlet />
      <ScrollRestoration />
    </DashboardLayout>
  )
}
