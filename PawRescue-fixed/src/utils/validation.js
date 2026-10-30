import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_PHOTOS,
} from './constants'
import { isValidCoordinate } from './geo'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INDIAN_MOBILE_PATTERN = /^(\+91|0)?[6-9]\d{9}$/
const INDIAN_PIN_PATTERN = /^[1-9]\d{5}$/

export function validateEmail(email) {
  if (!email.trim()) return 'Email is required.'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address, such as name@example.com.'
  return ''
}

export function validateIndianMobile(phone) {
  const digits = phone.replace(/[\s-]/g, '')
  if (!digits) return ''
  if (!INDIAN_MOBILE_PATTERN.test(digits)) return 'Enter a valid 10-digit Indian mobile number, such as +91 98765 43210.'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Use at least 8 characters.'
  return ''
}

export function validateLogin(values) {
  return {
    email: validateEmail(values.email),
    password: values.password ? '' : 'Password is required.',
  }
}

export function passwordStrength(password) {
  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong']
  return { score, label: labels[score] }
}

export function validateRegistration(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Full name is required.'
  errors.email = validateEmail(values.email)
  errors.phone = validateIndianMobile(values.phone || '')
  errors.password = validatePassword(values.password)
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.'
  if (!values.acceptTerms) errors.acceptTerms = 'You must accept the terms to create an account.'

  if (values.accountType === 'volunteer') {
    if (!values.skills.trim()) errors.skills = 'List at least one skill.'
    if (!values.supportedAnimals.length) errors.supportedAnimals = 'Select at least one animal type.'
    if (!values.serviceArea.trim()) errors.serviceArea = 'Enter the area you can serve.'
    if (!values.availability.trim()) errors.availability = 'Describe your availability.'
  }

  if (values.accountType === 'organization') {
    if (!values.organizationName.trim()) errors.organizationName = 'Organization name is required.'
    if (values.orgDescription.trim().length < 20) errors.orgDescription = 'Add a description of at least 20 characters.'
    if (!values.address.trim()) errors.address = 'Address is required.'
    if (!values.serviceArea.trim()) errors.serviceArea = 'Enter the service area.'
    if (!values.supportedAnimals.length) errors.supportedAnimals = 'Select at least one animal type.'
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

export function validateReportDetails(values) {
  const errors = {}
  if (!values.animalType) errors.animalType = 'Choose the type of animal.'
  if (!values.emergencyType) errors.emergencyType = 'Choose the type of emergency.'
  if (values.description.trim().length < 20) errors.description = 'Describe the situation in at least 20 characters.'
  if (!values.severity) errors.severity = 'Choose a severity level.'
  if (!values.observedAt) {
    errors.observedAt = 'Enter when you observed the animal.'
  } else if (new Date(values.observedAt).getTime() > Date.now()) {
    errors.observedAt = 'The observed time cannot be in the future.'
  }
  return errors
}

export function validateReportLocation(values) {
  const errors = {}
  if (!isValidCoordinate(values.lat, values.lng)) errors.location = 'Set a location with the map, GPS, or manual coordinates.'
  if (!values.landmark.trim()) errors.landmark = 'Add a nearby landmark or street address.'
  if (!values.state) errors.state = 'Choose a state.'
  if (!values.city.trim()) errors.city = 'Enter the city or locality.'
  if (!INDIAN_PIN_PATTERN.test(values.pinCode)) errors.pinCode = 'Enter a valid 6-digit PIN code.'
  return errors
}

export function validateImageFile(file, currentCount) {
  if (currentCount >= MAX_PHOTOS) return `You can upload up to ${MAX_PHOTOS} photos.`
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return `${file.name} is not a JPG, PNG, or WebP image.`
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) return `${file.name} is larger than ${MAX_IMAGE_SIZE_MB} MB.`
  return ''
}
