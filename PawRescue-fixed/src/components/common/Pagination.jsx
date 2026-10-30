import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null
  return (
    <nav className="flex items-center justify-end gap-2 text-sm" aria-label="Pagination">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className="rounded-lg border border-stone-300 p-1.5 hover:bg-stone-50 disabled:opacity-40" aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </button>
      <span className="font-semibold">Page {page} of {pageCount}</span>
      <button type="button" disabled={page === pageCount} onClick={() => onChange(page + 1)} className="rounded-lg border border-stone-300 p-1.5 hover:bg-stone-50 disabled:opacity-40" aria-label="Next page">
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
