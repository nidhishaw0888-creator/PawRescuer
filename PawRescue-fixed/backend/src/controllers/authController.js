import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { signToken, SESSION_MAX_AGE_MS } from '../middleware/authenticate.js'
import { pushNotification } from '../services/notificationService.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  maxAge: SESSION_MAX_AGE_MS,
}

function publicUser(user) {
  const obj = user.toJSON()
  delete obj.passwordHash
  obj.id = user._id.toString()
  return obj
}

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required.'),
  body('phone')
    .optional({ values: 'falsy' })
    .customSanitizer((value) => String(value).replace(/[\s-]/g, ''))
    .matches(/^(\+91|0)?[6-9]\d{9}$/)
    .withMessage('Enter a valid 10-digit Indian mobile number.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('accountType')
    .isIn(['citizen', 'volunteer', 'organization'])
    .withMessage('Invalid account type.'),
]

export async function register(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return next(new ApiError(400, errors.array().map((e) => e.msg).join(' ')))

  const { accountType, name, organizationName, email, password, phone, skills, supportedAnimals, serviceArea, availability, orgDescription, address } = req.body

  try {
    const existing = await User.findOne({ email })
    if (existing) return next(new ApiError(409, 'An account with this email already exists.'))

    const passwordHash = await bcrypt.hash(password, 12)
    const isCitizen = accountType === 'citizen'
    const displayName = accountType === 'organization' ? organizationName?.trim() : name.trim()

    const user = await User.create({
      name: displayName,
      contactName: accountType === 'organization' ? name.trim() : undefined,
      email,
      passwordHash,
      role: accountType,
      phone,
      verificationStatus: isCitizen ? 'Not Required' : 'Pending',
      skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      supportedAnimals: supportedAnimals || [],
      serviceArea: serviceArea?.trim() || '',
      availability: availability?.trim() || '',
      orgDescription: orgDescription?.trim() || '',
      address: address?.trim() || '',
      capacity: accountType === 'organization' ? { max: 10, current: 0 } : undefined,
      isOnline: false,
    })

    const token = signToken(user._id)
    res.cookie('token', token, COOKIE_OPTIONS)

    // Non-blocking: notification failure should not fail registration
    pushNotification(req.io, user._id, {
      category: 'account',
      title: isCitizen ? 'Welcome to PawRescue' : 'Verification submitted',
      body: isCitizen
        ? 'Your account is ready. You can now report animals in need.'
        : 'Your profile is pending review. You will be notified once an admin reviews it.',
    }).catch((err) => console.error('[register] notification failed:', err.message))

    res.status(201).json({ user: publicUser(user) })
  } catch (err) {
    if (err.code === 11000) {
      return next(new ApiError(409, 'An account with this email already exists.'))
    }
    if (err.name === 'ValidationError') {
      return next(new ApiError(400, Object.values(err.errors).map((e) => e.message).join(' ')))
    }
    console.error('[register] error:', err.message)
    next(new ApiError(500, 'Unable to create account. Please try again.'))
  }
}

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
]

export async function login(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return next(new ApiError(400, errors.array().map((e) => e.msg).join(' ')))

  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return next(new ApiError(401, 'No account matches these details.'))
  }
  if (user.suspended) return next(new ApiError(403, 'Your account has been suspended.'))

  const token = signToken(user._id)
  res.cookie('token', token, COOKIE_OPTIONS)

  res.json({ user: publicUser(user) })
}

export async function logout(_req, res) {
  res.clearCookie('token')
  res.json({ message: 'Signed out.' })
}

export async function me(req, res) {
  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).json({ message: 'Account not found.' })
  res.json({ user: publicUser(user) })
}

export async function forgotPassword(req, res) {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'Email is required.' })
  const user = await User.findOne({ email })
  if (user) {
    pushNotification(req.io, user._id, {
      category: 'account',
      title: 'Password reset requested',
      body: 'A password reset was requested for your account. Configure SMTP to send reset emails.',
    })
  }
  res.json({ message: 'If an account exists for that email, a reset link has been sent.' })
}
