import { Modal } from '../common/Modal'
import { Badge } from '../common/Badge'
import { PriorityBadge, StatusBadge } from '../common/StatusBadge'
import { Timeline } from '../reports/Timeline'
import { formatDateTime, formatCoordinates } from '../../utils/format'

export function CaseDetailModal({ report, onClose, children }) {
  if (!report) return null
  return (
    <Modal open onClose={onClose} title={`Case ${report.caseRef}`} size="lg">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="forest">{report.animalType}</Badge>
          <Badge tone="neutral">{report.emergencyType}</Badge>
          <PriorityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
        </div>
        <p className="text-sm text-ink-700">{report.description}</p>
        {report.symptoms && <p className="text-sm text-ink-500">Symptoms: {report.symptoms}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {report.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`${report.animalType} photo ${index + 1}`} className="h-44 w-full rounded-xl object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} />
          ))}
        </div>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase text-ink-500">Location</dt><dd className="font-semibold">{report.locationLabel}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-ink-500">Coordinates</dt><dd className="font-semibold">{formatCoordinates(report.location.lat, report.location.lng)}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-ink-500">Observed</dt><dd className="font-semibold">{formatDateTime(report.observedAt)}</dd></div>
          <div><dt className="text-xs font-semibold uppercase text-ink-500">Assigned to</dt><dd className="font-semibold">{report.assignedTo?.name ?? 'Awaiting responder'}</dd></div>
        </dl>
        {children}
        <div>
          <h3 className="mb-3 font-bold">Progress timeline</h3>
          <Timeline events={report.timeline} />
        </div>
      </div>
    </Modal>
  )
}
