import { Router } from 'express'
import { registerValidation, loginValidation, register, login, logout, me, forgotPassword } from '../controllers/authController.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/authenticate.js'
import rateLimit from 'express-rate-limit'

const router = Router()

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'Too many attempts. Please try again later.' } })
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { message: 'Too many registrations. Please try again later.' } })

router.post('/register', registerLimiter, registerValidation, validate, register)
router.post('/login', authLimiter, loginValidation, validate, login)
router.post('/logout', logout)
router.get('/me', authenticate, me)
router.post('/forgot-password', forgotPassword)

export default router
