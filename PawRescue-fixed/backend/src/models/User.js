import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['citizen', 'volunteer', 'organization', 'admin'],
      required: true,
      index: true,
    },
    contactName: { type: String, trim: true },
    phone: { type: String, trim: true, select: false },
    profilePhoto: { type: String, default: '' },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Not Required'],
      default: 'Not Required',
    },
    rejectionReason: { type: String, default: null },
    documents: [
      {
        id: String,
        name: String,
        type: { type: String, enum: ['pdf', 'image'] },
        url: String,
      },
    ],
    skills: { type: [String], default: [] },
    supportedAnimals: { type: [String], default: [] },
    serviceArea: { type: String, default: '' },
    availability: { type: String, default: '' },
    orgDescription: { type: String, default: '' },
    address: { type: String, default: '' },
    capacity: { max: { type: Number, default: 0 }, current: { type: Number, default: 0 } },
    isOnline: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    notificationPreferences: {
      newCases: { type: Boolean, default: true },
      statusChanges: { type: Boolean, default: true },
      account: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
)

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.__v
  return obj
}

userSchema.virtual('id').get(function id() {
  return this._id.toString()
})

export const User = mongoose.model('User', userSchema)
