import mongoose from 'mongoose'
import { Report } from '../models/Report.js'
import { RescueCase } from '../models/RescueCase.js'
import { StatusUpdate } from '../models/StatusUpdate.js'
import { ApiError } from '../utils/ApiError.js'
import { pushNotification } from '../services/notificationService.js'
import { toFrontend } from './reportController.js'

const STATUS_TRANSITIONS = {
  Reported: ['Accepted'],
  Accepted: ['En Route'],
  'En Route': ['On Scene'],
  'On Scene': ['Rescued'],
  Rescued: ['In Care'],
  'In Care': ['Resolved'],
  Resolved: [],
}

export async function getAvailableCases(req, res) {
  const verifiedOnly = req.user.role === 'volunteer' && req.user.verificationStatus !== 'Verified'
  if (verifiedOnly) return res.json({ reports: [] })
  const declined = req.user._id
  const reports = await Report.find({
    status: 'Reported',
    declinedBy: { $ne: declined },
  }).sort({ severity: 1, createdAt: -1 })
  res.json({ reports: reports.map(toFrontend) })
}

export async function acceptCase(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Case not found.'))
  if (req.user.role === 'volunteer' && req.user.verificationStatus !== 'Verified') {
    return next(new ApiError(403, 'Only verified volunteers can accept cases.'))
  }

  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Case not found.'))

  const result = await Report.findOneAndUpdate(
    { _id: req.params.id, status: 'Reported' },
    {
      $set: {
        status: 'Accepted',
        assignedTo: {
          id: req.user._id,
          name: req.user.name,
          type: req.user.role,
          organizationId: req.user.role === 'organization' ? req.user._id : undefined,
        },
        acceptedAt: new Date(),
      },
      $push: { timeline: { status: 'Accepted', at: new Date(), note: `Accepted by ${req.user.name}` } },
    },
    { new: true },
  )

  if (!result) return next(new ApiError(409, 'This case has already been accepted by another responder.'))

  const rescueCase = await RescueCase.findOneAndUpdate(
    { reportId: req.params.id },
    {
      $set: {
        status: 'Accepted',
        assignedVolunteerId: req.user.role === 'volunteer' ? req.user._id : undefined,
        organizationId: req.user.role === 'organization' ? req.user._id : undefined,
        acceptedAt: new Date(),
      },
    },
    { new: true },
  )

  await StatusUpdate.create({
    rescueCaseId: rescueCase._id,
    reportId: req.params.id,
    updatedBy: req.user._id,
    previousStatus: 'Reported',
    newStatus: 'Accepted',
    note: `Accepted by ${req.user.name}`,
  })

  pushNotification(req.io, report.reporterId, {
    category: 'rescue',
    title: `${report.caseRef} accepted`,
    body: `${req.user.name} accepted your case. They are on their way.`,
    reportId: report._id,
    rescueCaseId: rescueCase._id,
  })

  res.json({ report: toFrontend(result) })
}

export async function declineCase(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Case not found.'))
  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Case not found.'))
  await Report.findByIdAndUpdate(req.params.id, { $addToSet: { declinedBy: req.user._id } })
  res.json({ message: 'Case removed from your queue.' })
}

export async function getMyRescues(req, res) {
  const filter = req.user.role === 'volunteer'
    ? { 'assignedTo.id': req.user._id.toString() }
    : { 'assignedTo.organizationId': req.user._id.toString() }
  const reports = await Report.find({ ...filter, status: { $in: ['Accepted', 'En Route', 'On Scene', 'Rescued', 'In Care'] } }).sort({ updatedAt: -1 })
  res.json({ reports: reports.map(toFrontend) })
}

export async function getRescueById(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Case not found.'))
  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Case not found.'))
  const rescueCase = await RescueCase.findOne({ reportId: report._id })
  res.json({ report: toFrontend(report), rescueCaseId: rescueCase?._id.toString() ?? null })
}

export async function updateStatus(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Case not found.'))
  const { status } = req.body
  if (!status) return next(new ApiError(400, 'New status is required.'))

  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Case not found.'))

  if (!report.assignedTo || report.assignedTo.id !== req.user._id.toString()) {
    if (req.user.role !== 'admin') return next(new ApiError(403, 'Only the assigned responder can update status.'))
  }

  if (!STATUS_TRANSITIONS[report.status]?.includes(status)) {
    return next(new ApiError(400, `A case cannot move from ${report.status} to ${status}.`))
  }

  const previousStatus = report.status
  report.status = status
  report.timeline.push({ status, at: new Date(), note: req.body.note || `Status updated to ${status} by ${req.user.name}` })
  if (status === 'Resolved') {
    report.completedAt = new Date()
  }
  await report.save()

  const rescueCase = await RescueCase.findOne({ reportId: report._id })
  if (rescueCase) {
    rescueCase.status = status
    if (status === 'Resolved') rescueCase.completedAt = new Date()
    await rescueCase.save()
  }

  await StatusUpdate.create({
    rescueCaseId: rescueCase?._id,
    reportId: report._id,
    updatedBy: req.user._id,
    previousStatus,
    newStatus: status,
    note: req.body.note || `Status updated to ${status} by ${req.user.name}`,
    evidencePhotos: req.body.evidencePhotos || [],
  })

  pushNotification(req.io, report.reporterId, {
    category: 'rescue',
    title: `${report.caseRef} is now ${status}`,
    body: `Status changed by ${req.user.name}.`,
    reportId: report._id,
    rescueCaseId: rescueCase?._id,
  })

  res.json({ report: toFrontend(report) })
}

export async function addEvidence(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Case not found.'))
  const { photos } = req.body
  if (!photos?.length) return next(new ApiError(400, 'At least one evidence photo is required.'))
  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Case not found.'))
  report.evidence.push(...photos)
  await report.save()

  await StatusUpdate.create({
    rescueCaseId: (await RescueCase.findOne({ reportId: report._id }))?._id,
    reportId: report._id,
    updatedBy: req.user._id,
    previousStatus: report.status,
    newStatus: report.status,
    note: `${photos.length} evidence photo(s) added by ${req.user.name}`,
    evidencePhotos: photos,
  })

  res.json({ report: toFrontend(report) })
}

export async function reassignCase(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Case not found.'))
  if (req.user.role !== 'admin' && req.user.role !== 'organization') {
    return next(new ApiError(403, 'Only administrators and organizations can reassign cases.'))
  }
  const { assigneeId, assigneeName, assigneeType } = req.body
  if (!assigneeId || !assigneeName) return next(new ApiError(400, 'Assignee is required.'))
  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Case not found.'))
  const organizationId = req.user.role === 'organization' ? req.user._id.toString() : report.assignedTo?.organizationId
  report.assignedTo = { id: assigneeId, name: assigneeName, type: assigneeType || 'volunteer', organizationId }
  await report.save()

  const rescueCase = await RescueCase.findOne({ reportId: report._id })
  if (rescueCase) {
    rescueCase.assignedVolunteerId = assigneeId
    await rescueCase.save()
  }

  pushNotification(req.io, assigneeId, {
    category: 'rescue',
    title: `Case ${report.caseRef} assigned to you`,
    body: `Assigned by ${req.user.name}.`,
    reportId: report._id,
    rescueCaseId: rescueCase?._id,
  })

  res.json({ report: toFrontend(report) })
}

export async function getTimeline(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Case not found.'))
  const updates = await StatusUpdate.find({ reportId: req.params.id }).sort({ createdAt: 1 })
  res.json({ timeline: updates })
}
