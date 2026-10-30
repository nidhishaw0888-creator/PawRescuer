import { CheckCircle2, Circle } from 'lucide-react'
import { clsx } from '../common/clsx'
import { formatRelativeTime } from '../../utils/format'

export function Timeline({ events }) {
  if (!events?.length) return <p className="text-sm text-ink-500">No updates yet.</p>
  return (
    <ol className="relative space-y-4 before:absolute before:left-[11px] before:top-1 before:h-[calc(100%-0.5rem)] before:w-px before:bg-stone-200">
      {events.map((event, index) => {
        const isLast = index === events.length - 1
        return (
          <li key={event.at + event.status} className="flex gap-3">
            <span className={clsx('relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full', isLast ? 'bg-forest-600 text-cream-50' : 'bg-stone-100 text-ink-500')}>
              {isLast ? <CheckCircle2 className="size-4" /> : <Circle className="size-2.5 fill-current" />}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{event.status}</p>
              {event.note && <p className="text-xs text-ink-500">{event.note}</p>}
              <p className="mt-0.5 text-xs text-ink-500/80">{formatRelativeTime(event.at)}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
