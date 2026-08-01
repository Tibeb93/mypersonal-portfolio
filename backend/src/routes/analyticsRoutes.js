import { Router } from 'express'
import {
  getOverview,
  getVisitorStats,
  getTopPages,
  getProjectStats,
  getContactActivity,
  getRecentVisitors,
  getVisitorSummary,
} from '../controllers/analyticsController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

// All analytics routes are admin-only
router.use(protect, authorize('admin', 'super_admin'))

router.get('/overview',          getOverview)
router.get('/visitors',          getVisitorStats)
router.get('/recent-visitors',   getRecentVisitors)
router.get('/visitor-summary',   getVisitorSummary)
router.get('/top-pages',         getTopPages)
router.get('/projects',          getProjectStats)
router.get('/contact-activity',  getContactActivity)

export default router
