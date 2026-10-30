import { Card } from '../common/Card'
import { clsx } from '../common/clsx'

export function StatCard({ label, value, icon: Icon, tone = 'forest', hint }) {
  const tones = {
    forest: 'bg-forest-50 text-forest-700',
    teal: 'bg-teal-50 text-teal-700',
    coral: 'bg-coral-50 text-coral-700',
    amber: 'bg-amber-50 text-amber-700',
    neutral: 'bg-stone-100 text-ink-700',
  }
  return (
    <Card className={clsx('flex items-center gap-4')}>
      {Icon && (
        <span className={clsx('grid size-12 shrink-0 place-items-center rounded-xl', tones[tone])}>
          <Icon className="size-6" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="mt-1 truncate text-sm font-semibold text-ink-700">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}
      </div>
    </Card>
  )
}
