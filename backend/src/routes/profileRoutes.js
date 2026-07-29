import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadResume,
} from '../controllers/profileController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadImage, uploadDocument, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// ── Public ──────────────────────────────────────────────────────────────────
router.get('/', getProfile)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.put(
  '/',
  audit('UPDATE', 'profile'),
  updateProfile
)

router.post(
  '/image',
  uploadImage.single('image'),
  handleMulterError,
  audit('UPLOAD', 'profile'),
  uploadProfileImage
)

router.post(
  '/resume',
  uploadDocument.single('resume'),
  handleMulterError,
  audit('UPLOAD', 'profile'),
  uploadResume
)

export default router
