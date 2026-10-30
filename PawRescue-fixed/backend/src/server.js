import dns from 'node:dns'

dns.setServers(['8.8.8.8', '8.8.4.4'])

import 'dotenv/config'
import http from 'http'
import { createApp, setSocketInstance } from './app.js'
import { connectDB } from './config/db.js'
import { createSocketServer } from './sockets/index.js'
import { startEscalationScheduler } from './services/escalationService.js'

async function start() {
  try {
    await connectDB()
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }

  const app = createApp()
  const httpServer = http.createServer(app)
  const io = createSocketServer(httpServer, process.env.CLIENT_URL || 'http://localhost:5173')
  setSocketInstance(io)

  if (process.env.NODE_ENV !== 'test') {
    startEscalationScheduler(io)
  }

  const PORT = process.env.PORT || 5000
  httpServer.listen(PORT, () => {
    console.log(`PawRescue API running on port ${PORT}`)
  })

  return httpServer
}

start()
