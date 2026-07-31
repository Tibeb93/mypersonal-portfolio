import { Router } from 'express'
import {
  getAbout,
  updateAbout,
  uploadAboutImage,
} from '../controllers/aboutController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadImage, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// ── Public ──────────────────────────────────────────────────────────────────
router.get('/', getAbout)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.put(
  '/',
  audit('UPDATE', 'about'),
  updateAbout
)

router.post(
  '/image',
  uploadImage.single('image'),
  handleMulterError,
  audit('UPLOAD', 'about'),
  uploadAboutImage
)

export default router
