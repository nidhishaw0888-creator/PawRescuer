import { clsx } from './clsx'

const VARIANTS = {
  primary: 'bg-forest-600 text-cream-50 hover:bg-forest-700 shadow-sm',
  secondary: 'bg-white text-forest-700 border border-forest-200 hover:bg-forest-50',
  coral: 'bg-coral-500 text-cream-50 hover:bg-coral-600 shadow-sm',
  outline: 'bg-transparent text-ink-700 border border-stone-300 hover:bg-stone-50',
  ghost: 'bg-transparent text-ink-700 hover:bg-stone-100',
  subtle: 'bg-forest-50 text-forest-700 hover:bg-forest-100',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ as = 'button', variant = 'primary', size = 'md', className, children, isLoading, ...props }) {
  const Tag = as
  return (
    <Tag
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={isLoading ?? undefined}
      {...props}
    >
      {isLoading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </Tag>
  )
}
