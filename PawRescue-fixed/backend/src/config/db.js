
import mongoose from 'mongoose'
import dns from 'node:dns'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Copy .env.example to .env and add your MongoDB Atlas connection string.'
    )
  }

  // Configure DNS before connecting to MongoDB
  dns.setServers(['8.8.8.8', '8.8.4.4'])

  mongoose.set('strictQuery', true)

  await mongoose.connect(uri)

  console.log('MongoDB connected')
}
