import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTheme } from '../../theme/ThemeContext'
import { I } from './icons'

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

type ToastItem = { id: string; message: string; type: ToastType }

type ToastContextValue = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

// ─── Contexto ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
  info: () => {},
})

export function useToast(): ToastContextValue {
  return useContext(ToastContext)
}

// ─── Item visual ─────────────────────────────────────────────────────────────

function ToastBubble({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const { T } = useTheme()

  const variants = {
    success: { color: T.success, bg: `${T.success}14`, border: `1px solid ${T.success}35`, icon: <I.Check size={15} stroke={2.5} /> },
    error:   { color: T.danger,  bg: `${T.danger}14`,  border: `1px solid ${T.danger}35`,  icon: <I.Close size={15} stroke={2.5} /> },
    info:    { color: T.ai,      bg: T.aiBg,           border: `1px solid ${T.aiBorder}`,  icon: <I.Sparkles size={14} stroke={2.2} /> },
  }

  const v = variants[toast.type]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px 12px 12px',
        background: T.surface,
        borderRadius: 14,
        border: v.border,
        boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
        maxWidth: 360,
        minWidth: 220,
        animation: 'toast-in .18s ease',
      }}
    >
      {/* Colored left accent */}
      <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 99, background: v.color, flexShrink: 0 }} />

      {/* Icon */}
      <span style={{ color: v.color, flexShrink: 0, marginTop: 1 }}>{v.icon}</span>

      {/* Message */}
      <span style={{ flex: 1, fontSize: 13.5, color: T.text, lineHeight: 1.45 }}>{toast.message}</span>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        style={{ background: 'transparent', border: 'none', color: T.textMute, cursor: 'pointer', padding: 2, flexShrink: 0, display: 'flex', alignItems: 'center' }}
      >
        <I.X size={13} stroke={2} />
      </button>
    </div>
  )
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2, 10)
    setToasts((prev) => [...prev, { id, message, type }])
    const timer = setTimeout(() => removeToast(id), 4200)
    timers.current.set(id, timer)
  }, [removeToast])

  const value: ToastContextValue = {
    success: (m) => addToast(m, 'success'),
    error:   (m) => addToast(m, 'error'),
    info:    (m) => addToast(m, 'info'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 20,
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
          alignItems: 'flex-end',
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastBubble toast={t} onClose={() => removeToast(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
