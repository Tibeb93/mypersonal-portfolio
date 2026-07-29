import { Router } from 'express'
import {
  getExperiences,
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  uploadCompanyLogo,
} from '../controllers/experienceController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadImage, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/', getExperiences)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.get('/all',   getAllExperiences)
router.post('/',     audit('CREATE', 'experience'), createExperience)
router.put('/:id',   audit('UPDATE', 'experience'), updateExperience)
router.delete('/:id',audit('DELETE', 'experience'), deleteExperience)

router.post(
  '/:id/logo',
  uploadImage.single('logo'),
  handleMulterError,
  audit('UPLOAD', 'experience'),
  uploadCompanyLogo
)

export default router
