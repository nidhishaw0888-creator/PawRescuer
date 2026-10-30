import { clsx } from './clsx'

export function Badge({ children, className, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-stone-100 text-ink-700',
    forest: 'bg-forest-50 text-forest-700',
    teal: 'bg-teal-50 text-teal-700',
    coral: 'bg-coral-50 text-coral-700',
    amber: 'bg-amber-50 text-amber-700',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone], className)}>
      {children}
    </span>
  )
}
