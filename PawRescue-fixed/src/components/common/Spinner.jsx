import { Loader2 } from 'lucide-react'
import { clsx } from './clsx'

export function Spinner({ className, label = 'Loading' }) {
  return (
    <span className="inline-flex items-center gap-2 text-ink-500" role="status" aria-live="polite">
      <Loader2 className={clsx('size-5 animate-spin', className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function FullPageSpinner({ label = 'Loading PawRescue' }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Spinner label={label} />
    </div>
  )
}
