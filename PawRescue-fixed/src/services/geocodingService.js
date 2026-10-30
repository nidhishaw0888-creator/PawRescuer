import { api } from './api'

export async function searchPlaces(query) {
  if (!query.trim()) return []
  try {
    const data = await api.get('/reports', { params: { limit: 20 } })
    return (data.reports || [])
      .filter((report) => {
        const label = report.locationLabel || report.landmark || ''
        return label.toLowerCase().includes(query.toLowerCase())
      })
      .map((report) => ({
        id: report.id,
        label: report.locationLabel || report.landmark,
        lat: report.location?.lat,
        lng: report.location?.lng,
      }))
  } catch {
    return []
  }
}
