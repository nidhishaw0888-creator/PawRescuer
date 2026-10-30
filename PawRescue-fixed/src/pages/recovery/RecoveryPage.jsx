import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, HeartPulse, Phone, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState, ErrorState } from '../../components/common/States'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useRescues } from '../../hooks/useContextHooks'
import { getRecovery as fetchRecovery } from '../../services/recoveryService'
import { getRescue } from '../../services/rescueService'
import { formatDateTime } from '../../utils/format'

export function RecoveryPage() {
  const { id } = useParams()
  const { reports, loading: reportsLoading, error: reportsError, refresh } = useRescues()
  const report = reports.find((entry) => entry.id === id)

  const [recovery, setRecovery] = useState(null)
  const [recoveryLoading, setRecoveryLoading] = useState(true)
  const [recoveryError, setRecoveryError] = useState(null)

  useEffect(() => {
    if (!report) return
    let cancelled = false
    setRecoveryLoading(true)
    setRecoveryError(null)
    getRescue(report.id)
      .then(({ rescueCaseId }) => (rescueCaseId ? fetchRecovery(rescueCaseId) : null))
      .then((data) => { if (!cancelled) setRecovery(data) })
      .catch((err) => { if (!cancelled) setRecoveryError(err) })
      .finally(() => { if (!cancelled) setRecoveryLoading(false) })
    return () => { cancelled = true }
  }, [report])

  if (reportsLoading) return <div className="mx-auto max-w-3xl px-4 py-12"><LoadingState label="Loading recovery record" /></div>
  if (reportsError) return <div className="mx-auto max-w-3xl px-4 py-12"><ErrorState message="The case could not be loaded." onRetry={refresh} /></div>

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          icon={HeartPulse}
          title="Case not found"
          description="This case could not be found. It may have been removed."
          action={<Button as={Link} to="/map" variant="secondary"><ArrowLeft className="size-4" /> Back to map</Button>}
        />
      </div>
    )
  }

  if (recoveryLoading) return <div className="mx-auto max-w-3xl px-4 py-12"><LoadingState label="Loading recovery record" /></div>
  if (recoveryError) return <div className="mx-auto max-w-3xl px-4 py-12"><ErrorState message="The recovery record could not be loaded." /></div>

  if (!recovery) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          icon={HeartPulse}
          title="No recovery record"
          description="This case does not have a recovery record yet. Records appear once an animal reaches care."
          action={<Button as={Link} to="/map" variant="secondary"><ArrowLeft className="size-4" /> Back to map</Button>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Button as={Link} to={`/rescues/${report.id}`} variant="ghost" size="sm" className="mb-4">
        <ArrowLeft className="size-4" /> Back to case
      </Button>
      <PageHeader
        eyebrow={`Recovery · ${report.caseRef}`}
        title={`${report.animalType} recovery`}
        subtitle="Public updates on this animal's recovery."
      />

      <div className="mt-6 flex flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={report.status} />
            <Badge tone="teal">{recovery.recoveryStatus}</Badge>
            {recovery.outcome && <Badge tone="forest">Outcome: {recovery.outcome}</Badge>}
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-ink-500">Care provider</dt>
              <dd className="font-semibold">{recovery.clinicOrShelter || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-ink-500">Case opened</dt>
              <dd className="font-semibold">{formatDateTime(report.createdAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="mb-4 font-bold">Notes</h2>
          {recovery.notes ? (
            <p className="text-sm text-ink-900">{recovery.notes}</p>
          ) : (
            <p className="text-sm text-ink-500">No updates yet.</p>
          )}
          {recovery.transferDetails && (
            <p className="mt-3 text-sm text-ink-700"><MapPin className="mr-1 inline size-4 text-teal-600" />Transfer details: {recovery.transferDetails}</p>
          )}
        </Card>
      </div>
    </div>
  )
}
