import { api } from './api'

export async function acceptReport(reportId, _volunteer) {
  const data = await api.post(`/rescues/${reportId}/accept`)
  return data.report
}

export async function declineReport(reportId, _userId) {
  await api.post(`/rescues/${reportId}/decline`)
  return true
}

export async function updateRescueStatus(reportId, nextStatus, _actorName) {
  const data = await api.patch(`/rescues/${reportId}/status`, { status: nextStatus })
  return data.report
}

export async function addEvidence(reportId, photoUrls, _actorName) {
  const data = await api.post(`/rescues/${reportId}/evidence`, { photos: photoUrls })
  return data.report
}

export async function reassignReport(reportId, assignee, _actorName) {
  const data = await api.post(`/rescues/${reportId}/reassign`, {
    assigneeId: assignee.id,
    assigneeName: assignee.name,
    assigneeType: assignee.type,
  })
  return data.report
}

export async function getAvailableCases() {
  const data = await api.get('/rescues/available')
  return data.reports
}

export async function getMyRescues() {
  const data = await api.get('/rescues/mine')
  return data.reports
}

export async function getRescue(reportId) {
  return api.get(`/rescues/${reportId}`)
}

export async function getTimeline(reportId) {
  const data = await api.get(`/rescues/${reportId}/timeline`)
  return data.timeline
}
