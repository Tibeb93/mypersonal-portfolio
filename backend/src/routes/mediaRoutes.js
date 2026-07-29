import { Router } from 'express'
import {
  getMedia,
  uploadMedia,
  updateMedia,
  deleteMedia,
} from '../controllers/mediaController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadAny, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// All media routes are admin-only
router.use(protect, authorize('admin', 'super_admin'))

router.get('/',      getMedia)
router.post(
  '/',
  uploadAny.single('file'),
  handleMulterError,
  audit('UPLOAD', 'media'),
  uploadMedia
)
router.put('/:id',   audit('UPDATE', 'media'), updateMedia)
router.delete('/:id',audit('DELETE', 'media'), deleteMedia)

export default router
