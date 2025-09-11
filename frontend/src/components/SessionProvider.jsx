import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { logger } from '../utils/logger.js'

/**
 * Session context structure
 * user: object|null
 * loading: bool (true while fetching /api/auth/me)
 * error: string|null
 * refresh: () => Promise<void> (re-fetch session)
 * logout: () => Promise<void>
 */
const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE = import.meta?.env?.VITE_BACKEND_URL?.replace(/\/$/, '') || ''

  const fetchMe = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL('/api/auth/me', API_BASE || window.location.origin)
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const data = await res.json().catch(() => ({}))
      setUser(data?.user || null)
    } catch (e) {
      setError(e.message || 'Session error')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [API_BASE])

  // Initial load on mount
  useEffect(() => { fetchMe() }, [fetchMe])

  // Clear server cookie then reset local user
  const logout = useCallback(async () => {
    try {
      const url = new URL('/api/auth/logout', API_BASE || window.location.origin)
      await fetch(url, { method: 'POST', credentials: 'include' })
    } catch (e) {
      logger.warn('Logout failed', e)
    } finally {
      setUser(null)
    }
  }, [API_BASE])

  const value = { user, loading, error, refresh: fetchMe, logout }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within <SessionProvider>')
  return ctx
}
