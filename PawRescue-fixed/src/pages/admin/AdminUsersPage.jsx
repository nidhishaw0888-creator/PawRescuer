import { useState } from 'react'
import { Ban, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { LoadingState, ErrorState, ConfirmDialog } from '../../components/common/States'
import { useToast } from '../../hooks/useContextHooks'
import { useAsyncData } from '../../hooks/useAsyncData'
import * as userService from '../../services/userService'
import { ROLE_LABELS } from '../../utils/constants'
import { VerificationBadge } from '../../components/verification/VerificationPanel'
import { formatRelativeTime } from '../../utils/format'

export function AdminUsersPage() {
  const { showToast } = useToast()
  const { data, loading, error, reload } = useAsyncData(() => userService.getUsers(), [])
  const [busyId, setBusyId] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const handleSuspend = async (userId, suspended) => {
    setBusyId(userId)
    try {
      await userService.setUserSuspended(userId, suspended)
      showToast(suspended ? 'Account suspended' : 'Account reinstated', 'success')
      await reload()
    } catch (actionError) {
      showToast(actionError.message, 'error')
    } finally {
      setBusyId(null)
      setConfirm(null)
    }
  }

  if (loading) return <LoadingState label="Loading users" />
  if (error) return <ErrorState message="Users could not be loaded." onRetry={reload} />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin - users"
        title="User accounts"
        subtitle="All registered accounts on the platform. Suspend or reinstate access."
      />

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Verification</th>
              <th className="px-3 py-2">Joined</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((u) => (
              <tr key={u.id} className="hover:bg-cream-50">
                <td className="px-3 py-2.5">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-ink-500">{u.email}</p>
                </td>
                <td className="px-3 py-2.5"><Badge tone="neutral">{ROLE_LABELS[u.role]}</Badge></td>
                <td className="px-3 py-2.5"><VerificationBadge status={u.verificationStatus} /></td>
                <td className="px-3 py-2.5 text-ink-500">{formatRelativeTime(u.joinedAt)}</td>
                <td className="px-3 py-2.5">
                  {u.suspended ? <Badge tone="coral">Suspended</Badge> : <Badge tone="teal">Active</Badge>}
                </td>
                <td className="px-3 py-2.5 text-right">
                  {u.role === 'admin' ? (
                    <span className="text-xs text-ink-500">Admin account</span>
                  ) : (
                    <Button
                      size="sm"
                      variant={u.suspended ? 'subtle' : 'ghost'}
                      isLoading={busyId === u.id}
                      onClick={() => setConfirm({ user: u, suspend: !u.suspended })}
                    >
                      {u.suspended ? <><CheckCircle2 className="size-4" /> Reinstate</> : <><Ban className="size-4" /> Suspend</>}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => handleSuspend(confirm.user.id, confirm.suspend)}
        title={confirm?.suspend ? 'Suspend account' : 'Reinstate account'}
        message={confirm?.suspend
          ? `${confirm.user.name} will lose access immediately.`
          : `${confirm.user.name} will regain access.`}
        confirmLabel={confirm?.suspend ? 'Suspend' : 'Reinstate'}
        loading={busyId === confirm?.user?.id}
        tone={confirm?.suspend ? 'coral' : 'forest'}
      />
    </div>
  )
}
