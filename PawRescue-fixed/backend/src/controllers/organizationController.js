import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'

export async function getProfile(req, res, next) {
  const user = await User.findById(req.user._id)
  if (!user) return next(new ApiError(404, 'Organization not found.'))
  res.json({ user: user.toJSON() })
}

export async function updateProfile(req, res, next) {
  const allowed = ['name', 'orgDescription', 'address', 'phone', 'serviceArea', 'skills', 'supportedAnimals', 'capacity']
  const updates = {}
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key]
  }
  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true })
  if (!user) return next(new ApiError(404, 'Organization not found.'))
  res.json({ user: user.toJSON() })
}

export async function getTeam(req, res) {
  const members = await User.find({ organizationId: req.user._id }).select('-passwordHash')
  res.json({ members: members.map((m) => m.toJSON()) })
}

export async function addTeamMember(req, res, next) {
  const { name, role } = req.body
  if (!name?.trim()) return next(new ApiError(400, 'Name is required.'))
  const member = await User.create({
    name: name.trim(),
    email: `team-${Date.now()}@${req.user._id}.local`,
    passwordHash: 'team-member',
    role: role || 'volunteer',
    organizationId: req.user._id,
    verificationStatus: 'Verified',
    isOnline: true,
  })
  res.status(201).json({ member: member.toJSON() })
}

export async function removeTeamMember(req, res, next) {
  await User.findByIdAndDelete(req.params.memberId)
  res.json({ message: 'Team member removed.' })
}
