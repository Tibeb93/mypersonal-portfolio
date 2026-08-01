import Experience from '../models/Experience.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'
import { cacheGet, cacheSet, cacheInvalidate } from '../utils/cache.js'

// GET /api/experience  (public)
export const getExperiences = async (req, res) => {
  try {
    const cached = cacheGet('experience')
    if (cached) return res.json(cached)

    const experiences = await Experience.find({ visible: true }).sort({ order: 1, startDate: -1 })
    const response = { success: true, data: { experiences }, timestamp: new Date().toISOString() }
    cacheSet('experience', response, 120 * 1000)
    sendSuccess(res, { experiences })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/experience  (admin)
export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 })
    sendSuccess(res, { experiences })
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/experience  (admin)
export const createExperience = async (req, res) => {
  try {
    const exp = await Experience.create(req.body)
    cacheInvalidate('experience')
    if (global.io) global.io.emit('data:changed', { resource: 'experience' })
    sendSuccess(res, { experience: exp }, 'Experience created', 201)
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/experience/:id  (admin)
export const updateExperience = async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!exp) return sendError(res, 'Experience not found.', 404)
    cacheInvalidate('experience')
    if (global.io) global.io.emit('data:changed', { resource: 'experience' })
    sendSuccess(res, { experience: exp }, 'Experience updated')
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/experience/:id  (admin)
export const deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id)
    if (!exp) return sendError(res, 'Experience not found.', 404)
    if (exp.companyLogoPublicId) await deleteFromCloudinary(exp.companyLogoPublicId).catch(() => {})
    await exp.deleteOne()
    cacheInvalidate('experience')
    if (global.io) global.io.emit('data:changed', { resource: 'experience' })
    sendSuccess(res, {}, 'Experience deleted')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/experience/:id/logo  (admin)
export const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)
    const exp = await Experience.findById(req.params.id)
    if (!exp) return sendError(res, 'Experience not found.', 404)

    if (exp.companyLogoPublicId) await deleteFromCloudinary(exp.companyLogoPublicId).catch(() => {})

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/companies')
    exp.companyLogo = result.secure_url
    exp.companyLogoPublicId = result.public_id
    await exp.save()

    cacheInvalidate('experience')
    if (global.io) global.io.emit('data:changed', { resource: 'experience' })
    sendSuccess(res, { url: result.secure_url, experience: exp }, 'Logo uploaded')
  } catch (err) {
    sendError(res, err.message)
  }
}
