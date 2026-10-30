import { Router } from 'express'
import { getAnalytics, getAllUsers, patchUser, getAllReports, getVerifications, patchVerification, getAllRescues, reassignRescue, getAbuseReports, resolveAbuseReport } from '../controllers/adminController.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()
router.use(authenticate, authorize('admin'))

router.get('/analytics', getAnalytics)
router.get('/users', getAllUsers)
router.patch('/users/:id', patchUser)
router.get('/reports', getAllReports)
router.get('/verifications', getVerifications)
router.patch('/verifications/:id', patchVerification)
router.get('/rescues', getAllRescues)
router.post('/rescues/:id/reassign', reassignRescue)
router.get('/abuse-reports', getAbuseReports)
router.patch('/abuse-reports/:id', resolveAbuseReport)

export default router
