import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

export function validate(req, _res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map((error) => error.msg)
    return next(new ApiError(400, messages.join(' ')))
  }
  next()
}
