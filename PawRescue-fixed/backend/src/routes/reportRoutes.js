import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getReports, getReportById, getNearbyReports, getMyReports, createReport, createReportValidation, deleteReport, uploadReportPhotos } from '../controllers/reportController.js'
import { validate } from '../middleware/validate.js'
import { authenticate, optionalAuth } from '../middleware/authenticate.js'
import { upload } from '../middleware/upload.js'
import { ApiError } from '../utils/ApiError.js'

const router = Router()

const reportLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30, message: { message: 'Too many reports. Please try again later.' } })

function acceptPhotos(req, res, next) {
  upload.array('photos', 6)(req, res, (err) => {
    if (err) return next(new ApiError(400, err.message))
    next()
  })
}

router.get('/', optionalAuth, getReports)
router.get('/nearby', optionalAuth, getNearbyReports)
router.get('/mine', authenticate, getMyReports)
router.post('/photos', authenticate, reportLimiter, acceptPhotos, uploadReportPhotos)
router.get('/:id', optionalAuth, getReportById)
router.post('/', authenticate, reportLimiter, createReportValidation, validate, createReport)
router.delete('/:id', authenticate, deleteReport)

export default router
