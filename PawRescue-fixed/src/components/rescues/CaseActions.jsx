import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { Button } from '../common/Button'
import { useRescues, useToast } from '../../hooks/useContextHooks'
import { STATUS_TRANSITIONS, ACCEPTED_IMAGE_TYPES } from '../../utils/constants'
import * as reportService from '../../services/reportService'

export function CaseActions({ report, actor }) {
  const { advanceCase, addCaseEvidence } = useRescues()
  const { showToast } = useToast()
  const [busy, setBusy] = useState(false)
  const nextStatuses = STATUS_TRANSITIONS[report.status] || []

  const runAction = async (task, successMessage) => {
    setBusy(true)
    try {
      await task()
      showToast(successMessage, 'success')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const handleEvidence = async (event) => {
    const files = Array.from(event.target.files || []).filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type))
    event.target.value = ''
    if (!files.length) {
      showToast('Choose a JPG, PNG, or WebP image for evidence.', 'error')
      return
    }
    setBusy(true)
    try {
      const urls = await reportService.uploadPhotos(files)
      await addCaseEvidence(report.id, urls, actor.name)
      showToast(`${urls.length} evidence photo(s) added`, 'success')
    } catch (error) {
      showToast(error.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl bg-cream-50 p-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Update status</p>
        {nextStatuses.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {nextStatuses.map((status) => (
              <Button key={status} size="sm" variant="subtle" isLoading={busy} onClick={() => runAction(() => advanceCase(report.id, status, actor.name), `Status updated to ${status}`)}>
                Mark as {status}
              </Button>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-sm text-ink-500">This case is complete.</p>
        )}
      </div>
      <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-sm font-semibold text-ink-700 hover:bg-stone-50">
        <ImagePlus className="size-4" /> Upload evidence
        <input type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} multiple className="sr-only" onChange={handleEvidence} />
      </label>
    </div>
  )
}
