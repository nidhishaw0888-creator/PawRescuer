import { io } from 'socket.io-client'

let socket = null

export function getSocket() {
  if (socket) return socket

  socket = io({
    auth: (cb) => {
      // Socket.IO reads the token from the httpOnly cookie set by the backend.
      // The auth callback is required by the server handshake validator.
      cb({})
    },
    withCredentials: true,
  })

  socket.on('connect_error', (err) => {
    // Real-time is a progressive enhancement; failures are non-fatal.
    console.warn('[socket] connection error:', err.message)
  })

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}
