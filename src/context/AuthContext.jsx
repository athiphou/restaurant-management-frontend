import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as authApi from '../api/auth'
import { setAuthToken, clearAuthToken } from '../api/client'

/*
  AuthContext — Bearer-token auth against the Laravel API (spec §32).
  Persists the token in localStorage and restores it on reload. Exposes
  login / register / logout / me and an `isAuthenticated` flag.
*/
const AuthContext = createContext(null)
const TOKEN_KEY = 'rms.token'
const USER_KEY = 'rms.user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const PRIVILEGED = ['admin', 'manager', 'owner']

export function hasAdminRole(u) {
  if (!u) return false
  if (u.is_admin === true) return true
  const roles = u.roles || u.role || []
  const names = (Array.isArray(roles) ? roles : [roles]).map((r) =>
    (typeof r === 'string' ? r : r?.name || '').toLowerCase(),
  )
  return names.some((n) => PRIVILEGED.some((p) => n.includes(p)))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [initializing, setInitializing] = useState(true)

  // Prime the client with any stored token, then try to hydrate the current user.
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) {
      setInitializing(false)
      return
    }
    setAuthToken(stored)
    authApi
      .me()
      .then((res) => {
        const me = res?.data ?? null
        if (me) {
          setUser(me)
          localStorage.setItem(USER_KEY, JSON.stringify(me))
        }
      })
      .catch(() => {
        // token expired / invalid → clean slate
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        clearAuthToken()
        setToken(null)
        setUser(null)
      })
      .finally(() => setInitializing(false))
  }, [])

  const persistSession = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken)
      setAuthToken(nextToken)
    }
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(nextToken || null)
    setUser(nextUser || null)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const res = await authApi.login(credentials)
      const data = res?.data ?? {}
      persistSession(data.token || data.access_token, data.user || data.account || null)
      return data
    },
    [persistSession],
  )

  const register = useCallback(
    async (payload) => {
      const res = await authApi.register(payload)
      const data = res?.data ?? {}
      if (data.token) {
        persistSession(data.token, data.user || null)
      }
      return data
    },
    [persistSession],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      /* ignore network errors on logout */
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    clearAuthToken()
    setToken(null)
    setUser(null)
  }, [])

  const refresh = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    const res = await authApi.me()
    const me = res?.data ?? null
    if (me) {
      setUser(me)
      localStorage.setItem(USER_KEY, JSON.stringify(me))
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: hasAdminRole(user),
      initializing,
      login,
      register,
      logout,
      refresh,
    }),
    [user, token, initializing, login, register, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
