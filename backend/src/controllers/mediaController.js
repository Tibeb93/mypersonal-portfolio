import Media from '../models/Media.js'
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'

// GET /api/admin/media  (admin)
export const getMedia = async (req, res) => {
  try {
    const { page = 1, limit = 24, folder, resourceType, search } = req.query
    const filter = {}
    if (folder)       filter.folder = folder
    if (resourceType) filter.resourceType = resourceType
    if (search)       filter.name = { $regex: search, $options: 'i' }

    const total  = await Media.countDocuments(filter)
    const media  = await Media.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    sendPaginated(res, media, total, page, limit)
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/media  (admin — upload new file)
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    const folder       = req.body.folder || 'portfolio/media'
    const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image'

    const result = await uploadToCloudinary(req.file.buffer, folder, resourceType)

    const media = await Media.create({
      name:         req.body.name || req.file.originalname,
      url:          result.secure_url,
      publicId:     result.public_id,
      resourceType,
      format:       result.format,
      size:         result.bytes,
      width:        result.width,
      height:       result.height,
      folder,
      alt:          req.body.alt || '',
      caption:      req.body.caption || '',
      tags:         req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
      uploadedBy:   req.user._id,
    })

    sendSuccess(res, { media }, 'File uploaded successfully', 201)
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/media/:id  (admin — update metadata)
export const updateMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!media) return sendError(res, 'Media not found.', 404)
    sendSuccess(res, { media }, 'Media updated')
  } catch (err) {
    sendError(res, err.message)
  }
}

// DELETE /api/admin/media/:id  (admin)
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
    if (!media) return sendError(res, 'Media not found.', 404)

    await deleteFromCloudinary(media.publicId, media.resourceType).catch(() => {})
    await media.deleteOne()

    sendSuccess(res, {}, 'Media deleted')
  } catch (err) {
    sendError(res, err.message)
  }
}
