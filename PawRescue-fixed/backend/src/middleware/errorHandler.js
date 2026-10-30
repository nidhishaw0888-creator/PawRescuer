import { ApiError } from '../utils/ApiError.js'

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500
  const message = error.isOperational
    ? error.message
    : 'Something went wrong on the server.'
  if (process.env.NODE_ENV !== 'test' && statusCode === 500) {
    console.error(`[error] ${_req.method} ${_req.path}:`, error.message)
  }
  res.status(statusCode).json({ message, statusCode })
}

export function notFound(_req, res) {
  res.status(404).json({ message: 'Route not found.', statusCode: 404 })
}
