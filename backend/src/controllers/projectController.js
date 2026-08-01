import Project from '../models/Project.js'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'
import { incrementProjectView } from '../middleware/analytics.js'
import { cacheGet, cacheSet, cacheInvalidate } from '../utils/cache.js'

// GET /api/projects  (public)
export const getProjects = async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 12 } = req.query
    const cacheKey = `projects:${category || 'all'}:${featured || 'all'}:${page}:${limit}`

    const cached = cacheGet(cacheKey)
    if (cached) return res.json(cached)

    const filter = { visible: true }
    if (category) filter.category = category
    if (featured === 'true') filter.featured = true

    const total    = await Project.countDocuments(filter)
    const projects = await Project.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const response = { success: true, data: projects, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }, timestamp: new Date().toISOString() }
    cacheSet(cacheKey, response, 30 * 1000) // cache 30s
    sendPaginated(res, projects, total, page, limit)
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/projects/:slug  (public)
export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, visible: true })
    if (!project) return sendError(res, 'Project not found.', 404)

    // Non-blocking view increment
    incrementProjectView(project._id)

    sendSuccess(res, { project })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/projects  (admin)
export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const filter = {}
    if (search) filter.title = { $regex: search, $options: 'i' }

    const total    = await Project.countDocuments(filter)
    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    sendPaginated(res, projects, total, page, limit)
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/projects  (admin)
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body)
    cacheInvalidate('projects')
    if (global.io) global.io.emit('data:changed', { resource: 'projects' })
    sendSuccess(res, { project }, 'Project created', 201)
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/projects/:id  (admin)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return sendError(res, 'Project not found.', 404)
    cacheInvalidate('projects')
    if (global.io) global.io.emit('data:changed', { resource: 'projects' })
    sendSuccess(res, { project }, 'Project updated')
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/projects/:id  (admin)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return sendError(res, 'Project not found.', 404)

    // Delete media from Cloudinary
    if (project.thumbnailPublicId) await deleteFromCloudinary(project.thumbnailPublicId).catch(() => {})
    if (project.coverImagePublicId) await deleteFromCloudinary(project.coverImagePublicId).catch(() => {})
    if (project.demoVideoPublicId) await deleteFromCloudinary(project.demoVideoPublicId, 'video').catch(() => {})
    for (const s of project.screenshots) {
      if (s.publicId) await deleteFromCloudinary(s.publicId).catch(() => {})
    }

    await project.deleteOne()
    cacheInvalidate('projects')
    if (global.io) global.io.emit('data:changed', { resource: 'projects' })
    sendSuccess(res, {}, 'Project deleted')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/projects/:id/thumbnail  (admin)
export const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    const project = await Project.findById(req.params.id)
    if (!project) return sendError(res, 'Project not found.', 404)

    if (project.thumbnailPublicId) {
      await deleteFromCloudinary(project.thumbnailPublicId).catch(() => {})
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects')
    project.thumbnail = result.secure_url
    project.thumbnailPublicId = result.public_id
    await project.save()

    cacheInvalidate('projects')
    if (global.io) global.io.emit('data:changed', { resource: 'projects' })
    sendSuccess(res, { url: result.secure_url, project }, 'Thumbnail uploaded')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/projects/:id/cover  (admin)
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    const project = await Project.findById(req.params.id)
    if (!project) return sendError(res, 'Project not found.', 404)

    if (project.coverImagePublicId) {
      await deleteFromCloudinary(project.coverImagePublicId).catch(() => {})
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects/covers')
    project.coverImage = result.secure_url
    project.coverImagePublicId = result.public_id
    await project.save()

    cacheInvalidate('projects')
    if (global.io) global.io.emit('data:changed', { resource: 'projects' })
    sendSuccess(res, { url: result.secure_url, project }, 'Cover image uploaded')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/projects/:id/screenshots  (admin)
export const addScreenshot = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    const project = await Project.findById(req.params.id)
    if (!project) return sendError(res, 'Project not found.', 404)

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/projects/screenshots')
    project.screenshots.push({
      url:      result.secure_url,
      publicId: result.public_id,
      caption:  req.body.caption || '',
    })
    await project.save()

    cacheInvalidate('projects')
    if (global.io) global.io.emit('data:changed', { resource: 'projects' })
    sendSuccess(res, { project }, 'Screenshot added')
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/projects/:id/screenshots/:publicId  (admin)
export const deleteScreenshot = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return sendError(res, 'Project not found.', 404)

    const idx = project.screenshots.findIndex(s => s.publicId === req.params.publicId)
    if (idx === -1) return sendError(res, 'Screenshot not found.', 404)

    await deleteFromCloudinary(req.params.publicId).catch(() => {})
    project.screenshots.splice(idx, 1)
    await project.save()

    cacheInvalidate('projects')
    if (global.io) global.io.emit('data:changed', { resource: 'projects' })
    sendSuccess(res, { project }, 'Screenshot deleted')
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/projects/reorder  (admin)
export const reorderProjects = async (req, res) => {
  try {
    const { order } = req.body
    await Promise.all(order.map(({ id, order: o }) => Project.findByIdAndUpdate(id, { order: o })))
    cacheInvalidate('projects')
    if (global.io) global.io.emit('data:changed', { resource: 'projects' })
    sendSuccess(res, {}, 'Projects reordered')
  } catch (err) {
    sendError(res, err.message)
  }
}
