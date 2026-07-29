import Education from '../models/Education.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'

export const getEducation = async (req, res) => {
  try {
    const educations = await Education.find({ visible: true }).sort({ order: 1, startDate: -1 })
    sendSuccess(res, { educations })
  } catch (err) { sendError(res, err.message) }
}

export const getAllEducation = async (req, res) => {
  try {
    const educations = await Education.find().sort({ order: 1, startDate: -1 })
    sendSuccess(res, { educations })
  } catch (err) { sendError(res, err.message) }
}

export const createEducation = async (req, res) => {
  try {
    const edu = await Education.create(req.body)
    sendSuccess(res, { education: edu }, 'Education created', 201)
  } catch (err) { sendError(res, err.message) }
}

export const updateEducation = async (req, res) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!edu) return sendError(res, 'Education not found.', 404)
    sendSuccess(res, { education: edu }, 'Education updated')
  } catch (err) { sendError(res, err.message) }
}

export const deleteEducation = async (req, res) => {
  try {
    const edu = await Education.findById(req.params.id)
    if (!edu) return sendError(res, 'Education not found.', 404)
    if (edu.logoPublicId) await deleteFromCloudinary(edu.logoPublicId).catch(() => {})
    await edu.deleteOne()
    sendSuccess(res, {}, 'Education deleted')
  } catch (err) { sendError(res, err.message) }
}
