export function formatDateTime(iso) {
  if (!iso) return 'Not available'
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatRelativeTime(iso) {
  if (!iso) return 'Not available'
  const diffMinutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  const hours = Math.round(diffMinutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function formatDistance(km) {
  if (km == null) return 'Distance unavailable'
  return km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`
}

export function formatCoordinates(lat, lng) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}
