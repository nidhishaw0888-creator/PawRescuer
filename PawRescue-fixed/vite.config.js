import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const backendDir = resolve(__dirname, 'backend')

function loadBackendEnv() {
  const envPath = resolve(backendDir, '.env')
  const content = readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

function expressBackend() {
  return {
    name: 'express-backend-middleware',
    configureServer: async (server) => {
      loadBackendEnv()

      const { createApp, setSocketInstance } = await import('./backend/src/app.js')
      const { connectDB } = await import('./backend/src/config/db.js')
      const { Server } = await import('socket.io')

      try {
        await connectDB()
        console.log('[backend] MongoDB connected')
      } catch (err) {
        console.error('[backend] MongoDB connection failed:', err.message)
      }

      const app = createApp()
      const io = new Server(server.httpServer, {
        cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
      })
      setSocketInstance(io)

      try {
        const { startEscalationScheduler } = await import('./backend/src/services/escalationService.js')
        if (process.env.NODE_ENV !== 'test') startEscalationScheduler(io)
      } catch (e) {
        console.error('[backend] Escalation scheduler failed to start:', e.message)
      }

      server.middlewares.use((req, res, next) => {
  if (!req.url || !(req.url.startsWith('/api') || req.url.startsWith('/uploads'))) {
    return next()
  }

  app(req, res, next)
})
      console.log('[backend] Express API mounted on Vite server at /api')
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), expressBackend()],
})
