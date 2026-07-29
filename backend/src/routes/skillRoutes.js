import { Router } from 'express'
import {
  getSkills,
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from '../controllers/skillController.js'
import { protect, authorize } from '../middleware/auth.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/', getSkills)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.get('/all',               getAllSkills)
router.post('/',                 audit('CREATE', 'skills'),  createSkill)
router.put('/reorder',           audit('UPDATE', 'skills'),  reorderSkills)
router.put('/:id',               audit('UPDATE', 'skills'),  updateSkill)
router.delete('/:id',            audit('DELETE', 'skills'),  deleteSkill)

export default router
