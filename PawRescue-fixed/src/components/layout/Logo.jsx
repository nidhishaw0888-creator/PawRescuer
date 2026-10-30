import { PawPrint } from 'lucide-react'
import { clsx } from '../common/clsx'

export function Logo({ className, compact = false }) {
  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-forest-600 text-cream-50">
        <PawPrint className="size-5" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-extrabold tracking-tight text-forest-700">PawRescue</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-600">Emergency Animal Rescue</span>
        </span>
      )}
    </span>
  )
}
