import { useState } from 'react'
import { UserCheck } from 'lucide-react'
import { Button } from '../common/Button'
import { useRescues, useToast } from '../../hooks/useContextHooks'
import { useAsyncData } from '../../hooks/useAsyncData'
import * as userService from '../../services/userService'

export function TeamAssignment({ report, actor, organizationId }) {
  const { reassignCase } = useRescues()
  const { showToast } = useToast()
  const [memberId, setMemberId] = useState('')
  const [busy, setBusy] = useState(false)
  const team = useAsyncData(
    () => (organizationId ? userService.getTeamMembers(organizationId) : Promise.resolve([])),
    [organizationId],
  )
  const choices = (team.data ?? []).filter((member) => member.isOnline)

  const handleAssign = async () => {
    const member = choices.find((entry) => entry.id === memberId)
    if (!member) return
    setBusy(true)
    try {
      await reassignCase(
        report.id,
        { id: member.id, name: member.name, type: 'team member' },
        actor.name,
      )
      showToast(`Assigned to ${member.name}`, 'success')
      setMemberId('')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-teal-50 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-teal-700">
        <UserCheck className="size-4" /> Assign a team member
      </p>
      {choices.length === 0 ? (
        <p className="text-sm text-ink-500">No team members are available. Add members on the team page.</p>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
            aria-label="Team member"
            className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline focus:outline-2 focus:outline-teal-500"
          >
            <option value="">Choose a team member</option>
            {choices.map((member) => (
              <option key={member.id} value={member.id}>{member.name} - {member.role}</option>
            ))}
          </select>
          <Button size="sm" disabled={!memberId} isLoading={busy} onClick={handleAssign}>Assign</Button>
        </div>
      )}
    </div>
  )
}
