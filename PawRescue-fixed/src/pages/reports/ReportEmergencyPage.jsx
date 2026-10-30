import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, ImagePlus, Info, LocateFixed, MapPin, ShieldAlert, Trash2 } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Input, Select, Textarea } from '../../components/common/FormControls'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { LocationPickerMap } from '../../components/maps/RescueMap'
import { useAuth, useRescues, useToast } from '../../hooks/useContextHooks'
import { validateImageFile, validateReportDetails, validateReportLocation } from '../../utils/validation'
import { ANIMAL_TYPES, EMERGENCY_TYPES, SEVERITY_LEVELS, ACCEPTED_IMAGE_TYPES, MAX_PHOTOS, INDIA_STATES } from '../../utils/constants'
import { formatCoordinates, formatDateTime } from '../../utils/format'
import { clsx } from '../../components/common/clsx'
import * as reportService from '../../services/reportService'

const STEPS = ['Animal details', 'Photographs', 'Location', 'Review & submit']

const EMPTY_LOCATION = { lat: null, lng: null, landmark: '', state: 'Andhra Pradesh', city: '', pinCode: '' }

const SEVERITY_HINTS = {
  Critical: 'Life-threatening or severe injury. Act fast.',
  High: 'Serious but not immediately life-threatening.',
  Normal: 'Needs help but the animal is stable.',
}

