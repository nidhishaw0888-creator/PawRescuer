import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatCoordinates } from '../../utils/format'
import { INDIA_MAP_VIEW } from '../../utils/constants'

// Pins are styled by severity so critical cases stand out at a glance.
const SEVERITY_COLORS = {
  Critical: '#F16B5B',
  High: '#F59E0B',
  Normal: '#2D8C78',
}

function buildIcon(color) {
  return L.divIcon({
    className: '',
    html: `<span style="background:${color};box-shadow:0 0 0 4px ${color}33,0 2px 6px rgba(0,0,0,0.25);border:2px solid white;width:18px;height:18px;border-radius:9999px;display:block"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

const ICONS = {
  Critical: buildIcon(SEVERITY_COLORS.Critical),
  High: buildIcon(SEVERITY_COLORS.High),
  Normal: buildIcon(SEVERITY_COLORS.Normal),
  selected: buildIcon('#205C43'),
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const resize = () => map.invalidateSize()
    const timer = setTimeout(resize, 120)
    window.addEventListener('resize', resize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', resize)
    }
  }, [map])
  return null
}

function ClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick?.({ lat: event.latlng.lat, lng: event.latlng.lng })
    },
  })
  return null
}

export function RescueMap({ reports, selectedId, onSelect, className }) {
  return (
    <div className={className} style={{ height: 420 }}>
      <MapContainer center={[INDIA_MAP_VIEW.center.lat, INDIA_MAP_VIEW.center.lng]} zoom={INDIA_MAP_VIEW.zoom} scrollWheelZoom className="h-full w-full rounded-2xl">
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports
          .filter((report) => report.location && Number.isFinite(report.location.lat) && Number.isFinite(report.location.lng))
          .map((report) => (
            <Marker
              key={report.id}
              position={[report.location.lat, report.location.lng]}
              icon={report.id === selectedId ? ICONS.selected : ICONS[report.severity] || ICONS.Normal}
              eventHandlers={{ click: () => onSelect?.(report.id) }}
            >
              <Popup>
                <div className="max-w-[220px]">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-600">{report.animalType} - {report.emergencyType}</p>
                  <p className="mt-1 text-sm font-semibold">{report.description.slice(0, 80)}{report.description.length > 80 ? '...' : ''}</p>
                  <p className="mt-1 text-xs text-stone-500">{formatCoordinates(report.location.lat, report.location.lng)}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}

export function LocationPickerMap({ position, onPick, className }) {
  return (
    <div className={className} style={{ height: 360 }}>
      <MapContainer
        center={position ? [position.lat, position.lng] : [INDIA_MAP_VIEW.center.lat, INDIA_MAP_VIEW.center.lng]}
        zoom={position ? 14 : INDIA_MAP_VIEW.zoom}
        scrollWheelZoom
        className="h-full w-full rounded-2xl"
      >
        <MapResizer />
        <ClickHandler onPick={onPick} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && <Marker position={[position.lat, position.lng]} icon={ICONS.selected} />}
      </MapContainer>
    </div>
  )
}

export { SEVERITY_COLORS }
