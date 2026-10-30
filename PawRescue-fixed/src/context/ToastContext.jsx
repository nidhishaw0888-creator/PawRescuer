import { createContext, useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle2, CircleAlert, Info } from 'lucide-react'

export const ToastContext = createContext(null)

const TONE_STYLES = {
  success: { icon: CheckCircle2, className: 'border-teal-500 text-teal-700' },
  error: { icon: CircleAlert, className: 'border-coral-600 text-coral-700' },
  info: { icon: Info, className: 'border-forest-500 text-forest-700' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, tone = 'success') => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, tone }])
      setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6" aria-live="polite">
        {toasts.map((toast) => {
          const { icon: Icon, className } = TONE_STYLES[toast.tone]
          return (
            <div
              key={toast.id}
              role="status"
              className={`fade-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border-l-4 bg-white px-4 py-3 shadow-card-hover ${className}`}
            >
              <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm font-semibold text-ink-900">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="text-sm font-semibold text-ink-500 hover:text-ink-900"
                aria-label="Dismiss notification message"
              >
                Close
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
