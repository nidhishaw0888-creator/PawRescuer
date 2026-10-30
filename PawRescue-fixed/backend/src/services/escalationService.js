import { Report } from '../models/Report.js'
import { RescueCase } from '../models/RescueCase.js'
import { pushNotification } from './notificationService.js'

const INTERVAL_MS = parseInt(process.env.ESCALATION_INTERVAL_MS || '300000', 10)

let intervalHandle = null
let io = null

export function startEscalationScheduler(socketInstance) {
  io = socketInstance
  if (intervalHandle) return
  intervalHandle = setInterval(runEscalation, INTERVAL_MS)
  console.log(`Escalation scheduler started (every ${INTERVAL_MS}ms)`)
}

export function stopEscalationScheduler() {
  if (intervalHandle) {
    clearInterval(intervalHandle)
    intervalHandle = null
  }
}

async function runEscalation() {
  try {
    const unaccepted = await Report.find({ status: 'Reported' }).lean()
    for (const report of unaccepted) {
      const minutesSinceCreated = (Date.now() - new Date(report.createdAt).getTime()) / 60000
      if (minutesSinceCreated < 5) continue
      await RescueCase.findOneAndUpdate({ reportId: report._id }, { $inc: { escalationLevel: 1 }, lastEscalatedAt: new Date() })
      const rescueCase = await RescueCase.findOne({ reportId: report._id })
      if (rescueCase && io) {
        await pushNotification(io, report.reporterId, {
          category: 'system',
          title: `Case ${report.caseRef} is still waiting for a responder`,
          body: `No responder has accepted this case yet. It has been escalated (level ${rescueCase.escalationLevel}).`,
          reportId: report._id,
        })
      }
    }
  } catch (error) {
    console.error('Escalation error:', error.message)
  }
}
