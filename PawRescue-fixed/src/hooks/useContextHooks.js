import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { RescueContext } from '../context/RescueContext'
import { NotificationContext } from '../context/NotificationContext'
import { ToastContext } from '../context/ToastContext'

function useRequiredContext(context, providerName) {
  const value = useContext(context)
  if (!value) throw new Error(`This hook must be used inside ${providerName}.`)
  return value
}

export const useAuth = () => useRequiredContext(AuthContext, 'AuthProvider')
export const useRescues = () => useRequiredContext(RescueContext, 'RescueProvider')
export const useNotifications = () => useRequiredContext(NotificationContext, 'NotificationProvider')
export const useToast = () => useRequiredContext(ToastContext, 'ToastProvider')
