import mongoose from 'mongoose'
import { Report } from '../models/Report.js'
import { RescueCase } from '../models/RescueCase.js'
import { User } from '../models/User.js'
import { StatusUpdate } from '../models/StatusUpdate.js'
import { AbuseReport } from '../models/AbuseReport.js'
import { toFrontend } from './reportController.js'
import { ApiError } from '../utils/ApiError.js'
import { pushNotification } from '../services/notificationService.js'

export async function getAnalytics(req, res) {
  const [totalReports, openReports, criticalReports, unassigned, activeCases, completedRescues, verifiedVolunteers, organizations] = await Promise.all([
    Report.countDocuments(),
    Report.countDocuments({ status: 'Reported' }),
    Report.countDocuments({ severity: 'Critical' }),
    Report.countDocuments({ status: 'Reported', assignedTo: null }),
    Report.countDocuments({ status: { $in: ['Accepted', 'En Route', 'On Scene', 'Rescued', 'In Care'] } }),
    Report.countDocuments({ status: 'Resolved' }),
    User.countDocuments({ role: 'volunteer', verificationStatus: 'Verified' }),
    User.countDocuments({ role: 'organization' }),
  ])

  const monthlyTrends = await Report.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        reports: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { month: '$_id', reports: 1, resolved: 1, _id: 0 } },
  ])

  const categoryDistribution = await Report.aggregate([
    { $group: { _id: '$emergencyType', value: { $sum: 1 } } },
    { $project: { name: '$_id', value: 1, _id: 0 } },
    { $sort: { value: -1 } },
  ])

  const statusDistribution = await Report.aggregate([
    { $group: { _id: '$status', value: { $sum: 1 } } },
    { $project: { name: '$_id', value: 1, _id: 0 } },
  ])

  const recentStatusUpdates = await StatusUpdate.find()
    .populate('updatedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()

  const activityFeed = recentStatusUpdates.map((u) => ({
    id: u._id.toString(),
    text: `${u.updatedBy?.name || 'Someone'} changed a case to ${u.newStatus}`,
    at: u.createdAt,
  }))

  res.json({
    analytics: {
      totalReports,
      openReports,
      criticalReports,
      unassigned,
      activeCases,
      completedRescues,
      verifiedVolunteers,
      organizations,
      monthlyTrends,
      categoryDistribution,
      statusDistribution,
      activityFeed,
    },
  })
}

export async function getAllUsers(req, res) {
  const { role } = req.query
  const filter = role ? { role } : {}
  const users = await User.find(filter).sort({ createdAt: -1 })
  const result = users.map((u) => {
    const obj = u.toJSON()
    obj.id = u._id.toString()
    return obj
  })
  res.json({ users: result })
}

export async function patchUser(req, res, next) {
  const user = await User.findById(req.params.id)
  if (!user) return next(new ApiError(404, 'Account not found.'))
  if (req.body.suspended !== undefined) {
    if (user.role === 'admin') return next(new ApiError(403, 'Admin accounts cannot be suspended.'))
    user.suspended = Boolean(req.body.suspended)
  }
  await user.save()
  res.json({ user: user.toJSON() })
}

export async function getAllReports(req, res) {
  const { page = 1, limit = 20, status, animalType, severity } = req.query
  const filter = {}
  if (status) filter.status = status
  if (animalType) filter.animalType = animalType
  if (severity) filter.severity = severity
  const skip = (parseInt(page) - 1) * parseInt(limit)
  const reports = await Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
  const total = await Report.countDocuments(filter)
  res.json({ reports: reports.map(toFrontend), total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
}

export async function getVerifications(req, res) {
  const users = await User.find({
    role: { $in: ['volunteer', 'organization'] },
    verificationStatus: 'Pending',
  }).sort({ createdAt: -1 })
  res.json({ users: users.map((u) => u.toJSON()) })
}

export async function patchVerification(req, res, next) {
  const { status, reason } = req.body
  if (!['Verified', 'Rejected'].includes(status)) {
    return next(new ApiError(400, 'Status must be Verified or Rejected.'))
  }
  if (status === 'Rejected' && !reason?.trim()) {
    return next(new ApiError(400, 'A reason is required to reject a verification.'))
  }
  const user = await User.findById(req.params.id)
  if (!user) return next(new ApiError(404, 'Account not found.'))
  user.verificationStatus = status
  user.rejectionReason = status === 'Rejected' ? reason.trim() : null
  await user.save()

  pushNotification(req.io, user._id, {
    category: 'account',
    title: `Verification ${status.toLowerCase()}`,
    body: status === 'Rejected'
      ? `Reason: ${user.rejectionReason}`
      : 'Your profile has been verified. You can now accept rescue cases.',
  })

  res.json({ user: user.toJSON() })
}

export async function getAllRescues(req, res) {
  const reports = await Report.find({ status: { $ne: 'Reported' } }).sort({ updatedAt: -1 })
  res.json({ reports: reports.map(toFrontend) })
}

export async function getAbuseReports(req, res) {
  const reports = await AbuseReport.find().sort({ createdAt: -1 })
  res.json({ reports: reports.map((r) => ({ ...r.toJSON(), id: r._id.toString() })) })
}

export async function resolveAbuseReport(req, res, next) {
  const { status } = req.body
  if (!['Confirmed', 'Dismissed'].includes(status)) {
    return next(new ApiError(400, 'Resolution must be Confirmed or Dismissed.'))
  }
  const report = await AbuseReport.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Abuse report not found.'))
  report.status = status
  report.reviewedBy = req.user._id
  await report.save()
  res.json({ report: { ...report.toJSON(), id: report._id.toString() } })
}

export async function reassignRescue(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Case not found.'))
  const { assigneeId, assigneeName, assigneeType } = req.body
  if (!assigneeId || !assigneeName) return next(new ApiError(400, 'Assignee is required.'))
  const report = await Report.findById(req.params.id)
  if (!report) return next(new ApiError(404, 'Case not found.'))
  report.assignedTo = { id: assigneeId, name: assigneeName, type: assigneeType || 'volunteer', organizationId: report.assignedTo?.organizationId }
  await report.save()

  const rescueCase = await RescueCase.findOne({ reportId: report._id })
  if (rescueCase) {
    rescueCase.assignedVolunteerId = assigneeId
    await rescueCase.save()
  }

  pushNotification(req.io, assigneeId, {
    category: 'rescue',
    title: `Case ${report.caseRef} assigned to you`,
    body: `Assigned by admin ${req.user.name}.`,
    reportId: report._id,
    rescueCaseId: rescueCase?._id,
  })

  res.json({ report: toFrontend(report) })
}
