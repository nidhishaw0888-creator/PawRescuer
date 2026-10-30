import { Router } from 'express'
import { getAvailableCases, acceptCase, declineCase, getMyRescues, getRescueById, updateStatus, addEvidence, reassignCase, getTimeline } from '../controllers/rescueController.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()
router.use(authenticate)

router.get('/available', getAvailableCases)
router.get('/mine', getMyRescues)
router.get('/:id', getRescueById)
router.get('/:id/timeline', getTimeline)
router.post('/:id/accept', authorize('volunteer', 'organization'), acceptCase)
router.post('/:id/decline', authorize('volunteer', 'organization'), declineCase)
router.patch('/:id/status', updateStatus)
router.post('/:id/evidence', addEvidence)
router.post('/:id/reassign', authorize('admin', 'organization'), reassignCase)

export default router
