import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'

export async function authenticate(req, _res, next) {
  const token = req.cookies?.token
  if (!token) return next(new ApiError(401, 'Authentication required.'))
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId).select('-passwordHash')
    if (!user) return next(new ApiError(401, 'Account not found.'))
    if (user.suspended) return next(new ApiError(403, 'Your account has been suspended.'))
    req.user = user
    next()
  } catch (error) {
    next(new ApiError(401, 'Your session has expired. Please sign in again.'))
  }
}

export async function optionalAuth(req, _res, next) {
  const token = req.cookies?.token
  if (!token) return next()
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.userId).select('-passwordHash')
    if (user && !user.suspended) req.user = user
  } catch {
    // Invalid token — proceed as guest.
  }
  next()
}

export const SESSION_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

export function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '365d',
  })
}
