import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState, ErrorState } from '../../components/common/States'
import { CaseRow } from '../../components/rescues/CaseRow'
import { CaseDetailModal } from '../../components/rescues/CaseDetailModal'
import { useAuth, useRescues } from '../../hooks/useContextHooks'
import { ShieldCheck } from 'lucide-react'

export function VolunteerHistoryPage() {
  const { user } = useAuth()
  const { reports, loading, error, refresh } = useRescues()
  const [openReport, setOpenReport] = useState(null)

  if (loading) return <LoadingState label="Loading your history" />
  if (error) return <ErrorState message="Your history could not be loaded." onRetry={refresh} />

  const completed = reports.filter((report) => report.assignedTo?.id === user.id && report.status === 'Resolved')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Completed rescues" title="Your rescue history" subtitle="Cases you helped bring to a resolved outcome." />

      {completed.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No completed rescues yet" description="Resolved cases you handled will be listed here." />
      ) : (
        <ul className="flex flex-col gap-3">
          {completed.map((report) => (
            <CaseRow key={report.id} report={report} onDetails={setOpenReport} />
          ))}
        </ul>
      )}

      <CaseDetailModal report={openReport} onClose={() => setOpenReport(null)} />
    </div>
  )
}
