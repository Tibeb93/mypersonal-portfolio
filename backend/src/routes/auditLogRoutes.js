import { Router } from 'express'
import {
  getAuditLogs,
  clearOldLogs,
} from '../controllers/auditLogController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

// All audit routes require super_admin for clear, admin for read
router.use(protect)

router.get('/',      authorize('admin', 'super_admin'), getAuditLogs)
router.delete('/clear', authorize('super_admin'),       clearOldLogs)

export default router
