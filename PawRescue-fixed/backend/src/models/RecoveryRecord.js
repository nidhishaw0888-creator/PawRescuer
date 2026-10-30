import mongoose from 'mongoose'

const recoveryRecordSchema = new mongoose.Schema(
  {
    rescueCaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCase', required: true, index: true },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true, index: true },
    clinicOrShelter: { type: String, default: '' },
    recoveryStatus: { type: String, default: 'In Care' },
    notes: { type: String, default: '' },
    transferDetails: { type: String, default: '' },
    outcome: {
      type: String,
      enum: ['Recovered', 'Reunited', 'Adopted', 'Transferred', 'Other', ''],
      default: '',
    },
    photos: { type: [String], default: [] },
    privateNotes: { type: String, default: '', select: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

recoveryRecordSchema.virtual('id').get(function id() {
  return this._id.toString()
})

export const RecoveryRecord = mongoose.model('RecoveryRecord', recoveryRecordSchema)
