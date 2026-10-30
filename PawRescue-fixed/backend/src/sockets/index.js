import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'

export function createSocketServer(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, credentials: true },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie
    if (!token) return next(new Error('Authentication required for real-time updates.'))
    try {
      let payload
      if (typeof token === 'string' && !token.includes('=')) {
        payload = jwt.verify(token, process.env.JWT_SECRET)
      } else {
        const cookieMatch = token.match(/token=([^;]+)/)
        if (!cookieMatch) return next(new Error('No token provided.'))
        payload = jwt.verify(cookieMatch[1], process.env.JWT_SECRET)
      }
      socket.userId = payload.userId
      next()
    } catch (error) {
      next(new Error('Invalid session for real-time updates.'))
    }
  })

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`)
    socket.on('disconnect', () => {
      socket.leave(`user:${socket.userId}`)
    })
  })

  return io
}
