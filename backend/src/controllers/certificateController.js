import Certificate from '../models/Certificate.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js'

export const getCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ visible: true }).sort({ order: 1, issueDate: -1 })
    sendSuccess(res, { certificates: certs })
  } catch (err) { sendError(res, err.message) }
}

export const getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ order: 1, issueDate: -1 })
    sendSuccess(res, { certificates: certs })
  } catch (err) { sendError(res, err.message) }
}

export const createCertificate = async (req, res) => {
  try {
    const cert = await Certificate.create(req.body)
    sendSuccess(res, { certificate: cert }, 'Certificate created', 201)
  } catch (err) { sendError(res, err.message) }
}

export const updateCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!cert) return sendError(res, 'Certificate not found.', 404)
    sendSuccess(res, { certificate: cert }, 'Certificate updated')
  } catch (err) { sendError(res, err.message) }
}

export const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id)
    if (!cert) return sendError(res, 'Certificate not found.', 404)
    if (cert.imagePublicId) await deleteFromCloudinary(cert.imagePublicId).catch(() => {})
    await cert.deleteOne()
    sendSuccess(res, {}, 'Certificate deleted')
  } catch (err) { sendError(res, err.message) }
}

export const uploadCertificateImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded.', 400)
    const cert = await Certificate.findById(req.params.id)
    if (!cert) return sendError(res, 'Certificate not found.', 404)

    if (cert.imagePublicId) await deleteFromCloudinary(cert.imagePublicId).catch(() => {})

    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/certificates')
    cert.image = result.secure_url
    cert.imagePublicId = result.public_id
    await cert.save()

    sendSuccess(res, { url: result.secure_url, certificate: cert }, 'Image uploaded')
  } catch (err) { sendError(res, err.message) }
}
