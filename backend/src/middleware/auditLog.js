import AuditLog from '../models/AuditLog.js'

export const audit = (action, resource) => async (req, res, next) => {
  // Store original json method
  const originalJson = res.json.bind(res)

  res.json = async (body) => {
    // Log after response is sent
    if (res.statusCode < 400) {
      try {
        await AuditLog.create({
          user:       req.user?._id,
          userName:   req.user?.name,
          action,
          resource,
          resourceId: req.params?.id || body?.data?._id,
          details:    {
            method: req.method,
            path:   req.path,
            body:   sanitizeBody(req.body),
          },
          ip:         req.ip,
          userAgent:  req.headers['user-agent'],
          status:     'success',
        })
      } catch (_) {
        // Non-blocking — audit log failure shouldn't affect the response
      }
    }
    return originalJson(body)
  }

  next()
}

// Remove sensitive fields from audit log body
const sanitizeBody = (body) => {
  if (!body) return {}
  const { password, refreshToken, ...safe } = body
  return safe
}
