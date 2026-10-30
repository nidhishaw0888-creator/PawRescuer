import { clsx } from './clsx'

export function Card({ as = 'div', className, children, ...props }) {
  const Tag = as
  return (
    <Tag className={clsx('rounded-2xl border border-stone-200/70 bg-white p-5 shadow-card', className)} {...props}>
      {children}
    </Tag>
  )
}
