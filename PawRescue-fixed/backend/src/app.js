import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import rescueRoutes from './routes/rescueRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import recoveryRoutes from './routes/recoveryRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import organizationRoutes from './routes/organizationRoutes.js'

let io = null

export function setSocketInstance(socketInstance) {
  io = socketInstance
}

export function createApp() {
  const app = express()
  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  app.use('/uploads', express.static(path.resolve(currentDir, '../uploads'), {
    fallthrough: false,
    maxAge: '1d',
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  }))

  app.use(helmet())
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(cookieParser())

  const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 })
  app.use('/api', apiLimiter)

  app.use((req, _res, next) => {
    req.io = io
    next()
  })

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/reports', reportRoutes)
  app.use('/api/rescues', rescueRoutes)
  app.use('/api/notifications', notificationRoutes)
  app.use('/api/recovery', recoveryRoutes)
  app.use('/api/admin', adminRoutes)
  app.use('/api/organization', organizationRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
