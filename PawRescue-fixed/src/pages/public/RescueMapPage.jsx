import { useMemo, useState } from 'react'
import { Filter, Info, MapPin, Navigation, Search, X } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge'
import { RescueMap, SEVERITY_COLORS } from '../../components/maps/RescueMap'
import { useRescues } from '../../hooks/useContextHooks'
import { ANIMAL_TYPES, EMERGENCY_TYPES, RESCUE_STATUSES, SEVERITY_LEVELS, DEFAULT_MAP_CENTER } from '../../utils/constants'
import { formatRelativeTime, formatDistance } from '../../utils/format'
import { haversineKm, directionsUrl } from '../../utils/geo'
import { searchPlaces } from '../../services/geocodingService'
import { clsx } from '../../components/common/clsx'

const STATUS_FILTERS = ['All', ...RESCUE_STATUSES]
const DISTANCE_FILTERS = ['Any', '5 km', '10 km', '25 km']

export function RescueMapPage() {
  const { reports, loading } = useRescues()
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [placeResults, setPlaceResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [filters, setFilters] = useState({
    animalType: 'All',
    emergencyType: 'All',
    severity: 'All',
    status: 'All',
    distance: 'Any',
  })
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return reports.filter((report) => {
      if (filters.animalType !== 'All' && report.animalType !== filters.animalType) return false
      if (filters.emergencyType !== 'All' && report.emergencyType !== filters.emergencyType) return false
      if (filters.severity !== 'All' && report.severity !== filters.severity) return false
      if (filters.status !== 'All' && report.status !== filters.status) return false
      if (filters.distance !== 'Any') {
        const km = haversineKm(DEFAULT_MAP_CENTER, report.location)
        const max = Number(filters.distance.split(' ')[0])
        if (km > max) return false
      }
      return true
    })
  }, [reports, filters])

  const selected = reports.find((report) => report.id === selectedId)

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!query.trim()) {
      setPlaceResults([])
      setShowResults(false)
      return
    }
    const results = await searchPlaces(query)
    setPlaceResults(results)
    setShowResults(true)
  }

  const activeFilterCount = Object.values(filters).filter((value) => value !== 'All' && value !== 'Any').length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <PageHeader
        eyebrow="Rescue map"
        title="Active emergencies nearby"
        subtitle="An interactive map of reported cases. Markers are colored by priority. Click a marker to open its details."
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by address or landmark"
              className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:outline focus:outline-2 focus:outline-teal-500"
              aria-label="Search by address or landmark"
            />
          </div>
          {showResults && placeResults.length > 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-stone-200 bg-white p-2 shadow-card-hover">
              {placeResults.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(place.id)
                    setShowResults(false)
                    setQuery(place.label)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-stone-100"
                >
                  <MapPin className="size-4 text-teal-600" /> {place.label}
                </button>
              ))}
            </div>
          )}
          {showResults && placeResults.length === 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-stone-200 bg-white p-3 text-sm text-ink-500 shadow-card-hover">
              No places matched. Try a label from a report, such as “Oak Street”.
            </div>
          )}
        </form>
        <Button variant={showFilters ? 'primary' : 'secondary'} onClick={() => setShowFilters((open) => !open)} className="sm:self-start">
          <Filter className="size-4" /> Filters {activeFilterCount > 0 && <Badge tone="coral" className="ml-1">{activeFilterCount}</Badge>}
        </Button>
      </div>

      {showFilters && (
        <Card className="mt-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect label="Animal type" value={filters.animalType} onChange={(value) => setFilters({ ...filters, animalType: value })} options={['All', ...ANIMAL_TYPES]} />
            <FilterSelect label="Emergency" value={filters.emergencyType} onChange={(value) => setFilters({ ...filters, emergencyType: value })} options={['All', ...EMERGENCY_TYPES]} />
            <FilterSelect label="Priority" value={filters.severity} onChange={(value) => setFilters({ ...filters, severity: value })} options={['All', ...SEVERITY_LEVELS]} />
            <FilterSelect label="Status" value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} options={STATUS_FILTERS} />
            <FilterSelect label="Distance" value={filters.distance} onChange={(value) => setFilters({ ...filters, distance: value })} options={DISTANCE_FILTERS} />
          </div>
          <div className="mt-3 flex justify-end">
            <button type="button" onClick={() => setFilters({ animalType: 'All', emergencyType: 'All', severity: 'All', status: 'All', distance: 'Any' })} className="text-sm font-semibold text-teal-600 hover:underline">
              Reset filters
            </button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-forest-50 px-4 py-2 text-sm font-semibold text-forest-700">
            <Info className="size-4" /> Showing {filtered.length} reports. Distances are measured from Andhra Pradesh, India.
          </div>
          <RescueMap reports={filtered} selectedId={selectedId} onSelect={setSelectedId} className="w-full" />
          <div className="flex flex-wrap gap-3 text-xs text-ink-500">
            {SEVERITY_LEVELS.map((level) => (
              <span key={level} className="flex items-center gap-1.5">
                <span className="size-3 rounded-full" style={{ background: SEVERITY_COLORS[level] }} /> {level}
              </span>
            ))}
          </div>
        </div>

        <Card className="flex flex-col gap-3 p-0">
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            <h2 className="font-bold">Case details</h2>
            {selected && (
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-lg p-1 text-ink-500 hover:bg-stone-100" aria-label="Close details">
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {!selected ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center">
                <MapPin className="size-8 text-stone-300" />
                <p className="text-sm font-semibold text-ink-700">Select a marker</p>
                <p className="text-xs text-ink-500">Click a pin on the map or a card below to view a case.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <ImageWithFallback src={selected.photos[0]} alt={selected.animalType} className="h-40 w-full rounded-xl" />
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="forest">{selected.animalType}</Badge>
                  <Badge tone="neutral">{selected.emergencyType}</Badge>
                  <PriorityBadge severity={selected.severity} />
                  <StatusBadge status={selected.status} />
                </div>
                <p className="text-sm text-ink-700">{selected.description}</p>
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {selected.locationLabel}</span>
                  <span>{formatRelativeTime(selected.createdAt)}</span>
                </div>
                <p className="text-xs text-ink-500">{formatDistance(haversineKm(DEFAULT_MAP_CENTER, selected.location))}</p>
                <div className="flex gap-2">
                  <Button as="a" href={directionsUrl(selected.location.lat, selected.location.lng)} target="_blank" rel="noreferrer" variant="secondary" size="sm">
                    <Navigation className="size-4" /> Directions
                  </Button>
                  <Button as="a" href={`/rescues/${selected.id}`} variant="ghost" size="sm">
                    Full case
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold">All filtered cases</h2>
        {loading ? (
          <p className="mt-3 text-sm text-ink-500">Loading reports...</p>
        ) : filtered.length === 0 ? (
          <Card className="mt-3 text-center text-sm text-ink-500">No cases match the current filters.</Card>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedId(report.id)}
                className={clsx('flex flex-col gap-2 rounded-2xl border bg-white p-4 text-left transition-shadow hover:shadow-card', selectedId === report.id ? 'border-forest-500' : 'border-stone-200')}
              >
                <div className="flex items-center justify-between">
                  <Badge tone="forest">{report.animalType}</Badge>
                  <PriorityBadge severity={report.severity} />
                </div>
                <p className="line-clamp-2 text-sm text-ink-700">{report.description}</p>
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> {report.locationLabel}</span>
                  <span>{formatRelativeTime(report.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-semibold text-ink-700">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:outline focus:outline-2 focus:outline-teal-500">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
