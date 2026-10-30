import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShieldQuestion } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState, ErrorState } from '../../components/common/States'
import { CaseRow } from '../../components/rescues/CaseRow'
import { CaseDetailModal } from '../../components/rescues/CaseDetailModal'
import { useAuth, useRescues, useToast } from '../../hooks/useContextHooks'

export function VolunteerDashboard() {
  const { user } = useAuth()
  const { reports, loading, error, refresh, acceptCase, declineCase } = useRescues()
  const { showToast } = useToast()
  const [busyId, setBusyId] = useState(null)
  const [openReport, setOpenReport] = useState(null)

  if (loading) return <LoadingState label="Loading available cases" />
  if (error) return <ErrorState message="Cases could not be loaded." onRetry={refresh} />

  const isVerified = user.verificationStatus === 'Verified'
  const available = reports.filter(
    (report) => report.status === 'Reported' && !report.assignedTo && !report.declinedBy.includes(user.id),
  )

  const runAction = async (reportId, task, successMessage) => {
    setBusyId(reportId)
    try {
      await task()
      showToast(successMessage, 'success')
    } catch (actionError) {
      showToast(actionError.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Volunteer dashboard"
        title="Available cases"
        subtitle="Cases waiting for a responder. Accept the ones you can reach and have the skills for."
        actions={<Button as={Link} to="/dashboard/volunteer/active" variant="secondary">My active rescues</Button>}
      />

      {!isVerified && (
        <Card className="flex items-start gap-3 border-amber-100 bg-amber-50">
          <ShieldQuestion className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <div>
            <p className="font-bold text-amber-700">Verification needed before you can accept cases</p>
            <p className="mt-1 text-sm text-ink-700">Your account is {user.verificationStatus || 'not yet verified'}. Review your documents on your profile page.</p>
          </div>
        </Card>
      )}

      {available.length === 0 ? (
        <EmptyState icon={Heart} title="No cases waiting" description="New reports nearby will appear here as they come in." />
      ) : (
        <ul className="flex flex-col gap-3">
          {available.map((report) => (
            <CaseRow key={report.id} report={report} onDetails={setOpenReport} showDistance>
              <Button
                size="sm"
                variant="primary"
                disabled={!isVerified || busyId === report.id}
                isLoading={busyId === report.id}
                onClick={() => runAction(report.id, () => acceptCase(report.id, user), `You accepted ${report.caseRef}`)}
              >
                Accept case
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={busyId === report.id}
                onClick={() => runAction(report.id, () => declineCase(report.id, user.id), `${report.caseRef} hidden from your queue`)}
              >
                Not for me
              </Button>
            </CaseRow>
          ))}
        </ul>
      )}

      <CaseDetailModal report={openReport} onClose={() => setOpenReport(null)} />
    </div>
  )
}
