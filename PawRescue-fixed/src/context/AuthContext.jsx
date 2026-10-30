import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function restoreSession() {
      try {
        const account = await authService.getCurrentUser()
        if (!cancelled) setUser(account)
      } catch {
        // No active session — expected for guests.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    restoreSession()
    return () => { cancelled = true }
  }, [])

  const signIn = useCallback(async (credentials) => {
    const account = await authService.login(credentials)
    setUser(account)
    return account
  }, [])

  const setSessionUser = useCallback((account) => {
    setUser(account)
    return account
  }, [])

  const signOut = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), loading, signIn, setSessionUser, signOut }),
    [user, loading, signIn, setSessionUser, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
