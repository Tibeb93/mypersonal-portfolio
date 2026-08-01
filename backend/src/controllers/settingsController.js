import Settings from '../models/Settings.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'
import { cacheGet, cacheSet, cacheInvalidate } from '../utils/cache.js'

// GET /api/settings  (public — safe fields only)
export const getPublicSettings = async (req, res) => {
  try {
    const cached = cacheGet('settings:public')
    if (cached) return res.json(cached)

    let settings = await Settings.findOne().select(
      'siteTitle siteTagline logo favicon primaryColor accentColor ' +
      'footerText copyright contactEmail contactPhone contactAddress ' +
      'socials seoTitle seoDescription seoKeywords googleAnalytics features'
    )

    if (!settings) {
      settings = await Settings.create({})
    }

    const response = { success: true, data: { settings }, timestamp: new Date().toISOString() }
    cacheSet('settings:public', response, 120 * 1000) // cache 2min
    sendSuccess(res, { settings })
  } catch (err) {
    sendError(res, err.message)
  }
}

// GET /api/admin/settings  (admin — full document)
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) settings = await Settings.create({})
    sendSuccess(res, { settings })
  } catch (err) {
    sendError(res, err.message)
  }
}

// PUT /api/admin/settings  (admin)
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create(req.body)
    } else {
      // Deep merge for nested objects like socials and features
      Object.keys(req.body).forEach(key => {
        if (
          typeof req.body[key] === 'object' &&
          !Array.isArray(req.body[key]) &&
          req.body[key] !== null
        ) {
          settings[key] = { ...settings[key]?.toObject?.() ?? settings[key], ...req.body[key] }
        } else {
          settings[key] = req.body[key]
        }
      })
      await settings.save()
    }
    cacheInvalidate('settings')
    if (global.io) global.io.emit('data:changed', { resource: 'settings' })
    sendSuccess(res, { settings }, 'Settings updated successfully')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/settings/logo  (admin)
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    // Delete old logo if exists
    const existing = await Settings.findOne()
    if (existing?.logoPublicId) {
      await deleteFromCloudinary(existing.logoPublicId).catch(() => {})
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/brand')

    const settings = await Settings.findOneAndUpdate(
      {},
      { logo: result.secure_url, logoPublicId: result.public_id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    cacheInvalidate('settings')
    if (global.io) global.io.emit('data:changed', { resource: 'settings' })
    sendSuccess(res, { url: result.secure_url, settings }, 'Logo uploaded')
  } catch (err) {
    sendError(res, err.message)
  }
}

// POST /api/admin/settings/favicon  (admin)
export const uploadFavicon = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)

    const existing = await Settings.findOne()
    if (existing?.faviconPublicId) {
      await deleteFromCloudinary(existing.faviconPublicId).catch(() => {})
    }

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/brand')

    const settings = await Settings.findOneAndUpdate(
      {},
      { favicon: result.secure_url, faviconPublicId: result.public_id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    cacheInvalidate('settings')
    if (global.io) global.io.emit('data:changed', { resource: 'settings' })
    sendSuccess(res, { url: result.secure_url, settings }, 'Favicon uploaded')
  } catch (err) {
    sendError(res, `Upload failed: ${err.message}`)
  }
}
