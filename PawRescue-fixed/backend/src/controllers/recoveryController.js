import mongoose from 'mongoose'
import { RecoveryRecord } from '../models/RecoveryRecord.js'
import { Report } from '../models/Report.js'
import { ApiError } from '../utils/ApiError.js'

function toFrontend(record) {
  const r = record.toJSON()
  return {
    id: r._id.toString(),
    rescueCaseId: r.rescueCaseId?.toString(),
    reportId: r.reportId?.toString(),
    clinicOrShelter: r.clinicOrShelter,
    recoveryStatus: r.recoveryStatus,
    notes: r.notes,
    transferDetails: r.transferDetails,
    outcome: r.outcome,
    photos: r.photos || [],
    updatedBy: r.updatedBy?.toString(),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }
}

async function checkAccess(req, reportId) {
  const report = await Report.findById(reportId)
  if (!report) throw new ApiError(404, 'Case not found.')
  const isReporter = report.reporterId.toString() === req.user._id.toString()
  const isAssigned = report.assignedTo?.id === req.user._id.toString()
  const isPrivileged = req.user.role === 'admin' || req.user.role === 'organization'
  return { report, isReporter, isAssigned, isPrivileged }
}

export async function getRecovery(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.rescueCaseId)) return next(new ApiError(404, 'Recovery record not found.'))
  const records = await RecoveryRecord.find({ rescueCaseId: req.params.rescueCaseId }).sort({ createdAt: -1 })
  if (!records.length) return res.json({ recovery: null })

  const { isPrivileged } = await checkAccess(req, records[0].reportId)
  const result = records.map((record) => {
    const frontend = toFrontend(record)
    if (!isPrivileged) {
      delete frontend.privateNotes
    }
    return frontend
  })
  res.json({ recovery: result[0], history: result })
}

export async function createRecovery(req, res, next) {
  const { rescueCaseId } = req.params
  if (!mongoose.isValidObjectId(rescueCaseId)) return next(new ApiError(404, 'Case not found.'))

  const { reportId, clinicOrShelter, recoveryStatus, notes, transferDetails, outcome, photos, privateNotes } = req.body

  const { isAssigned, isPrivileged } = await checkAccess(req, reportId)
  if (!isAssigned && !isPrivileged) return next(new ApiError(403, 'You do not have permission to update this recovery record.'))

  const record = await RecoveryRecord.create({
    rescueCaseId,
    reportId,
    clinicOrShelter: clinicOrShelter || '',
    recoveryStatus: recoveryStatus || 'In Care',
    notes: notes || '',
    transferDetails: transferDetails || '',
    outcome: outcome || '',
    photos: photos || [],
    privateNotes: isPrivileged ? privateNotes || '' : '',
    updatedBy: req.user._id,
  })

  res.status(201).json({ recovery: toFrontend(record) })
}

export async function updateRecovery(req, res, next) {
  const { rescueCaseId } = req.params
  if (!mongoose.isValidObjectId(rescueCaseId)) return next(new ApiError(404, 'Case not found.'))
  const record = await RecoveryRecord.findOne({ rescueCaseId })
  if (!record) return next(new ApiError(404, 'Recovery record not found.'))

  const { isAssigned, isPrivileged } = await checkAccess(req, record.reportId)
  if (!isAssigned && !isPrivileged) return next(new ApiError(403, 'You do not have permission to update this recovery record.'))

  const allowed = ['clinicOrShelter', 'recoveryStatus', 'notes', 'transferDetails', 'outcome', 'photos']
  for (const key of allowed) {
    if (req.body[key] !== undefined) record[key] = req.body[key]
  }
  if (isPrivileged && req.body.privateNotes !== undefined) {
    record.privateNotes = req.body.privateNotes
  }
  record.updatedBy = req.user._id
  await record.save()

  res.json({ recovery: toFrontend(record) })
}
