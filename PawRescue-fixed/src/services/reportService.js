import { api } from './api'

export async function getReports() {
  const data = await api.get('/reports')
  return data.reports
}

export async function getReportById(reportId) {
  const data = await api.get(`/reports/${reportId}`)
  return data.report
}

export async function createReport(input, _reporter) {
  const payload = {
    animalType: input.animalType,
    emergencyType: input.emergencyType,
    description: input.description,
    symptoms: input.symptoms,
    severity: input.severity,
    lat: input.lat,
    lng: input.lng,
    landmark: input.landmark,
    state: input.state,
    city: input.city,
    pinCode: input.pinCode,
    observedAt: input.observedAt,
    photos: input.photos,
  }
  const data = await api.post('/reports', payload)
  return data.report
}

export async function getReportsForReporter(_userId) {
  const data = await api.get('/reports/mine')
  return data.reports
}

export async function deleteReport(reportId) {
  await api.delete(`/reports/${reportId}`)
  return true
}

export async function getNearbyReports(lat, lng, radiusKm = 25) {
  const data = await api.get('/reports/nearby', { params: { lat, lng, radiusKm } })
  return data.reports
}

export async function uploadPhotos(files) {
  const formData = new FormData()
  files.forEach((file) => formData.append('photos', file))
  const data = await api.post('/reports/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.urls
}
