import mongoose from 'mongoose'

const abuseReportSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    caseRef: { type: String, default: '' },
    targetType: { type: String, enum: ['report', 'user'], default: 'report' },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    reason: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Open', 'Confirmed', 'Dismissed'], default: 'Open', index: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

abuseReportSchema.virtual('id').get(function id() {
  return this._id.toString()
})

export const AbuseReport = mongoose.model('AbuseReport', abuseReportSchema)
