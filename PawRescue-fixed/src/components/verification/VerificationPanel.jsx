import { ShieldCheck, ShieldX, ShieldQuestion, FileText, ImageIcon } from 'lucide-react'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'

const VERIFICATION_STYLES = {
  Verified: { tone: 'teal', icon: ShieldCheck, label: 'Verified' },
  Pending: { tone: 'amber', icon: ShieldQuestion, label: 'Pending review' },
  Rejected: { tone: 'coral', icon: ShieldX, label: 'Rejected' },
}

// Never shows an unverified account as verified: unknown or missing statuses render as Pending.
export function VerificationBadge({ status }) {
  const style = VERIFICATION_STYLES[status] || VERIFICATION_STYLES.Pending
  const Icon = style.icon
  return (
    <Badge tone={style.tone}>
      <Icon className="size-3.5" /> {style.label}
    </Badge>
  )
}

export function VerificationPanel({ account }) {
  const documents = account.documents || []
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Verification status</h2>
        <VerificationBadge status={account.verificationStatus || 'Pending'} />
      </div>
      {account.verificationStatus === 'Rejected' && (
        <div className="rounded-xl bg-coral-50 px-4 py-3 text-sm text-coral-700">
          <p className="font-bold">Verification was rejected</p>
          <p className="mt-1">Reason: {account.rejectionReason}</p>
        </div>
      )}
      {account.verificationStatus !== 'Verified' && (
        <p className="text-sm text-ink-500">Until verification is approved, you will not receive cases or appear as a verified responder.</p>
      )}
      <div>
        <p className="text-sm font-semibold">Submitted documents</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {documents.map((doc) => {
            const Icon = doc.type === 'image' ? ImageIcon : FileText
            return (
              <li key={doc.id} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-cream-50 px-3 py-2 text-sm">
                <Icon className="size-5 shrink-0 text-teal-600" />
                <span className="truncate font-semibold">{doc.name}</span>
              </li>
            )
          })}
          {documents.length === 0 && <li className="text-sm text-ink-500">No documents uploaded.</li>}
        </ul>
      </div>
    </Card>
  )
}
