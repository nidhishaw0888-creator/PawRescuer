
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../src/models/User.js'

dotenv.config({ path: 'backend/.env' })

async function createAdmin() {
  try {
    const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

    if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('Please configure the admin details in backend/.env')
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error('Admin password must contain at least 8 characters.')
    }

    await mongoose.connect(MONGODB_URI)

    const email = ADMIN_EMAIL.trim().toLowerCase()

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('An admin account with this email already exists.')
      } else {
        console.log('This email belongs to a non-admin account. Use a different email.')
      }
      return
    }

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

    await User.create({
      name: ADMIN_NAME.trim(),
      email,
      passwordHash,
      role: 'admin',
      verificationStatus: 'Not Required',
    })

    console.log('Admin account created successfully!')
    console.log('Admin email:', email)

  } catch (error) {
    console.error('Admin creation failed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

createAdmin()
