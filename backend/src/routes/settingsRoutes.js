import { Router } from 'express'
import {
  getPublicSettings,
  getSettings,
  updateSettings,
  uploadLogo,
  uploadFavicon,
} from '../controllers/settingsController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadImage, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/public', getPublicSettings)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.get('/',  getSettings)
router.put('/',  audit('UPDATE', 'settings'), updateSettings)

router.post(
  '/logo',
  uploadImage.single('logo'),
  handleMulterError,
  audit('UPLOAD', 'settings'),
  uploadLogo
)
router.post(
  '/favicon',
  uploadImage.single('favicon'),
  handleMulterError,
  audit('UPLOAD', 'settings'),
  uploadFavicon
)

export default router
