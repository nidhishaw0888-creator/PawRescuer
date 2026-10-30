import { Link } from 'react-router-dom'
import { Building2, ClipboardList, HeartPulse, ShieldQuestion, Users } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { StatCard } from '../../components/common/StatCard'
import { LoadingState, ErrorState } from '../../components/common/States'
import { useAuth, useRescues } from '../../hooks/useContextHooks'
import { useAsyncData } from '../../hooks/useAsyncData'
import * as userService from '../../services/userService'
import { ACTIVE_STATUSES } from '../../utils/constants'

export function OrganizationDashboard() {
  const { user } = useAuth()
  const { reports, loading, error, refresh } = useRescues()
  const team = useAsyncData(() => userService.getTeamMembers(user.id), [user.id])

  if (loading || team.loading) return <LoadingState label="Loading organization overview" />
  if (error) return <ErrorState message="Cases could not be loaded." onRetry={refresh} />

  const isVerified = user.verificationStatus === 'Verified'
  const incoming = reports.filter((report) => report.status === 'Reported' && !report.assignedTo).length
  const ours = reports.filter(
    (report) => (report.assignedTo?.id === user.id || report.assignedTo?.organizationId === user.id) && ACTIVE_STATUSES.includes(report.status),
  ).length
  const capacity = user.capacity ?? { max: 0, current: 0 }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Organization overview"
        title={user.name}
        subtitle="Watch incoming requests, track the cases your team is handling, and keep your roster current."
        actions={<Button as={Link} to="/dashboard/organization/queue" variant="coral">Open incoming queue</Button>}
      />

      {!isVerified && (
        <Card className="flex items-start gap-3 border-amber-100 bg-amber-50">
          <ShieldQuestion className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <div>
            <p className="font-bold text-amber-700">Verification needed before you can accept cases</p>
            <p className="mt-1 text-sm text-ink-700">Your organization is {user.verificationStatus || 'not yet verified'}. Upload your registration on your profile page.</p>
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Incoming requests" value={incoming} icon={ClipboardList} tone="coral" />
        <StatCard label="Cases in progress" value={ours} icon={HeartPulse} tone="teal" />
        <StatCard label="Team members" value={team.data?.length ?? 0} icon={Users} tone="forest" />
        <StatCard label="Intake capacity" value={`${capacity.current} / ${capacity.max}`} icon={Building2} tone="amber" />
      </div>
    </div>
  )
}
