import { Router } from 'express'
import {
  getProjects,
  getProjectBySlug,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadThumbnail,
  uploadCoverImage,
  addScreenshot,
  deleteScreenshot,
  reorderProjects,
} from '../controllers/projectController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadImage, uploadVideo, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'
import { trackPageView } from '../middleware/analytics.js'

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/',      trackPageView('projects'), getProjects)
router.get('/:slug', getProjectBySlug)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.get('/admin/all',           getAllProjects)
router.post('/',                   audit('CREATE', 'projects'), createProject)
router.put('/reorder',             audit('UPDATE', 'projects'), reorderProjects)
router.put('/:id',                 audit('UPDATE', 'projects'), updateProject)
router.delete('/:id',              audit('DELETE', 'projects'), deleteProject)

// Media uploads
router.post(
  '/:id/thumbnail',
  uploadImage.single('thumbnail'),
  handleMulterError,
  audit('UPLOAD', 'projects'),
  uploadThumbnail
)
router.post(
  '/:id/cover',
  uploadImage.single('coverImage'),
  handleMulterError,
  audit('UPLOAD', 'projects'),
  uploadCoverImage
)
router.post(
  '/:id/screenshots',
  uploadImage.single('screenshot'),
  handleMulterError,
  audit('UPLOAD', 'projects'),
  addScreenshot
)
router.delete(
  '/:id/screenshots/:publicId',
  audit('DELETE', 'projects'),
  deleteScreenshot
)

export default router
