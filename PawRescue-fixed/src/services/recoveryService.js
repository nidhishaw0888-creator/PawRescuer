import { api } from './api'

export async function getRecovery(rescueCaseId) {
  const data = await api.get(`/recovery/${rescueCaseId}`)
  return data.recovery
}

export async function createRecovery(rescueCaseId, payload) {
  const data = await api.post(`/recovery/${rescueCaseId}`, payload)
  return data.recovery
}

export async function updateRecovery(rescueCaseId, payload) {
  const data = await api.patch(`/recovery/${rescueCaseId}`, payload)
  return data.recovery
}
