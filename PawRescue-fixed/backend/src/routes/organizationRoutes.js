import { Router } from 'express'
import { getProfile, updateProfile, getTeam, addTeamMember, removeTeamMember } from '../controllers/organizationController.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()
router.use(authenticate, authorize('organization'))

router.get('/profile', getProfile)
router.patch('/profile', updateProfile)
router.get('/team', getTeam)
router.post('/team', addTeamMember)
router.delete('/team/:memberId', removeTeamMember)

export default router