export function ReportEmergencyPage() {
  const { user } = useAuth()
  const { createReport } = useRescues()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [details, setDetails] = useState({
    animalType: '',
    emergencyType: '',
    description: '',
    symptoms: '',
    severity: '',
    observedAt: '',
  })
  const [photos, setPhotos] = useState([]) // {id, file, url}
  const [location, setLocation] = useState(EMPTY_LOCATION)
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const fileInputRef = useRef(null)

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList)
    const nextErrors = {}
    const accepted = []
    incoming.forEach((file) => {
      const message = validateImageFile(file, photos.length + accepted.length)
      if (message) nextErrors[file.name] = message
      else accepted.push({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, url: URL.createObjectURL(file) })
    })
    setErrors((current) => ({ ...current, photos: nextErrors }))
    if (accepted.length) setPhotos((current) => [...current, ...accepted].slice(0, MAX_PHOTOS))
  }

  const removePhoto = (id) => {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id)
      if (removed) URL.revokeObjectURL(removed.url)
      return current.filter((photo) => photo.id !== id)
    })
  }

  const requestGps = () => {
    setGpsStatus('loading')
    if (!('geolocation' in navigator)) {
      setGpsStatus('unavailable')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation((current) => ({ ...current, lat: position.coords.latitude, lng: position.coords.longitude }))
        setGpsStatus('success')
      },
      () => setGpsStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const canProceed = useMemo(() => {
    if (step === 0) return Object.keys(validateReportDetails(details)).length === 0
    if (step === 1) return true
    if (step === 2) return Object.keys(validateReportLocation(location)).length === 0
    return true
  }, [step, details, location])

  const next = () => {
    if (step === 0) {
      const nextErrors = validateReportDetails(details)
      setErrors((current) => ({ ...current, details: nextErrors }))
      if (Object.keys(nextErrors).length) return
    }
    if (step === 2) {
      const nextErrors = validateReportLocation(location)
      setErrors((current) => ({ ...current, location: nextErrors }))
      if (Object.keys(nextErrors).length) return
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1))
  }

  const back = () => setStep((current) => Math.max(current - 1, 0))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      let photoUrls = []
      if (photos.length > 0) {
        try {
          photoUrls = await reportService.uploadPhotos(photos.map((p) => p.file))
        } catch (uploadError) {
          showToast(`Photo upload failed: ${uploadError.message}. Submitting without photos.`, 'error')
          photoUrls = []
        }
      }
      const report = await createReport(
        {
          ...details,
          lat: location.lat,
          lng: location.lng,
          landmark: location.landmark,
          state: location.state,
          city: location.city,
          pinCode: location.pinCode,
          photos: photoUrls,
        },
        user,
      )
      photos.forEach((photo) => URL.revokeObjectURL(photo.url))
      setSubmitted(report)
      showToast(`Case ${report.caseRef} submitted`, 'success')
    } catch (error) {
      setErrors((current) => ({ ...current, form: error.message }))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Card className="flex flex-col items-center gap-3 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-forest-50 text-forest-700"><Check className="size-7" /></span>
          <h1 className="text-2xl font-extrabold">Report submitted</h1>
          <p className="text-sm text-ink-500">Your report has been received. A nearby verified responder will be notified.</p>
          <div className="rounded-xl bg-cream-200 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Case reference</p>
            <p className="text-lg font-extrabold text-forest-700">{submitted.caseRef}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => navigate(`/rescues/${submitted.id}`)}>View case</Button>
            <Button variant="secondary" onClick={() => { setSubmitted(null); setStep(0); setDetails({ animalType: '', emergencyType: '', description: '', symptoms: '', severity: '', observedAt: '' }); setPhotos([]); setLocation(EMPTY_LOCATION); setGpsStatus('idle'); }}>
              File another report
            </Button>
            <Button variant="ghost" onClick={() => navigate('/map')}>Open rescue map</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader eyebrow="Report an emergency" title="Report an animal in need" subtitle="A guided four-step report. Your report will be sent to nearby verified responders." />

      <ol className="mt-6 flex items-center gap-2" aria-label="Report progress">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span className={clsx('grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold', index < step ? 'bg-forest-600 text-cream-50' : index === step ? 'bg-teal-500 text-cream-50' : 'bg-stone-200 text-ink-500')}>
              {index < step ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className={clsx('hidden text-xs font-semibold sm:inline', index <= step ? 'text-ink-900' : 'text-ink-500')}>{label}</span>
            {index < STEPS.length - 1 && <span className={clsx('h-px flex-1', index < step ? 'bg-forest-500' : 'bg-stone-200')} />}
          </li>
        ))}
      </ol>

      <Card className="mt-6">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Animal details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Animal type" name="animalType" value={details.animalType} onChange={(e) => setDetails({ ...details, animalType: e.target.value })} error={errors.details?.animalType} required>
                <option value="">Choose an animal type</option>
                {ANIMAL_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </Select>
              <Select label="Emergency type" name="emergencyType" value={details.emergencyType} onChange={(e) => setDetails({ ...details, emergencyType: e.target.value })} error={errors.details?.emergencyType} required>
                <option value="">Choose an emergency type</option>
                {EMERGENCY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </Select>
            </div>
            <Textarea label="Description" name="description" rows={3} value={details.description} onChange={(e) => setDetails({ ...details, description: e.target.value })} error={errors.details?.description} hint="Describe what you see in at least 20 characters." required />
            <Input label="Observed symptoms" name="symptoms" value={details.symptoms} onChange={(e) => setDetails({ ...details, symptoms: e.target.value })} hint="Optional, e.g. limping, bleeding, trapped" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Severity <span className="text-coral-600">*</span></p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {SEVERITY_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDetails({ ...details, severity: level })}
                    className={clsx('flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors', details.severity === level ? 'border-forest-500 bg-forest-50' : 'border-stone-200 hover:bg-stone-50')}
                    aria-pressed={details.severity === level}
                  >
                    <span className="font-bold">{level}</span>
                    <span className="text-xs text-ink-500">{SEVERITY_HINTS[level]}</span>
                  </button>
                ))}
              </div>
              {errors.details?.severity && <p className="mt-1 text-xs font-medium text-coral-700">{errors.details.severity}</p>}
            </div>
            <Input label="Date and time observed" name="observedAt" type="datetime-local" value={details.observedAt} onChange={(e) => setDetails({ ...details, observedAt: e.target.value })} error={errors.details?.observedAt} required />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Photographs</h2>
            <p className="text-sm text-ink-500">Add up to {MAX_PHOTOS} photos (JPG, PNG, or WebP, max 5 MB each). Photos help responders prepare.</p>
            <div
              className="rounded-xl border-2 border-dashed border-stone-300 bg-cream-50 px-4 py-8 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
            >
              <ImagePlus className="mx-auto size-8 text-ink-500" />
              <p className="mt-2 text-sm font-semibold">Drag photos here or</p>
              <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>Browse files</Button>
              <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_TYPES.join(',')} multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
            </div>
            {Object.keys(errors.photos || {}).length > 0 && (
              <ul className="rounded-xl bg-coral-50 px-4 py-3 text-xs font-semibold text-coral-700">
                {Object.entries(errors.photos).map(([name, message]) => <li key={name}>{name}: {message}</li>)}
              </ul>
            )}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <ImageWithFallback src={photo.url} alt="Selected preview" className="h-28 w-full rounded-lg" />
                    <button type="button" onClick={() => removePhoto(photo.id)} className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-ink-900/70 text-cream-50 hover:bg-ink-900" aria-label="Remove photo">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-ink-500">{photos.length} of {MAX_PHOTOS} photos selected</p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Location</h2>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={requestGps} isLoading={gpsStatus === 'loading'}>
                <LocateFixed className="size-4" /> Use my location
              </Button>
              {location.lat != null && (
                <Badge tone="teal"><MapPin className="size-3" /> {formatCoordinates(location.lat, location.lng)}</Badge>
              )}
            </div>
            {gpsStatus === 'denied' && (
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                <p>Location permission was denied. You can still drop a pin on the map or enter coordinates manually below.</p>
              </div>
            )}
            {gpsStatus === 'unavailable' && (
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                <p>GPS is not available in this browser. Drop a pin on the map or enter coordinates manually.</p>
              </div>
            )}
            <LocationPickerMap position={location.lat != null ? location : null} onPick={(coords) => setLocation((current) => ({ ...current, ...coords }))} className="w-full" />
            <p className="text-xs text-ink-500">Click anywhere on the map to place or adjust the pin.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Latitude" name="lat" type="number" step="any" value={location.lat ?? ''} onChange={(e) => setLocation({ ...location, lat: e.target.value === '' ? null : Number(e.target.value) })} hint="Manual entry if GPS is unavailable" />
              <Input label="Longitude" name="lng" type="number" step="any" value={location.lng ?? ''} onChange={(e) => setLocation({ ...location, lng: e.target.value === '' ? null : Number(e.target.value) })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="State" name="state" value={location.state} onChange={(e) => setLocation({ ...location, state: e.target.value })} error={errors.location?.state} required>
                <option value="">Select a state</option>
                {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Input label="City" name="city" value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} error={errors.location?.city} hint="City or town" required />
            </div>
            <Input label="PIN code" name="pinCode" inputMode="numeric" maxLength={6} value={location.pinCode} onChange={(e) => setLocation({ ...location, pinCode: e.target.value.replace(/\D/g, '') })} error={errors.location?.pinCode} hint="6-digit Indian PIN code" required />
            <Input label="Landmark or address" name="landmark" value={location.landmark} onChange={(e) => setLocation({ ...location, landmark: e.target.value })} error={errors.location?.landmark} hint="A nearby street, building, or landmark" required />
            {errors.location?.location && <p className="text-xs font-medium text-coral-700">{errors.location.location}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Review and submit</h2>
            <div className="rounded-xl bg-cream-200 px-4 py-2 text-sm text-ink-700">
              <Info className="mr-1 inline size-4 text-teal-600" /> Privacy: your contact details will only be shared with the verified responder assigned to this case.
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <ReviewRow label="Animal type" value={details.animalType} />
              <ReviewRow label="Emergency type" value={details.emergencyType} />
              <ReviewRow label="Severity" value={details.severity} />
              <ReviewRow label="Observed at" value={details.observedAt ? formatDateTime(details.observedAt) : '—'} />
              <ReviewRow label="State" value={location.state} />
              <ReviewRow label="City" value={location.city} />
              <ReviewRow label="PIN code" value={location.pinCode} />
              <ReviewRow label="Landmark" value={location.landmark} />
            </div>
            <ReviewRow label="Description" value={details.description} />
            <ReviewRow label="Symptoms" value={details.symptoms || '—'} />
            <ReviewRow label="Coordinates" value={location.lat != null ? formatCoordinates(location.lat, location.lng) : '—'} />
            {photos.length > 0 && (
              <div>
                <p className="text-sm font-semibold">Photos ({photos.length})</p>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {photos.map((photo) => <ImageWithFallback key={photo.id} src={photo.url} alt="Preview" className="h-20 w-full rounded-lg" />)}
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 rounded-xl bg-forest-50 px-4 py-3 text-sm text-forest-700">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              <p>Keep a safe distance. Do not approach frightened or wild animals. Verified responders will take over once the case is accepted.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep(0)}>Edit details</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)}>Edit photos</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep(2)}>Edit location</Button>
            </div>
            {errors.form && <div className="rounded-xl border border-coral-100 bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-700">{errors.form}</div>}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-stone-200 pt-4">
          <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>
            <ChevronLeft className="size-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next} disabled={!canProceed}>
              Next <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button type="button" variant="coral" onClick={handleSubmit} isLoading={submitting}>
              <Check className="size-4" /> Submit report
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl bg-cream-50 px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</span>
      <span className="text-sm font-semibold text-ink-900">{value || '—'}</span>
    </div>
  )
}
