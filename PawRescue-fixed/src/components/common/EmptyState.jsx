import { clsx } from './clsx'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={clsx('flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center', className)}>
      {Icon && (
        <span className="mb-4 grid size-14 place-items-center rounded-full bg-forest-50 text-forest-600">
          <Icon className="size-7" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-base font-bold text-ink-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
