import About from '../models/About.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'

// GET /api/about (public)
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne()
    if (!about) {
      about = await About.create({})
    }
    sendSuccess(res, { about })
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/about (admin)
export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne()
    if (!about) {
      about = await About.create(req.body)
    } else {
      Object.assign(about, req.body)
      await about.save()
    }
    sendSuccess(res, { about }, 'About section updated successfully')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/about/image (admin)
export const uploadAboutImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/about')

    const about = await About.findOne()
    if (about?.image && about?.imagePublicId) {
      await deleteFromCloudinary(about.imagePublicId).catch(() => {})
    }

    const updated = await About.findOneAndUpdate(
      {},
      { image: result.secure_url, imagePublicId: result.public_id },
      { new: true, upsert: true }
    )

    sendSuccess(res, { url: result.secure_url, about: updated }, 'Image uploaded successfully')
  } catch (err) {
    sendError(res, err.message)
  }
}
