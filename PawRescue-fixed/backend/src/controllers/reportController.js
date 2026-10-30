import { body, validationResult } from 'express-validator'
import mongoose from 'mongoose'
import { Report } from '../models/Report.js'
import { RescueCase } from '../models/RescueCase.js'
import { ApiError } from '../utils/ApiError.js'
import { suggestPriority } from '../services/priorityService.js'
import { pushNotification } from '../services/notificationService.js'
import { supabase, SUPABASE_BUCKET } from '../config/supabase.js'
import { randomUUID } from 'node:crypto'
export function toFrontend(report) {
  if (!report) return null
  const r = report.toJSON()
  return {
    id: r._id.toString(),
    caseRef: r.caseRef,
    reporterId: r.reporterId?.toString(),
    animalType: r.animalType,
    emergencyType: r.emergencyType,
    description: r.description,
    symptoms: r.symptoms || '',
    severity: r.severity,
    status: r.status,
    observedAt: r.observedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    location: { lat: r.location.coordinates[1], lng: r.location.coordinates[0] },
    locationLabel: r.landmark || '',
    landmark: r.landmark || '',
    state: r.state || '',
    city: r.city || '',
    pinCode: r.pinCode || '',
    photos: r.photos || [],
    evidence: r.evidence || [],
    assignedTo: r.assignedTo || null,
    declinedBy: (r.declinedBy || []).map(String),
    timeline: r.timeline || [],
    recovery: r.recovery || null,
  }
}

async function generateCaseRef() {
  const count = await Report.countDocuments()
  return `PR-${1000 + count + 1}`
}

export async function getReports(req, res, next) {
  const { animalType, emergencyType, severity, status, lat, lng, radiusKm, page = 1, limit = 50 } = req.query
  const filter = {}
  if (animalType) filter.animalType = animalType
  if (emergencyType) filter.emergencyType = emergencyType
  if (severity) filter.severity = severity
  if (status) filter.status = status

  if (lat && lng) {
    const radius = parseFloat(radiusKm) || 25
    filter.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: radius * 1000,
      },
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit)
  const reports = await Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
  res.json({ reports: reports.map(toFrontend) })
}

export async function getReportById(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Report not found.'))
  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Report not found.'))
  res.json({ report: toFrontend(report) })
}

export async function getNearbyReports(req, res) {
  const { lat, lng, radiusKm = 25 } = req.query
  if (!lat || !lng) return res.json({ reports: [] })
  const reports = await Report.find({
    status: 'Reported',
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseFloat(radiusKm) * 1000,
      },
    },
  }).sort({ createdAt: -1 })
  res.json({ reports: reports.map(toFrontend) })
}

export async function getMyReports(req, res) {
  const reports = await Report.find({ reporterId: req.user._id }).sort({ createdAt: -1 })
  res.json({ reports: reports.map(toFrontend) })
}

export const createReportValidation = [
  body('animalType').isIn(['Stray dog', 'Stray cat', 'Bird', 'Cattle', 'Injured wildlife', 'Other']),
  body('emergencyType').isIn(['Injured', 'Abandoned', 'Trapped', 'Abused', 'Endangered', 'Other']),
  body('description').isLength({ min: 20 }).withMessage('Description must be at least 20 characters.'),
  body('severity').isIn(['Critical', 'High', 'Normal']),
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required.'),
  body('lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required.'),
  body('landmark').trim().notEmpty().withMessage('A landmark or address is required.'),
  body('state').trim().notEmpty().withMessage('State is required.'),
  body('city').trim().notEmpty().withMessage('City or locality is required.'),
  body('pinCode').matches(/^[1-9]\d{5}$/).withMessage('Enter a valid 6-digit PIN code.'),
]

export async function createReport(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return next(new ApiError(400, errors.array().map((e) => e.msg).join(' ')))

  const { animalType, emergencyType, description, symptoms, severity, lat, lng, landmark, state, city, pinCode, observedAt, photos } = req.body

  const { priority, priorityReason } = suggestPriority(severity, emergencyType)
  const caseRef = await generateCaseRef()

  const report = await Report.create({
    caseRef,
    reporterId: req.user._id,
    animalType,
    emergencyType,
    description: description.trim(),
    symptoms: symptoms || '',
    severity,
    priority,
    priorityReason,
    status: 'Reported',
    location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
    landmark: landmark.trim(),
    state: state.trim(),
    city: city.trim(),
    pinCode,
    observedAt: observedAt ? new Date(observedAt) : new Date(),
    photos: photos || [],
  })

  await RescueCase.create({
    reportId: report._id,
    status: 'Reported',
  })

  pushNotification(req.io, req.user._id, {
    category: 'report',
    title: `Report ${report.caseRef} logged`,
    body: 'Your report has been received. Nearby responders will be notified.',
    reportId: report._id,
  })

  res.status(201).json({ report: toFrontend(report) })
}


export async function uploadReportPhotos(req, res, next) {
  if (!req.files?.length) {
    return next(new ApiError(400, 'Attach at least one photo.'))
  }

  if (!supabase) {
    return next(
      new ApiError(503, 'Image storage is not configured. Please contact support.')
    )
  }

  try {
    const extensionByMime = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }

    const urls = await Promise.all(
      req.files.map(async (file) => {
        const extension = extensionByMime[file.mimetype]

        if (!extension) {
          throw new Error('Only JPG, PNG and WebP images are supported.')
        }

        const filePath =
          `${req.user._id}/${randomUUID()}.${extension}`

        const { error } = await supabase.storage
          .from(SUPABASE_BUCKET)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          })

        if (error) {
          console.error('[Supabase upload]', error.message)
          throw new Error('Unable to upload image to storage.')
        }

        const { data } = supabase.storage
          .from(SUPABASE_BUCKET)
          .getPublicUrl(filePath)

        return data.publicUrl
      })
    )

    res.status(201).json({ urls })
  } catch (error) {
    console.error('[uploadReportPhotos]', error.message)
    next(new ApiError(500, error.message || 'Image upload failed.'))
  }
}

export async function deleteReport(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Report not found.'))
  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Report not found.'))
  if (report.reporterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ApiError(403, 'You can only delete your own reports.'))
  }
  if (report.status !== 'Reported') {
    return next(new ApiError(409, 'This report has an active rescue assignment and cannot be deleted.'))
  }
  await Report.findByIdAndDelete(req.params.id)
  await RescueCase.deleteOne({ reportId: req.params.id })
  res.json({ message: 'Report deleted.' })
}
