import mongoose from 'mongoose'
import { Notification } from '../models/Notification.js'
import { ApiError } from '../utils/ApiError.js'

function toFrontend(notification) {
  const n = notification.toJSON()
  return {
    id: n._id.toString(),
    userId: n.userId?.toString(),
    category: n.category,
    title: n.title,
    body: n.body,
    read: n.read,
    createdAt: n.createdAt,
    rescueCaseId: n.rescueCaseId?.toString(),
    reportId: n.reportId?.toString(),
  }
}

export async function getNotifications(req, res) {
  const items = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 })
  res.json({ items: items.map(toFrontend) })
}

export async function markNotificationRead(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new ApiError(404, 'Notification not found.'))
  const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id })
  if (!notification) return next(new ApiError(404, 'Notification not found.'))
  notification.read = true
  notification.readAt = new Date()
  await notification.save()
  res.json({ notification: toFrontend(notification) })
}

export async function markAllNotificationsRead(req, res) {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true, readAt: new Date() })
  res.json({ message: 'All notifications marked as read.' })
}
