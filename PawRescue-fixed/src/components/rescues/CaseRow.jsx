import { Clock, MapPin } from 'lucide-react'
import { PriorityBadge, StatusBadge } from '../common/StatusBadge'
import { formatRelativeTime } from '../../utils/format'

// Compact case summary used in queues, lists, and dashboards. Actions are passed as children.
export function CaseRow({ report, onDetails, children }) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-card sm:flex-row sm:items-center">
      <img
        src={report.photos[0]}
        alt={`${report.animalType} in case ${report.caseRef}`}
        className="h-20 w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-28"
        loading="lazy"
        onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <PriorityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
          <span className="text-xs font-semibold text-teal-600">{report.caseRef}</span>
        </div>
        <p className="mt-1 font-bold">{report.animalType} - {report.emergencyType}</p>
        <p className="line-clamp-1 text-sm text-ink-500">{report.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-500">
          <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {report.locationLabel}</span>
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {formatRelativeTime(report.createdAt)}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
        {onDetails && (
          <button type="button" onClick={() => onDetails(report)} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-teal-700 hover:bg-teal-50">
            View details
          </button>
        )}
        {children}
      </div>
    </li>
  )
}
