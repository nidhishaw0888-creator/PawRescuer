import mongoose from 'mongoose'

const rescueCaseSchema = new mongoose.Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true, index: true },
    assignedVolunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTeamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['Reported', 'Accepted', 'En Route', 'On Scene', 'Rescued', 'In Care', 'Resolved'],
      default: 'Reported',
      index: true,
    },
    acceptedAt: { type: Date },
    completedAt: { type: Date },
    outcome: { type: String, default: '' },
    escalationLevel: { type: Number, default: 0 },
    lastEscalatedAt: { type: Date },
  },
  { timestamps: true },
)

rescueCaseSchema.virtual('id').get(function id() {
  return this._id.toString()
})

export const RescueCase = mongoose.model('RescueCase', rescueCaseSchema)
