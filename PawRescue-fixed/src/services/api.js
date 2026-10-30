import axios from 'axios'

// Central HTTP client for the Express REST API.
// In dev, Vite proxies /api to the backend (see vite.config.js).
// In production, set VITE_API_BASE_URL to the backend URL.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      const msg = error.code === 'ECONNABORTED'
        ? 'The server took too long to respond. Please try again.'
        : 'Unable to reach the server. Please check your connection and try again.'
      return Promise.reject(new Error(msg))
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)
