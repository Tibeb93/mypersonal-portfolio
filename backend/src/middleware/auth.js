import { verifyAccessToken } from '../utils/jwt.js'
import User from '../models/User.js'
import { sendError } from '../utils/apiResponse.js'

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)

    const user = await User.findById(decoded.id).select('+isActive')
    if (!user) return sendError(res, 'User not found.', 401)
    if (!user.isActive) return sendError(res, 'Account is deactivated.', 403)

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired.', 401)
    if (err.name === 'JsonWebTokenError')  return sendError(res, 'Invalid token.', 401)
    return sendError(res, 'Authentication failed.', 401)
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return sendError(res, 'You do not have permission to perform this action.', 403)
  }
  next()
}
