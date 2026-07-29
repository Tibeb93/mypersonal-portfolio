import crypto from 'crypto'
import User from '../models/User.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return sendError(res, 'Email and password are required.', 400)

    const user = await User.findOne({ email }).select('+password +isActive')
    if (!user || !user.isActive) return sendError(res, 'Invalid credentials.', 401)

    const valid = await user.comparePassword(password)
    if (!valid) return sendError(res, 'Invalid credentials.', 401)

    const accessToken  = signAccessToken(user._id, user.role)
    const refreshToken = signRefreshToken(user._id)

    // Store refresh token hash
    user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex')
    user.lastLogin    = new Date()
    await user.save({ validateBeforeSave: false })

    // Send refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
    })

    sendSuccess(res, { user, accessToken }, 'Login successful')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/auth/refresh
export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return sendError(res, 'No refresh token.', 401)

    const decoded = verifyRefreshToken(token)
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({ _id: decoded.id, refreshToken: hashedToken }).select('+refreshToken')
    if (!user) return sendError(res, 'Invalid refresh token.', 401)

    const accessToken    = signAccessToken(user._id, user.role)
    const newRefreshToken = signRefreshToken(user._id)

    user.refreshToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   7 * 24 * 60 * 60 * 1000,
    })

    sendSuccess(res, { accessToken }, 'Token refreshed')
  } catch (err) {
    sendError(res, 'Invalid or expired refresh token.', 401)
  }
}

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null }, { validateBeforeSave: false })
    }
    res.clearCookie('refreshToken')
    sendSuccess(res, {}, 'Logged out successfully')
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    sendSuccess(res, { user })
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return sendError(res, 'Both fields are required.', 400)
    if (newPassword.length < 8) return sendError(res, 'New password must be at least 8 characters.', 400)

    const user = await User.findById(req.user._id).select('+password')
    const valid = await user.comparePassword(currentPassword)
    if (!valid) return sendError(res, 'Current password is incorrect.', 401)

    user.password = newPassword
    await user.save()

    sendSuccess(res, {}, 'Password changed successfully')
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/auth/profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    )
    sendSuccess(res, { user }, 'Profile updated')
  } catch (err) {
    sendError(res, err.message)
  }
}
