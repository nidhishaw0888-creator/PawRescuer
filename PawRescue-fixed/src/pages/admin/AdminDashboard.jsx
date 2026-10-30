import { ClipboardList, Users, ShieldCheck, Activity, TrendingUp, PieChart as PieIcon } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { StatCard } from '../../components/common/StatCard'
import { Badge } from '../../components/common/Badge'
import { LoadingState, ErrorState } from '../../components/common/States'
import { useAsyncData } from '../../hooks/useAsyncData'
import * as userService from '../../services/userService'
import { formatRelativeTime } from '../../utils/format'

const PIE_COLORS = ['#205C43', '#2D8C78', '#F16B5B', '#6BBF8A', '#B85C42', '#8C7B6A']

export function AdminDashboard() {
  const { data: analytics, loading, error, reload } = useAsyncData(() => userService.getAnalytics(), [])

  if (loading) return <LoadingState label="Loading admin overview" />
  if (error) return <ErrorState message="Analytics could not be loaded." onRetry={reload} />

  const a = analytics || {}

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Admin overview"
        title="Platform operations"
        subtitle="Live analytics and queues for the PawRescue platform."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open reports" value={a.openReports ?? 0} icon={ClipboardList} tone="coral" />
        <StatCard label="Pending verifications" value={a.unassigned ?? 0} icon={ShieldCheck} tone="amber" />
        <StatCard label="Verified volunteers" value={a.verifiedVolunteers ?? 0} icon={Users} tone="forest" />
        <StatCard label="Total reports" value={a.totalReports ?? 0} icon={Activity} tone="teal" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-teal-600" />
            <h2 className="text-lg font-bold">Monthly trends</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={a.monthlyTrends || []}>
              <XAxis dataKey="month" stroke="#8C7B6A" fontSize={12} />
              <YAxis stroke="#8C7B6A" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reports" stroke="#F16B5B" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#2D8C78" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <PieIcon className="size-5 text-teal-600" />
            <h2 className="text-lg font-bold">Emergency categories</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={a.categoryDistribution || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {(a.categoryDistribution || []).map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-teal-600" />
          <h2 className="text-lg font-bold">Status distribution</h2>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={a.statusDistribution || []}>
            <XAxis dataKey="name" stroke="#8C7B6A" fontSize={11} angle={-20} textAnchor="end" height={60} />
            <YAxis stroke="#8C7B6A" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill="#2D8C78" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Recent activity</h2>
        <ul className="flex flex-col divide-y divide-stone-200">
          {(a.activityFeed || []).length === 0 ? (
            <li className="py-3 text-sm text-ink-500">No recent activity.</li>
          ) : (
            a.activityFeed.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="text-sm text-ink-700">{item.text}</span>
                <Badge tone="neutral">{formatRelativeTime(item.at)}</Badge>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  )
}
