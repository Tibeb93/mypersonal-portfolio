import cloudinary from '../config/cloudinary.js'
import { Readable } from 'stream'

/**
 * Upload a file buffer to Cloudinary
 */
export const uploadToCloudinary = (fileBuffer, folder = 'portfolio', resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    const readable = new Readable()
    readable.push(fileBuffer)
    readable.push(null)
    readable.pipe(uploadStream)
  })
}

/**
 * Delete a file from Cloudinary by publicId
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
