import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

let configured = false

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    configured = false
    return
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  })
  configured = true
}

export function isCloudinaryConfigured() {
  return configured
}

export async function uploadToCloudinary(fileBuffer, folder = 'pawrescue') {
  if (!configured) {
    throw new Error('Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the backend .env file.')
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
        if (error) reject(new Error('Image upload failed.'))
        else resolve({ url: result.secure_url, publicId: result.public_id })
      })
      .end(fileBuffer)
  })
}

configureCloudinary()
