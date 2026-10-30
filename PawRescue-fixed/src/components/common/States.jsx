import { clsx } from './clsx'

// Shared loading, error, and confirm-dialog building blocks.
export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl bg-white/60 px-4 py-10 text-ink-500">
      <span className="size-5 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" aria-hidden="true" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-2xl border border-coral-100 bg-coral-50 px-4 py-6 text-center">
      <p className="text-sm font-semibold text-coral-700">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 rounded-xl bg-coral-600 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-coral-700">
          Try again
        </button>
      )}
    </div>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', tone = 'coral', loading }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" aria-label="Cancel" onClick={onClose} />
      <div className={clsx('relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-card-hover')}>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm text-ink-500">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-stone-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={clsx('rounded-xl px-4 py-2 text-sm font-semibold text-cream-50 disabled:opacity-60', tone === 'coral' ? 'bg-coral-600 hover:bg-coral-700' : 'bg-forest-600 hover:bg-forest-700')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
