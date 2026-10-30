import { useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/FormControls'
import { Select } from '../../components/common/FormControls'
import { PriorityBadge, StatusBadge } from '../../components/common/StatusBadge'
import { LoadingState, ErrorState } from '../../components/common/States'
import { Pagination } from '../../components/common/Pagination'
import { CaseDetailModal } from '../../components/rescues/CaseDetailModal'
import { TeamAssignment } from '../../components/rescues/TeamAssignment'
import { useRescues } from '../../hooks/useContextHooks'
import { ANIMAL_TYPES, EMERGENCY_TYPES, SEVERITY_LEVELS, RESCUE_STATUSES } from '../../utils/constants'
import { formatRelativeTime } from '../../utils/format'

const PAGE_SIZE = 8

export function AdminReportsPage() {
  const { reports, loading, error, refresh } = useRescues()
  const [query, setQuery] = useState('')
  const [animal, setAnimal] = useState('')
  const [emergency, setEmergency] = useState('')
  const [severity, setSeverity] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [openReport, setOpenReport] = useState(null)

  if (loading) return <LoadingState label="Loading reports" />
  if (error) return <ErrorState message="Reports could not be loaded." onRetry={refresh} />

  const filtered = reports.filter((r) => {
    const matchesQuery = !query || r.caseRef.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase())
    const matchesAnimal = !animal || r.animalType === animal
    const matchesEmergency = !emergency || r.emergencyType === emergency
    const matchesSeverity = !severity || r.severity === severity
    const matchesStatus = !status || r.status === status
    return matchesQuery && matchesAnimal && matchesEmergency && matchesSeverity && matchesStatus
  })

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin - reports"
        title="All rescue reports"
        subtitle="Search, filter, and reassign any report on the platform."
      />

      <Card className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Input label="Search" placeholder="Case ref or description" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select label="Animal" value={animal} onChange={(e) => setAnimal(e.target.value)}>
            <option value="">All</option>
            {ANIMAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select label="Emergency" value={emergency} onChange={(e) => setEmergency(e.target.value)}>
            <option value="">All</option>
            {EMERGENCY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select label="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">All</option>
            {SEVERITY_LEVELS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-56">
            <option value="">All statuses</option>
            {RESCUE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setAnimal(''); setEmergency(''); setSeverity(''); setStatus(''); setPage(1) }}>
            Clear filters
          </Button>
        </div>
      </Card>

      {pageItems.length === 0 ? (
        <Card className="py-10 text-center text-sm text-ink-500">No reports match these filters.</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-3 py-2">Case</th>
                <th className="px-3 py-2">Animal</th>
                <th className="px-3 py-2">Priority</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Assigned</th>
                <th className="px-3 py-2">Reported</th>
                <th className="px-3 py-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pageItems.map((r) => (
                <tr key={r.id} className="hover:bg-cream-50">
                  <td className="px-3 py-2.5 font-semibold text-teal-700">{r.caseRef}</td>
                  <td className="px-3 py-2.5">{r.animalType}</td>
                  <td className="px-3 py-2.5"><PriorityBadge severity={r.severity} /></td>
                  <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-2.5 text-ink-700">{r.assignedTo?.name ?? 'Unassigned'}</td>
                  <td className="px-3 py-2.5 text-ink-500">{formatRelativeTime(r.createdAt)}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button type="button" onClick={() => setOpenReport(r)} className="rounded-lg px-2.5 py-1 text-sm font-semibold text-teal-700 hover:bg-teal-50">
                      View & assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Pagination page={page} pageCount={pageCount} onChange={setPage} />

      <CaseDetailModal report={openReport} onClose={() => setOpenReport(null)}>
        {openReport && (
          <TeamAssignment report={openReport} organizationId={openReport.assignedTo?.organizationId} />
        )}
      </CaseDetailModal>
    </div>
  )
}
