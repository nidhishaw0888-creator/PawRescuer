import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rescueCaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueCase' },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    category: {
      type: String,
      enum: ['rescue', 'report', 'account', 'system'],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true },
)

notificationSchema.virtual('id').get(function id() {
  return this._id.toString()
})

export const Notification = mongoose.model('Notification', notificationSchema)
