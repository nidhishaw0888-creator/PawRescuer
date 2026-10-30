import { api } from './api'

export async function login({ email, password }) {
  const data = await api.post('/auth/login', { email, password })
  return data.user
}

export async function register(values) {
  const payload = {
    accountType: values.accountType,
    name: values.name,
    organizationName: values.organizationName,
    email: values.email,
    password: values.password,
    phone: values.phone,
    skills: values.skills,
    supportedAnimals: values.supportedAnimals,
    serviceArea: values.serviceArea,
    availability: values.availability,
    orgDescription: values.orgDescription,
    address: values.address,
  }
  const data = await api.post('/auth/register', payload)
  return data.user
}

export async function requestPasswordReset(email) {
  await api.post('/auth/forgot-password', { email })
  return { email: email.trim() }
}

export async function logout() {
  await api.post('/auth/logout')
  return true
}

export async function getCurrentUser() {
  const data = await api.get('/auth/me')
  return data.user
}
