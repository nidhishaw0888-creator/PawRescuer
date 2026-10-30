import { Router } from 'express'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notificationController.js'
import { authenticate } from '../middleware/authenticate.js'

const router = Router()
router.use(authenticate)

router.get('/', getNotifications)
router.patch('/read-all', markAllNotificationsRead)
router.patch('/:id/read', markNotificationRead)

export default router
