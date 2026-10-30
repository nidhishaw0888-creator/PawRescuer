import { Link } from 'react-router-dom'
import { ClipboardList, HeartPulse, Siren, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatCard } from '../../components/common/StatCard'
import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { ReportCard } from '../../components/reports/ReportCard'
import { LoadingState, ErrorState } from '../../components/common/States'
import { useAuth, useRescues } from '../../hooks/useContextHooks'

export function CitizenDashboard() {
  const { user } = useAuth()
  const { reports, loading, error, refresh } = useRescues()

  if (loading) return <LoadingState label="Loading your dashboard" />
  if (error) return <ErrorState message="Your reports could not be loaded." onRetry={refresh} />

  const mine = reports.filter((report) => report.reporterId === user.id)
  const active = mine.filter((report) => report.status !== 'Resolved').length
  const resolved = mine.filter((report) => report.status === 'Resolved').length
  const recent = mine.slice(0, 3)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Citizen dashboard"
        title={`Hello, ${user.name.split(' ')[0]}`}
        subtitle="Track the animals you reported and see how their rescues are progressing."
        actions={<Button as={Link} to="/report-emergency" variant="coral"><Siren className="size-4" /> Report an emergency</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Reports filed" value={mine.length} icon={ClipboardList} tone="forest" />
        <StatCard label="Still in progress" value={active} icon={HeartPulse} tone="teal" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} tone="neutral" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Recent reports</h2>
          {mine.length > 3 && <Button as={Link} to="/dashboard/citizen/reports" variant="ghost" size="sm">View all</Button>}
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={Siren}
            title="No reports yet"
            description="When you see an animal in need, file a report and it will appear here."
            action={<Button as={Link} to="/report-emergency">File your first report</Button>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
