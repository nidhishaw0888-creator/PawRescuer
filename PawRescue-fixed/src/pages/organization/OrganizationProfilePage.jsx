import { PageHeader } from '../../components/layout/PageHeader'
import { VerificationPanel } from '../../components/verification/VerificationPanel'
import { AccountSummary } from '../../components/account/AccountSummary'
import { useAuth } from '../../hooks/useContextHooks'
import { ROLE_LABELS } from '../../utils/constants'
import { formatDateTime } from '../../utils/format'

export function OrganizationProfilePage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Organization profile" title={user.name} subtitle="Your organization details and verification status." />
      <div className="grid gap-6 lg:grid-cols-2">
        <AccountSummary
          fields={[
            { label: 'Role', value: ROLE_LABELS[user.role] },
            { label: 'Contact email', value: user.email },
            { label: 'Phone', value: user.phone },
            { label: 'Joined', value: formatDateTime(user.joinedAt) },
            { label: 'Address', value: user.address },
            { label: 'Service area', value: user.serviceArea },
            { label: 'About', value: user.orgDescription, wide: true },
            { label: 'Skills', value: user.skills?.join(', '), wide: true },
            { label: 'Supported animals', value: user.supportedAnimals?.join(', '), wide: true },
          ]}
        />
        <VerificationPanel account={user} />
      </div>
    </div>
  )
}
