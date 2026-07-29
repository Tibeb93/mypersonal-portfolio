import { Router } from 'express'
import {
  getCertificates,
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  uploadCertificateImage,
} from '../controllers/certificateController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadImage, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/', getCertificates)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.get('/all',    getAllCertificates)
router.post('/',      audit('CREATE', 'certificates'), createCertificate)
router.put('/:id',    audit('UPDATE', 'certificates'), updateCertificate)
router.delete('/:id', audit('DELETE', 'certificates'), deleteCertificate)

router.post(
  '/:id/image',
  uploadImage.single('image'),
  handleMulterError,
  audit('UPLOAD', 'certificates'),
  uploadCertificateImage
)

export default router
