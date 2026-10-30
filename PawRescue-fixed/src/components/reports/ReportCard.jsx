import { Link } from 'react-router-dom'
import { Clock, MapPin } from 'lucide-react'
import { Card } from '../common/Card'
import { ImageWithFallback } from '../common/ImageWithFallback'
import { StatusBadge, PriorityBadge } from '../common/StatusBadge'
import { Badge } from '../common/Badge'
import { formatRelativeTime } from '../../utils/format'
import { clsx } from '../common/clsx'

export function ReportCard({ report, className, to }) {
  const target = to ?? `/rescues/${report.id}`
  return (
    <Card as={Link} to={target} className={clsx('group flex flex-col gap-3 p-0 transition-shadow hover:shadow-card-hover', className)}>
      <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
        <ImageWithFallback
          src={report.photos[0]}
          alt={report.animalType}
          className="size-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <PriorityBadge severity={report.severity} />
        </div>
        <div className="absolute right-3 top-3">
          <StatusBadge status={report.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
        <div className="flex items-center gap-2">
          <Badge tone="forest">{report.animalType}</Badge>
          <Badge tone="neutral">{report.emergencyType}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-ink-700">{report.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-ink-500">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" /> {report.locationLabel}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {formatRelativeTime(report.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold text-teal-600">{report.caseRef}</p>
      </div>
    </Card>
  )
}
