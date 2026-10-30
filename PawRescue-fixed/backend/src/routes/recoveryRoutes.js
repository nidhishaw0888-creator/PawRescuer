import { Router } from 'express'
import { getRecovery, createRecovery, updateRecovery } from '../controllers/recoveryController.js'
import { authenticate } from '../middleware/authenticate.js'

const router = Router()
router.use(authenticate)

router.get('/:rescueCaseId', getRecovery)
router.post('/:rescueCaseId', createRecovery)
router.patch('/:rescueCaseId', updateRecovery)

export default router
