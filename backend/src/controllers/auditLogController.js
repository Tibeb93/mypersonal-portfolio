import AuditLog from '../models/AuditLog.js'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js'

// GET /api/admin/audit-log
export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, resource, userId } = req.query
    const filter = {}

    if (action)   filter.action   = action
    if (resource) filter.resource = resource
    if (userId)   filter.user     = userId

    const total = await AuditLog.countDocuments(filter)
    const logs  = await AuditLog.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    sendPaginated(res, logs, total, page, limit)
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/audit-log/clear  (super_admin only — clear old logs)
export const clearOldLogs = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 90
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    const result = await AuditLog.deleteMany({ createdAt: { $lt: cutoff } })
    sendSuccess(res, { deleted: result.deletedCount }, `Deleted logs older than ${days} days`)
  } catch (err) {
    sendError(res, err.message)
  }
}
