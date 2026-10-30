import mongoose from 'mongoose'

const statusUpdateSchema = new mongoose.Schema(
  {
    rescueCaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCase', required: true, index: true },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true, index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    previousStatus: { type: String },
    newStatus: { type: String, required: true },
    note: { type: String, default: '' },
    evidencePhotos: { type: [String], default: [] },
  },
  { timestamps: true },
)

export const StatusUpdate = mongoose.model('StatusUpdate', statusUpdateSchema)
