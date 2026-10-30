import { clsx } from './clsx'

export function Input({ label, id, error, hint, className, ...props }) {
  const inputId = id || props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-ink-900">
          {label}
          {props.required && <span className="ml-0.5 text-coral-600">*</span>}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={clsx(
          'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/60 transition-colors focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-teal-500',
          error ? 'border-coral-500' : 'border-stone-300',
          className,
        )}
        {...props}
      />
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-ink-500">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-coral-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function Textarea({ label, id, error, hint, className, ...props }) {
  const inputId = id || props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-ink-900">
          {label}
          {props.required && <span className="ml-0.5 text-coral-600">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={clsx(
          'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/60 transition-colors focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-teal-500',
          error ? 'border-coral-500' : 'border-stone-300',
          className,
        )}
        {...props}
      />
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-ink-500">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-coral-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function Select({ label, id, error, hint, children, className, ...props }) {
  const inputId = id || props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-ink-900">
          {label}
          {props.required && <span className="ml-0.5 text-coral-600">*</span>}
        </label>
      )}
      <select
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={clsx(
          'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-teal-500',
          error ? 'border-coral-500' : 'border-stone-300',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-ink-500">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-coral-700">
          {error}
        </p>
      )}
    </div>
  )
}
