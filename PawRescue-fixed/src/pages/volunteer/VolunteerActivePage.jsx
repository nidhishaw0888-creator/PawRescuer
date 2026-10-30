import { useState } from 'react'
import { HeartPulse } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState, ErrorState } from '../../components/common/States'
import { CaseRow } from '../../components/rescues/CaseRow'
import { CaseActions } from '../../components/rescues/CaseActions'
import { CaseDetailModal } from '../../components/rescues/CaseDetailModal'
import { useAuth, useRescues } from '../../hooks/useContextHooks'
import { ACTIVE_STATUSES } from '../../utils/constants'

export function VolunteerActivePage() {
  const { user } = useAuth()
  const { reports, loading, error, refresh } = useRescues()
  const [openId, setOpenId] = useState(null)

  if (loading) return <LoadingState label="Loading your rescues" />
  if (error) return <ErrorState message="Your rescues could not be loaded." onRetry={refresh} />

  const active = reports.filter((report) => report.assignedTo?.id === user.id && ACTIVE_STATUSES.includes(report.status))
  const openReport = active.find((report) => report.id === openId) ?? null

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Active rescues"
        title="Cases you are handling"
        subtitle="Open a case to update its status or add evidence photos."
      />

      {active.length === 0 ? (
        <EmptyState icon={HeartPulse} title="No active rescues" description="Accept a case from your available list to start a rescue." />
      ) : (
        <ul className="flex flex-col gap-3">
          {active.map((report) => (
            <CaseRow key={report.id} report={report} onDetails={(item) => setOpenId(item.id)} />
          ))}
        </ul>
      )}

      <CaseDetailModal report={openReport} onClose={() => setOpenId(null)}>
        {openReport && <CaseActions report={openReport} actor={user} />}
      </CaseDetailModal>
    </div>
  )
}
