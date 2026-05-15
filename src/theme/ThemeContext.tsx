import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { boldTokens } from './tokens'
import type { BoldTokens } from './tokens'

type ThemeMode = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  mode: ThemeMode
  dark: boolean
  T: BoldTokens
  toggle: () => void
  setMode: (m: ThemeMode) => void
}

const STORAGE_KEY = 'probatorai.theme'

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
    return 'system'
  })

  const [systemDark, setSystemDark] = useState(getSystemDark)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const dark = mode === 'system' ? systemDark : mode === 'dark'

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  const T = useMemo(() => boldTokens(dark), [dark])

  function setMode(m: ThemeMode) {
    setModeState(m)
    localStorage.setItem(STORAGE_KEY, m)
  }

  function toggle() {
    const next = dark ? 'light' : 'dark'
    setMode(next)
  }

  return (
    <ThemeContext.Provider value={{ mode, dark, T, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
