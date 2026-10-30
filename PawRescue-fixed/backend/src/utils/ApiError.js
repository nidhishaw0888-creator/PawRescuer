export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }

  static notFound(message = 'Resource not found.') {
    return new ApiError(404, message)
  }

  static forbidden(message = 'You do not have permission to do this.') {
    return new ApiError(403, message)
  }

  static unauthorized(message = 'Authentication required.') {
    return new ApiError(401, message)
  }

  static badRequest(message = 'Invalid request.') {
    return new ApiError(400, message)
  }

  static conflict(message = 'This resource already exists or has a conflict.') {
    return new ApiError(409, message)
  }
}
