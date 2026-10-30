import { useState } from 'react'
import { ShieldCheck, ShieldX, FileText, ImageIcon } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Modal } from '../../components/common/Modal'
import { Input } from '../../components/common/FormControls'
import { LoadingState, ErrorState } from '../../components/common/States'
import { EmptyState } from '../../components/common/EmptyState'
import { VerificationBadge } from '../../components/verification/VerificationPanel'
import { useToast } from '../../hooks/useContextHooks'
import { useAsyncData } from '../../hooks/useAsyncData'
import * as userService from '../../services/userService'
import { ROLE_LABELS } from '../../utils/constants'

export function AdminVerificationsPage() {
  const { showToast } = useToast()
  const { data, loading, error, reload } = useAsyncData(() => userService.getUsers(), [])
  const [reviewing, setReviewing] = useState(null)
  const [decision, setDecision] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  const queue = data.filter((u) => u.verificationStatus === 'Pending')

  const openReview = (user) => {
    setReviewing(user)
    setDecision('')
    setReason('')
  }

  const handleSubmit = async () => {
    if (!reviewing) return
    if (decision === 'Rejected' && !reason.trim()) {
      showToast('A reason is required to reject a verification.', 'error')
      return
    }
    setBusy(true)
    try {
      await userService.updateVerificationStatus(reviewing.id, decision, decision === 'Rejected' ? reason : null)
      showToast(`${reviewing.name} marked as ${decision}`, 'success')
      setReviewing(null)
      await reload()
    } catch (actionError) {
      showToast(actionError.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <LoadingState label="Loading verifications" />
  if (error) return <ErrorState message="Verifications could not be loaded." onRetry={reload} />

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin - verifications"
        title="Verification queue"
        subtitle="Review volunteer and organization submissions before approving them."
      />

      {queue.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Queue is empty" description="No verification submissions are waiting for review." />
      ) : (
        <ul className="flex flex-col gap-3">
          {queue.map((u) => (
            <li key={u.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{u.name}</p>
                    <Badge tone="neutral">{ROLE_LABELS[u.role]}</Badge>
                    <VerificationBadge status={u.verificationStatus} />
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{u.email}</p>
                  {u.orgDescription && <p className="mt-1 text-sm text-ink-700">{u.orgDescription}</p>}
                </div>
                <Button variant="primary" size="sm" onClick={() => openReview(u)}>Review</Button>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!reviewing} onClose={() => setReviewing(null)} title={`Review ${reviewing?.name ?? ''}`} size="lg"
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button variant="ghost" onClick={() => setReviewing(null)}>Cancel</Button>
            <Button variant="coral" disabled={!decision} isLoading={busy} onClick={handleSubmit}>
              {decision === 'Rejected' ? 'Confirm rejection' : 'Approve verification'}
            </Button>
          </div>
        }
      >
        {reviewing && (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-ink-500">Role</p>
                <p className="font-semibold">{ROLE_LABELS[reviewing.role]}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-ink-500">Email</p>
                <p className="font-semibold">{reviewing.email}</p>
              </div>
              {reviewing.serviceArea && (
                <div>
                  <p className="text-xs font-semibold uppercase text-ink-500">Service area</p>
                  <p className="font-semibold">{reviewing.serviceArea}</p>
                </div>
              )}
              {reviewing.skills && (
                <div>
                  <p className="text-xs font-semibold uppercase text-ink-500">Skills</p>
                  <p className="font-semibold">{reviewing.skills.join(', ')}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold">Submitted documents</p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {(reviewing.documents || []).map((doc) => {
                  const Icon = doc.type === 'image' ? ImageIcon : FileText
                  return (
                    <li key={doc.id} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-cream-50 px-3 py-2 text-sm">
                      <Icon className="size-5 shrink-0 text-teal-600" />
                      <span className="truncate font-semibold">{doc.name}</span>
                    </li>
                  )
                })}
                {!reviewing.documents?.length && <li className="text-sm text-ink-500">No documents uploaded.</li>}
              </ul>
            </div>

            <div className="flex flex-col gap-3 rounded-xl bg-cream-50 p-4">
              <p className="font-bold">Decision</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="subtle" size="sm" onClick={() => setDecision('Verified')}>
                  <ShieldCheck className="size-4" /> Approve
                </Button>
                <Button variant="coral" size="sm" onClick={() => setDecision('Rejected')}>
                  <ShieldX className="size-4" /> Reject
                </Button>
              </div>
              {decision === 'Rejected' && (
                <Input
                  label="Reason for rejection"
                  placeholder="Explain what needs to be corrected"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              )}
              {decision && (
                <p className="text-sm text-ink-500">
                  {decision === 'Verified'
                    ? 'This account will be able to accept cases immediately.'
                    : 'A reason is required. The submitter will be notified.'}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
