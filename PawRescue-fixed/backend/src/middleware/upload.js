import multer from 'multer'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE, files: 6 },
  fileFilter(_req, file, cb) {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WebP images are allowed.'))
    }
    cb(null, true)
  },
})
