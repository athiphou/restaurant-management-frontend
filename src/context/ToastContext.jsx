import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Icon } from '../components/ui/Icon'

/*
  ToastContext — slide + fade transient notifications (spec §34 "Toasts").
  push({ type, title, message }) returns an id; auto-dismisses after `duration`.
*/
const ToastContext = createContext(null)

const TONE = {
  success: { icon: 'checkCircle', ring: 'ring-brand-200', accent: 'text-brand-700', bar: 'bg-brand-700' },
  error: { icon: 'alert', ring: 'ring-rose-200', accent: 'text-rose-600', bar: 'bg-rose-600' },
  warning: { icon: 'alert', ring: 'ring-amber-200', accent: 'text-amber-600', bar: 'bg-amber-500' },
  info: { icon: 'sparkles', ring: 'ring-gold-200', accent: 'text-gold-600', bar: 'bg-gold-400' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (toast) => {
      const id = ++idRef.current
      const next = { id, type: 'info', duration: 3800, ...toast }
      setToasts((list) => [...list, next])
      if (next.duration) {
        setTimeout(() => dismiss(id), next.duration)
      }
      return id
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      push,
      dismiss,
      success: (title, message) => push({ type: 'success', title, message }),
      error: (title, message) => push({ type: 'error', title, message }),
      info: (title, message) => push({ type: 'info', title, message }),
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((t) => {
          const tone = TONE[t.type] || TONE.info
          return (
            <div
              key={t.id}
              role="status"
              className={`animate-slide-in-right pointer-events-auto flex gap-3 overflow-hidden rounded-xl bg-white p-3.5 shadow-lg ring-1 ${tone.ring}`}
            >
              <span className={`mt-0.5 shrink-0 ${tone.accent}`}>
                <Icon name={tone.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                {t.title && <p className="text-sm font-semibold text-ink">{t.title}</p>}
                {t.message && <p className="mt-0.5 text-sm text-muted">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 self-start rounded-md p-1 text-muted transition hover:bg-cream-soft hover:text-ink"
                aria-label="Dismiss notification"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
