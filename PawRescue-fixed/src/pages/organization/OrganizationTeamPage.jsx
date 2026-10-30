import { useState } from 'react'
import { UserPlus, Trash2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Input, Select } from '../../components/common/FormControls'
import { Modal } from '../../components/common/Modal'
import { ConfirmDialog, LoadingState, ErrorState } from '../../components/common/States'
import { Badge } from '../../components/common/Badge'
import { EmptyState } from '../../components/common/EmptyState'
import { useAuth, useToast } from '../../hooks/useContextHooks'
import { useAsyncData } from '../../hooks/useAsyncData'
import * as userService from '../../services/userService'

const MEMBER_ROLES = ['Shelter lead', 'Transport driver', 'Veterinary liaison', 'Wildlife handler', 'Foster coordinator', 'Volunteer']
const EMPTY_FORM = { name: '', role: MEMBER_ROLES[0] }

export function OrganizationTeamPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const team = useAsyncData(() => userService.getTeamMembers(user.id), [user.id])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [removing, setRemoving] = useState(false)

  if (team.loading) return <LoadingState label="Loading team" />
  if (team.error) return <ErrorState message="The team could not be loaded." onRetry={team.reload} />

  const closeAdd = () => {
    setAdding(false)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const handleAdd = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setFormError('Enter the team member\u2019s name.')
      return
    }
    setSaving(true)
    try {
      await userService.addTeamMember(user.id, { name: form.name.trim(), role: form.role })
      showToast(`${form.name.trim()} added to the team`, 'success')
      closeAdd()
      team.reload()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await userService.removeTeamMember(user.id, memberToRemove.id)
      showToast(`${memberToRemove.name} removed from the team`, 'success')
      setMemberToRemove(null)
      team.reload()
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Team"
        title="Your rescue team"
        subtitle="Members you can assign cases to from the incoming queue."
        actions={<Button onClick={() => setAdding(true)}><UserPlus className="size-4" /> Add member</Button>}
      />

      {team.data.length === 0 ? (
        <EmptyState icon={UserPlus} title="No team members yet" description="Add the people who handle transport, care, and field work." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {team.data.map((member) => (
            <Card as="li" key={member.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold">{member.name}</p>
                <p className="text-sm text-ink-500">{member.role}</p>
                <div className="mt-2">
                  <Badge tone={member.isOnline ? 'teal' : 'neutral'}>{member.isOnline ? 'Available' : 'Unavailable'}</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMemberToRemove(member)} aria-label={`Remove ${member.name}`}>
                <Trash2 className="size-4 text-coral-700" /> Remove
              </Button>
            </Card>
          ))}
        </ul>
      )}

      <Modal
        open={adding}
        onClose={closeAdd}
        title="Add team member"
        footer={
          <>
            <Button variant="ghost" onClick={closeAdd}>Cancel</Button>
            <Button type="submit" form="add-member-form" isLoading={saving}>Add member</Button>
          </>
        }
      >
        <form id="add-member-form" onSubmit={handleAdd} className="flex flex-col gap-4" noValidate>
          <Input label="Full name" name="memberName" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} error={formError} required />
          <Select label="Role" name="memberRole" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            {MEMBER_ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
          </Select>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemove}
        loading={removing}
        title="Remove team member?"
        message={memberToRemove ? `${memberToRemove.name} will no longer be available for case assignments.` : ''}
        confirmLabel="Remove"
      />
    </div>
  )
}
