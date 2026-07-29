import { Router } from 'express'
import {
  getEducation,
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js'
import { protect, authorize } from '../middleware/auth.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/', getEducation)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.get('/all',    getAllEducation)
router.post('/',      audit('CREATE', 'education'), createEducation)
router.put('/:id',    audit('UPDATE', 'education'), updateEducation)
router.delete('/:id', audit('DELETE', 'education'), deleteEducation)

export default router
