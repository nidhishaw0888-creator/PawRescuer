import { api } from './api'

export async function getUsers() {
  const data = await api.get('/admin/users')
  return data.users
}

export async function getUserById(userId) {
  const data = await api.get(`/users/${userId}`)
  return data.user
}

export async function updateVerificationStatus(userId, status, reason = null) {
  const data = await api.patch(`/admin/verifications/${userId}`, { status, reason })
  return data.user
}

export async function setUserSuspended(userId, suspended) {
  const data = await api.patch(`/admin/users/${userId}`, { suspended })
  return data.user
}

export async function getAbuseReports() {
  const data = await api.get('/admin/abuse-reports')
  return data.reports
}

export async function resolveAbuseReport(reportId, status) {
  const data = await api.patch(`/admin/abuse-reports/${reportId}`, { status })
  return data.report
}

export async function getTeamMembers(orgId) {
  const data = await api.get(`/users/organizations/${orgId}/team`)
  return data.members
}

export async function addTeamMember(orgId, member) {
  const data = await api.post('/organization/team', member)
  return data.member
}

export async function removeTeamMember(orgId, memberId) {
  await api.delete(`/organization/team/${memberId}`)
  return true
}

export async function updateOnlineStatus(userId, isOnline) {
  const data = await api.patch('/users/me/availability', { isOnline })
  return data.user
}

export async function getAnalytics() {
  const data = await api.get('/admin/analytics')
  return data.analytics
}

export async function getAllReports(page = 1, filters = {}) {
  const data = await api.get('/admin/reports', { params: { page, ...filters } })
  return data
}

export async function reassignRescue(reportId, assignee) {
  const data = await api.post(`/admin/rescues/${reportId}/reassign`, {
    assigneeId: assignee.id,
    assigneeName: assignee.name,
    assigneeType: assignee.type,
  })
  return data.report
}
