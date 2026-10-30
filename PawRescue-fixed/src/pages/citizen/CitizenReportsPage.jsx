import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Siren } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState, ErrorState } from '../../components/common/States'
import { CaseRow } from '../../components/rescues/CaseRow'
import { CaseDetailModal } from '../../components/rescues/CaseDetailModal'
import { useAuth, useRescues } from '../../hooks/useContextHooks'

export function CitizenReportsPage() {
  const { user } = useAuth()
  const { reports, loading, error, refresh } = useRescues()
  const [openReport, setOpenReport] = useState(null)

  if (loading) return <LoadingState label="Loading your reports" />
  if (error) return <ErrorState message="Your reports could not be loaded." onRetry={refresh} />

  const mine = reports.filter((report) => report.reporterId === user.id)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="My reports"
        title="Cases you have filed"
        subtitle="Open a case to see its timeline and any recovery updates."
        actions={<Button as={Link} to="/report-emergency" variant="coral"><Siren className="size-4" /> New report</Button>}
      />

      {mine.length === 0 ? (
        <EmptyState icon={Siren} title="You have not filed any reports" description="Reports you submit will be listed here." />
      ) : (
        <ul className="flex flex-col gap-3">
          {mine.map((report) => (
            <CaseRow key={report.id} report={report} onDetails={setOpenReport}>
              {report.recovery && (
                <Button as={Link} to={`/recovery/${report.id}`} variant="ghost" size="sm">Recovery</Button>
              )}
            </CaseRow>
          ))}
        </ul>
      )}

      <CaseDetailModal report={openReport} onClose={() => setOpenReport(null)} />
    </div>
  )
}
