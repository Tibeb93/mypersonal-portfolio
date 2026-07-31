import https from 'https'
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

    // Remove old resume if exists
    const profile = await Profile.findOne()
    if (profile?.resumePublicId) {
      await deleteFromCloudinary(profile.resumePublicId, 'raw').catch(() => {})
    }

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

// GET /api/profile/resume/download  (public)
export const downloadResume = async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile?.resumeUrl) return sendError(res, 'No resume available.', 404)

    const filename = extractFilename(profile.resumeUrl)

    https.get(profile.resumeUrl, (fileResponse) => {
      if (fileResponse.statusCode === 301 || fileResponse.statusCode === 302) {
        https.get(fileResponse.headers.location, (redirectRes) => {
          setDownloadHeaders(res, redirectRes, filename)
          redirectRes.pipe(res)
        })
        return
      }
      setDownloadHeaders(res, fileResponse, filename)
      fileResponse.pipe(res)
    }).on('error', (err) => {
      sendError(res, 'Failed to download resume.')
    })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/profile/resume/preview  (public)
export const previewResume = async (req, res) => {
  try {
    const profile = await Profile.findOne()
    if (!profile?.resumeUrl) return sendError(res, 'No resume available.', 404)

    https.get(profile.resumeUrl, (fileResponse) => {
      if (fileResponse.statusCode === 301 || fileResponse.statusCode === 302) {
        https.get(fileResponse.headers.location, (redirectRes) => {
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline',
          })
          redirectRes.pipe(res)
        })
        return
      }
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      })
      fileResponse.pipe(res)
    }).on('error', (err) => {
      sendError(res, 'Failed to load resume.')
    })
  } catch (err) {
    sendError(res, err.message)
  }
}

function extractFilename(url) {
  try {
    const pathname = new URL(url).pathname
    const segments = pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    if (lastSegment && lastSegment.includes('.')) {
      return decodeURIComponent(lastSegment)
    }
  } catch {}
  return 'resume.pdf'
}

function setDownloadHeaders(res, fileResponse, filename) {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': fileResponse.headers['content-length'],
  })
}
