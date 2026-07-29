import { Router } from 'express'
import {
  submitContact,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
  bulkDeleteMessages,
  getMessageStats,
} from '../controllers/contactController.js'
import { protect, authorize } from '../middleware/auth.js'
import { audit } from '../middleware/auditLog.js'
import rateLimit from 'express-rate-limit'

// Strict rate limit for contact form — 5 submissions per IP per hour
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.post('/', contactLimiter, submitContact)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.get('/',              getMessages)
router.get('/stats',         getMessageStats)
router.get('/:id',           getMessage)
router.put('/:id/status',    audit('UPDATE', 'contact'), updateMessageStatus)
router.delete('/bulk',       audit('DELETE', 'contact'), bulkDeleteMessages)
router.delete('/:id',        audit('DELETE', 'contact'), deleteMessage)

export default router
