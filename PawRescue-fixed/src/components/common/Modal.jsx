import { useEffect } from 'react'
import { X } from 'lucide-react'
import { clsx } from './clsx'

export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" aria-label="Close dialog" onClick={onClose} />
      <div className={clsx('relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-cream-50 shadow-card-hover sm:rounded-2xl', sizes[size])}>
        <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-stone-200 bg-cream-50/95 px-5 py-4 backdrop-blur">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-500 hover:bg-stone-100 hover:text-ink-900" aria-label="Close dialog">
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="sticky bottom-0 flex justify-end gap-2 border-t border-stone-200 bg-cream-50/95 px-5 py-4 backdrop-blur">{footer}</div>}
      </div>
    </div>
  )
}
