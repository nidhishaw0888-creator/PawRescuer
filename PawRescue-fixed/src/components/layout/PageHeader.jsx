import { clsx } from '../common/clsx'

export function PageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-ink-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function SectionHeader({ title, description, actions, className }) {
  return (
    <div className={clsx('flex items-center justify-between gap-4', className)}>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="text-sm text-ink-500">{description}</p>}
      </div>
      {actions}
    </div>
  )
}
