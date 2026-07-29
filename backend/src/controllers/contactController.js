import ContactMessage from '../models/ContactMessage.js'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js'

// POST /api/contact  (public)
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body

    if (!name || !email || !subject || !message) {
      return sendError(res, 'Name, email, subject and message are required.', 400)
    }

    const msg = await ContactMessage.create({
      name, email, subject, message, phone,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    })

    sendSuccess(res, { id: msg._id }, 'Message sent successfully', 201)
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/contact  (admin)
export const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const filter = {}
    if (status) filter.status = status

    const total    = await ContactMessage.countDocuments(filter)
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    sendPaginated(res, messages, total, page, limit)
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/contact/:id  (admin)
export const getMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'read' } },
      { new: true }
    )
    if (!msg) return sendError(res, 'Message not found.', 404)
    sendSuccess(res, { message: msg })
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/contact/:id/status  (admin)
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'replied' ? { repliedAt: new Date() } : {}),
      },
      { new: true }
    )
    if (!msg) return sendError(res, 'Message not found.', 404)
    sendSuccess(res, { message: msg }, 'Status updated')
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/contact/:id  (admin)
export const deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id)
    if (!msg) return sendError(res, 'Message not found.', 404)
    sendSuccess(res, {}, 'Message deleted')
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/contact/bulk  (admin)
export const bulkDeleteMessages = async (req, res) => {
  try {
    const { ids } = req.body
    await ContactMessage.deleteMany({ _id: { $in: ids } })
    sendSuccess(res, {}, 'Messages deleted')
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/contact/stats  (admin)
export const getMessageStats = async (req, res) => {
  try {
    const stats = await ContactMessage.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    const total = await ContactMessage.countDocuments()
    sendSuccess(res, { stats, total })
  } catch (err) {
    sendError(res, err.message)
  }
}
