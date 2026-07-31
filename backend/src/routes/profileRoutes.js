import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  uploadResume,
  downloadResume,
  previewResume,
} from '../controllers/profileController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadImage, uploadDocument, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// ── Public ──────────────────────────────────────────────────────────────────
router.get('/', getProfile)
router.get('/resume/download', downloadResume)
router.get('/resume/preview', previewResume)

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
