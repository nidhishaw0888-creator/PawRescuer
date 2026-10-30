import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Navigation, PawPrint, Phone, ShieldCheck, User } from 'lucide-react'
import { useRescues } from '../../hooks/useContextHooks'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge'
import { Timeline } from '../../components/reports/Timeline'
import { RescueMap } from '../../components/maps/RescueMap'
import { LoadingState } from '../../components/common/States'
import { formatDateTime, formatRelativeTime, formatCoordinates } from '../../utils/format'
import { directionsUrl } from '../../utils/geo'

export function RescueDetailsPage() {
  const { id } = useParams()
  const { reports, loading } = useRescues()
  const report = reports.find((entry) => entry.id === id)

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-12"><LoadingState label="Loading case" /></div>
  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Case not found</h1>
        <p className="mt-2 text-sm text-ink-500">This case may have been removed or no longer exists.</p>
        <Button as={Link} to="/map" variant="secondary" className="mt-6"><ArrowLeft className="size-4" /> Back to map</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <Button as={Link} to="/map" variant="ghost" size="sm"><ArrowLeft className="size-4" /> Back to map</Button>
        <Badge tone="neutral">Case</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="forest"><PawPrint className="size-3" /> {report.animalType}</Badge>
        <Badge tone="neutral">{report.emergencyType}</Badge>
        <PriorityBadge severity={report.severity} />
        <StatusBadge status={report.status} />
      </div>
      <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{report.caseRef}</h1>
      <p className="mt-2 text-ink-700">{report.description}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="mb-3 text-lg font-bold">Photographs</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {report.photos.map((photo, index) => (
                <ImageWithFallback key={index} src={photo} alt={`${report.animalType} photo ${index + 1}`} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-bold">Reported location</h2>
            <RescueMap reports={[report]} selectedId={report.id} onSelect={() => {}} className="w-full" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-500">
              <span className="flex items-center gap-1"><MapPin className="size-4 text-teal-600" /> {report.locationLabel}</span>
              <span>{formatCoordinates(report.location.lat, report.location.lng)}</span>
            </div>
            <Button as="a" href={directionsUrl(report.location.lat, report.location.lng)} target="_blank" rel="noreferrer" variant="secondary" size="sm" className="mt-3">
              <Navigation className="size-4" /> Open directions
            </Button>
          </Card>

          {report.evidence.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-bold">Rescue evidence</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {report.evidence.map((photo, index) => (
                  <ImageWithFallback key={index} src={photo} alt={`Evidence ${index + 1}`} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <h2 className="font-bold">Case summary</h2>
            <SummaryRow icon={Calendar} label="Observed" value={formatDateTime(report.observedAt)} />
            <SummaryRow icon={Clock} label="Reported" value={formatRelativeTime(report.createdAt)} />
            <SummaryRow icon={Clock} label="Last update" value={formatRelativeTime(report.updatedAt)} />
            <div>
              <Assignment report={report} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-bold">Progress timeline</h2>
            <Timeline events={report.timeline} />
          </Card>

          <Card className="flex flex-col gap-2">
            <h2 className="font-bold">Safe contact action</h2>
            <p className="text-sm text-ink-500">In the full platform, verified responders can contact the reporter through secure in-app messaging.</p>
            <Button variant="secondary" size="sm" className="mt-1 self-start" disabled>
              <Phone className="size-4" /> Contact
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="flex items-center gap-2 text-ink-500"><Icon className="size-4" /> {label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  )
}

function Assignment({ report }) {
  if (!report.assignedTo) {
    return (
      <div className="mt-1 flex items-center gap-2 rounded-lg bg-cream-200 px-3 py-2 text-sm">
        <User className="size-4 text-ink-500" /> Awaiting responder
      </div>
    )
  }
  return (
    <div className="mt-1 flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm">
      <ShieldCheck className="size-4 text-teal-700" /> Assigned to <span className="font-semibold">{report.assignedTo.name}</span>
      <Badge tone="neutral" className="ml-1">{report.assignedTo.type}</Badge>
    </div>
  )
}
