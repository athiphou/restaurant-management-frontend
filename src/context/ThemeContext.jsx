import { createContext, useContext, useMemo } from 'react'

/*
  ThemeContext — the spec explicitly forbids a dark/light mode switch, so this
  provider simply pins the app to the single premium light theme and exposes a
  couple of presentation flags. It exists because main.jsx wraps the app in it.
*/
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const value = useMemo(() => ({ theme: 'light' }), [])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
