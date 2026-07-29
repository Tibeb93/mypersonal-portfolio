import { Router } from 'express'
import {
  login,
  logout,
  refresh,
  getMe,
  changePassword,
  updateAdminProfile,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// Public
router.post('/login',   login)
router.post('/refresh', refresh)

// Protected
router.use(protect)
router.post('/logout',           logout)
router.get('/me',                getMe)
router.put('/change-password',   changePassword)
router.put('/profile',           updateAdminProfile)

export default router
