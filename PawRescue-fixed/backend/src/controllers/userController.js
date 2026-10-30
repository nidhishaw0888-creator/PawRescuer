import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { pushNotification } from '../services/notificationService.js'

function publicUser(user) {
  if (!user) return null
  const obj = user.toJSON()
  obj.id = user._id.toString()
  return obj
}

export async function getMe(req, res, next) {
  const user = await User.findById(req.user._id)
  if (!user) return next(new ApiError(404, 'Account not found.'))
  res.json({ user: publicUser(user) })
}

export async function updateMe(req, res, next) {
  const allowed = ['name', 'phone', 'skills', 'supportedAnimals', 'serviceArea', 'availability', 'profilePhoto']
  const updates = {}
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }
  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true })
  if (!user) return next(new ApiError(404, 'Account not found.'))
  res.json({ user: publicUser(user) })
}

export async function updateAvailability(req, res, next) {
  const user = await User.findById(req.user._id)
  if (!user) return next(new ApiError(404, 'Account not found.'))
  user.isOnline = Boolean(req.body.isOnline)
  await user.save()
  res.json({ user: publicUser(user) })
}

export async function getUsers(req, res) {
  const { role } = req.query
  const filter = role ? { role } : {}
  const users = await User.find(filter).sort({ createdAt: -1 })
  res.json({ users: users.map(publicUser) })
}

export async function getUserById(req, res, next) {
  const user = await User.findById(req.params.id)
  if (!user) return next(new ApiError(404, 'Account not found.'))
  res.json({ user: publicUser(user) })
}

export async function updateVerificationStatus(req, res, next) {
  const { status } = req.body
  if (!['Verified', 'Rejected'].includes(status)) {
    return next(new ApiError(400, 'Status must be Verified or Rejected.'))
  }
  if (status === 'Rejected' && !req.body.reason?.trim()) {
    return next(new ApiError(400, 'A reason is required to reject a verification.'))
  }
  const user = await User.findById(req.params.id)
  if (!user) return next(new ApiError(404, 'Account not found.'))
  user.verificationStatus = status
  user.rejectionReason = status === 'Rejected' ? req.body.reason.trim() : null
  await user.save()

  pushNotification(req.io, user._id, {
    category: 'account',
    title: `Verification ${status.toLowerCase()}`,
    body: status === 'Rejected'
      ? `Reason: ${user.rejectionReason}`
      : 'Your profile has been verified. You can now accept rescue cases.',
  })

  res.json({ user: publicUser(user) })
}

export async function setUserSuspended(req, res, next) {
  const user = await User.findById(req.params.id)
  if (!user) return next(new ApiError(404, 'Account not found.'))
  if (user.role === 'admin') return next(new ApiError(403, 'Admin accounts cannot be suspended.'))
  user.suspended = Boolean(req.body.suspended)
  await user.save()
  res.json({ user: publicUser(user) })
}

export async function getTeamMembers(req, res, next) {
  const { organizationId } = req.params
  const members = await User.find({ organizationId }).select('name role isOnline verificationStatus')
  res.json({ members: members.map(publicUser) })
}

export async function addTeamMember(req, res, next) {
  const { name, role } = req.body
  if (!name?.trim()) return next(new ApiError(400, 'Name is required.'))
  const member = await User.create({
    name: name.trim(),
    email: `team-${Date.now()}@${req.params.organizationId}.local`,
    passwordHash: 'team-member',
    role: role || 'volunteer',
    organizationId: req.params.organizationId,
    verificationStatus: 'Verified',
  })
  res.status(201).json({ member: publicUser(member) })
}

export async function removeTeamMember(req, res, next) {
  await User.findByIdAndDelete(req.params.memberId)
  res.json({ message: 'Team member removed.' })
}
