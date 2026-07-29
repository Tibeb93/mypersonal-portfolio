import Profile from '../models/Profile.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'

// GET /api/profile  (public)
export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne()
    if (!profile) return sendError(res, 'Profile not found.', 404)
    sendSuccess(res, { profile })
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/profile  (admin)
export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne()
    if (!profile) {
      profile = await Profile.create(req.body)
    } else {
      Object.assign(profile, req.body)
      await profile.save()
    }
    sendSuccess(res, { profile }, 'Profile updated successfully')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/profile/image  (admin)
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/profile')

    // Remove old image if exists
    const profile = await Profile.findOne()
    if (profile?.profileImage && profile?.profileImagePublicId) {
      await deleteFromCloudinary(profile.profileImagePublicId).catch(() => {})
    }

    const updated = await Profile.findOneAndUpdate(
      {},
      { profileImage: result.secure_url, profileImagePublicId: result.public_id },
      { new: true, upsert: true }
    )

    sendSuccess(res, { url: result.secure_url, profile: updated }, 'Image uploaded successfully')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/profile/resume  (admin)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/resume', 'raw')

    await Profile.findOneAndUpdate(
      {},
      { resumeUrl: result.secure_url, resumePublicId: result.public_id },
      { upsert: true }
    )

    sendSuccess(res, { url: result.secure_url }, 'Resume uploaded successfully')
  } catch (err) {
    sendError(res, err.message)
  }
}
