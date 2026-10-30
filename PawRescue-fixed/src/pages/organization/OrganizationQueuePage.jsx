import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState, ErrorState } from '../../components/common/States'
import { CaseRow } from '../../components/rescues/CaseRow'
import { CaseActions } from '../../components/rescues/CaseActions'
import { CaseDetailModal } from '../../components/rescues/CaseDetailModal'
import { TeamAssignment } from '../../components/rescues/TeamAssignment'
import { useAuth, useRescues, useToast } from '../../hooks/useContextHooks'
import { ACTIVE_STATUSES } from '../../utils/constants'

export function OrganizationQueuePage() {
  const { user } = useAuth()
  const { reports, loading, error, refresh, acceptCase } = useRescues()
  const { showToast } = useToast()
  const [openId, setOpenId] = useState(null)
  const [busyId, setBusyId] = useState(null)

  if (loading) return <LoadingState label="Loading incoming queue" />
  if (error) return <ErrorState message="The queue could not be loaded." onRetry={refresh} />

  const isVerified = user.verificationStatus === 'Verified'
  const incoming = reports.filter((report) => report.status === 'Reported' && !report.assignedTo)
  const ours = reports.filter(
    (report) => (report.assignedTo?.id === user.id || report.assignedTo?.organizationId === user.id) && ACTIVE_STATUSES.includes(report.status),
  )
  const openReport = ours.find((report) => report.id === openId) ?? null

  const handleAccept = async (report) => {
    setBusyId(report.id)
    try {
      await acceptCase(report.id, user)
      showToast(`${report.caseRef} accepted by ${user.name}`, 'success')
    } catch (actionError) {
      showToast(actionError.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Incoming queue" title="Requests for your organization" subtitle="Accept new cases, then assign them to a team member." />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Awaiting a responder</h2>
        {incoming.length === 0 ? (
          <EmptyState icon={Inbox} title="Nothing waiting" description="New unassigned cases will appear here." />
        ) : (
          <ul className="flex flex-col gap-3">
            {incoming.map((report) => (
              <CaseRow key={report.id} report={report} showDistance>
                <Button size="sm" disabled={!isVerified || busyId === report.id} isLoading={busyId === report.id} onClick={() => handleAccept(report)}>
                  Accept request
                </Button>
              </CaseRow>
            ))}
          </ul>
        )}
        {!isVerified && <Card className="text-sm text-ink-500">Accepting requests is available once your organization is verified.</Card>}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">In your care</h2>
        {ours.length === 0 ? (
          <EmptyState icon={Inbox} title="No cases in progress" description="Accepted cases will show here until they are resolved." />
        ) : (
          <ul className="flex flex-col gap-3">
            {ours.map((report) => (
              <CaseRow key={report.id} report={report} onDetails={(item) => setOpenId(item.id)} />
            ))}
          </ul>
        )}
      </section>

      <CaseDetailModal report={openReport} onClose={() => setOpenId(null)}>
        {openReport && (
          <div className="flex flex-col gap-4">
            <TeamAssignment report={openReport} actor={user} organizationId={user.id} />
            <CaseActions report={openReport} actor={user} />
          </div>
        )}
      </CaseDetailModal>
    </div>
  )
}
