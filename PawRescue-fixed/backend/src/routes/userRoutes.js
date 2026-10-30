import { Router } from 'express'
import { getMe, updateMe, updateAvailability, getTeamMembers } from '../controllers/userController.js'
import { authenticate } from '../middleware/authenticate.js'

const router = Router()
router.use(authenticate)

router.get('/me', getMe)
router.patch('/me', updateMe)
router.patch('/me/availability', updateAvailability)
router.get('/organizations/:organizationId/team', getTeamMembers)

export default router
