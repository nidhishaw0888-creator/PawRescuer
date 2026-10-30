import mongoose from 'mongoose'

const assignedToSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, default: 'volunteer' },
    organizationId: { type: String },
  },
  { _id: false },
)

const timelineSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    note: { type: String, default: '' },
  },
  { _id: false },
)

const reportSchema = new mongoose.Schema(
  {
    caseRef: { type: String, required: true, unique: true, index: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    animalType: {
      type: String,
      enum: ['Stray dog', 'Stray cat', 'Bird', 'Cattle', 'Injured wildlife', 'Other'],
      required: true,
    },
    emergencyType: {
      type: String,
      enum: ['Injured', 'Abandoned', 'Trapped', 'Abused', 'Endangered', 'Other'],
      required: true,
    },
    description: { type: String, required: true, trim: true, minlength: 20 },
    symptoms: { type: String, default: '' },
    severity: {
      type: String,
      enum: ['Critical', 'High', 'Normal'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Critical', 'High', 'Normal'],
      required: true,
    },
    priorityReason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Reported', 'Accepted', 'En Route', 'On Scene', 'Rescued', 'In Care', 'Resolved'],
      default: 'Reported',
      index: true,
    },
    photos: { type: [String], default: [] },
    evidence: { type: [String], default: [] },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    address: { type: String, default: '' },
    landmark: { type: String, default: '' },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    pinCode: { type: String, default: '' },
    observedAt: { type: Date, default: Date.now },
    declinedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    assignedTo: { type: assignedToSchema, default: null },
    acceptedAt: { type: Date },
    completedAt: { type: Date },
    timeline: { type: [timelineSchema], default: [] },
  },
  { timestamps: true },
)

reportSchema.index({ location: '2dsphere' })
reportSchema.virtual('id').get(function id() {
  return this._id.toString()
})

export const Report = mongoose.model('Report', reportSchema)
