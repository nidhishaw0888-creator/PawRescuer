import { Notification } from '../models/Notification.js'

export async function createNotification(userId, { category, title, body, rescueCaseId, reportId }) {
  const notification = await Notification.create({
    userId,
    category,
    title,
    body,
    rescueCaseId: rescueCaseId || undefined,
    reportId: reportId || undefined,
  })
  return notification
}

export function emitNotification(io, userId, notification) {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification)
  }
}

export async function pushNotification(io, userId, payload) {
  const notification = await createNotification(userId, payload)
  emitNotification(io, userId, notification)
  return notification
}
