import { Router } from 'express'
import {
  getBlogs,
  getBlogBySlug,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadCoverImage,
  getBlogCategories,
  getBlogTags,
} from '../controllers/blogController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadImage, handleMulterError } from '../middleware/upload.js'
import { audit } from '../middleware/auditLog.js'
import { trackPageView } from '../middleware/analytics.js'

const router = Router()

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/',            trackPageView('blog'), getBlogs)
router.get('/categories',  getBlogCategories)
router.get('/tags',        getBlogTags)
router.get('/:slug',       getBlogBySlug)

// ── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, authorize('admin', 'super_admin'))

router.get('/admin/all',    getAllBlogs)
router.get('/admin/:id',    getBlogById)
router.post('/',            audit('CREATE', 'blog'), createBlog)
router.put('/:id',          audit('UPDATE', 'blog'), updateBlog)
router.delete('/:id',       audit('DELETE', 'blog'), deleteBlog)

router.post(
  '/:id/cover',
  uploadImage.single('cover'),
  handleMulterError,
  audit('UPLOAD', 'blog'),
  uploadCoverImage
)

export default router
