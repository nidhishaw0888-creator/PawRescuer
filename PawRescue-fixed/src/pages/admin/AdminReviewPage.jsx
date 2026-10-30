import { useState } from 'react'
import { Flag, Check, X } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { LoadingState, ErrorState } from '../../components/common/States'
import { EmptyState } from '../../components/common/EmptyState'
import { useToast } from '../../hooks/useContextHooks'
import { useAsyncData } from '../../hooks/useAsyncData'
import * as userService from '../../services/userService'
import { formatRelativeTime } from '../../utils/format'

export function AdminReviewPage() {
  const { showToast } = useToast()
  const { data, loading, error, reload } = useAsyncData(() => userService.getAbuseReports(), [])
  const [busyId, setBusyId] = useState(null)

  const handleResolve = async (reportId, resolution) => {
    setBusyId(reportId)
    try {
      await userService.resolveAbuseReport(reportId, resolution)
      showToast(`Report ${resolution.toLowerCase()}`, 'success')
      await reload()
    } catch (actionError) {
      showToast(actionError.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <LoadingState label="Loading case reviews" />
  if (error) return <ErrorState message="Abuse reports could not be loaded." onRetry={reload} />

  const openReports = data.filter((r) => r.status === 'Open')
  const resolvedReports = data.filter((r) => r.status !== 'Open')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin · case review"
        title="Abuse & dispute reports"
        subtitle="Reports submitted about cases. Confirm or dismiss each one."
      />

      {openReports.length === 0 ? (
        <EmptyState icon={Flag} title="No open reports" description="All submitted abuse and dispute reports have been resolved." />
      ) : (
        <ul className="flex flex-col gap-3">
          {openReports.map((r) => (
            <li key={r.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="coral">{r.caseRef}</Badge>
                    <Badge tone="neutral">{r.status}</Badge>
                    <span className="text-xs text-ink-500">Submitted {formatRelativeTime(r.createdAt)}</span>
                  </div>
                  <p className="mt-2 font-semibold">{r.reason}</p>
                  <p className="mt-1 text-sm text-ink-500">Reported by {r.reportedBy}</p>
                </div>
                <div className="flex gap-2 sm:flex-col sm:items-end">
                  <Button size="sm" variant="subtle" isLoading={busyId === r.id} onClick={() => handleResolve(r.id, 'Confirmed')}>
                    <Check className="size-4" /> Confirm
                  </Button>
                  <Button size="sm" variant="ghost" isLoading={busyId === r.id} onClick={() => handleResolve(r.id, 'Dismissed')}>
                    <X className="size-4" /> Dismiss
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Resolved reports</h2>
        {resolvedReports.length === 0 ? (
          <p className="py-2 text-sm text-ink-500">No resolved reports yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-stone-200">
            {resolvedReports.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <span className="font-semibold text-teal-700">{r.caseRef}</span>
                  <span className="ml-2 text-sm text-ink-700">{r.reason}</span>
                </div>
                <Badge tone={r.status === 'Dismissed' ? 'neutral' : 'forest'}>{r.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
