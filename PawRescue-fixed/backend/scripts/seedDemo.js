import 'dotenv/config'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { connectDB } from '../src/config/db.js'
import { User } from '../src/models/User.js'
import { Report } from '../src/models/Report.js'
import { RescueCase } from '../src/models/RescueCase.js'
import { Notification } from '../src/models/Notification.js'
import { AbuseReport } from '../src/models/AbuseReport.js'
import mongoose from 'mongoose'

const DEMO_BASE_LOCATION = { lat: 16.5062, lng: 80.648 }

function offsetLocation(base, meters) {
  return {
    lat: base.lat + (meters / 111000),
    lng: base.lng + (meters / (111000 * Math.cos((base.lat * Math.PI) / 180))),
  }
}

async function seed() {
  if (!process.argv.includes('--confirm')) {
    console.error('This script deletes ALL existing data. Run it with --confirm to continue: npm run seed -- --confirm')
    process.exit(1)
  }
  const demoPassword = crypto.randomBytes(9).toString('base64url')
  await connectDB()
  console.log('Clearing existing data...')
  await Promise.all([
    User.deleteMany({}),
    Report.deleteMany({}),
    RescueCase.deleteMany({}),
    Notification.deleteMany({}),
    AbuseReport.deleteMany({}),
  ])

  console.log('Creating admin account...')
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@pawrescue.example.org'
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || crypto.randomBytes(9).toString('base64url')
  await User.create({
    name: 'Alex Morgan',
    email: adminEmail,
    passwordHash: await bcrypt.hash(adminPassword, 12),
    role: 'admin',
    phone: '(555) 010-0001',
    verificationStatus: 'Verified',
  })

  console.log('Creating demo users...')
  const citizen = await User.create({
    name: 'Maya Chen',
    email: 'maya.chen@example.com',
    passwordHash: await bcrypt.hash(demoPassword, 12),
    role: 'citizen',
    phone: '(555) 010-2231',
    verificationStatus: 'Not Required',
  })

  const volunteer1 = await User.create({
    name: 'Jordan Reyes',
    email: 'jordan.reyes@example.com',
    passwordHash: await bcrypt.hash(demoPassword, 12),
    role: 'volunteer',
    phone: '(555) 010-4408',
    verificationStatus: 'Verified',
    skills: ['First aid', 'Animal transport', 'Fostering'],
    supportedAnimals: ['Stray dog', 'Stray cat', 'Injured wildlife'],
    serviceArea: 'Riverside and Eastside (demo area)',
    availability: 'Weekends and weekday evenings',
    isOnline: true,
  })

  const volunteer2 = await User.create({
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    passwordHash: await bcrypt.hash(demoPassword, 12),
    role: 'volunteer',
    phone: '(555) 010-9920',
    verificationStatus: 'Pending',
    skills: ['Wildlife handling', 'Transport'],
    supportedAnimals: ['Bird', 'Injured wildlife'],
    serviceArea: 'Hilltop and Lakeside (demo area)',
    availability: 'Mornings',
    isOnline: false,
  })

  const org = await User.create({
    name: 'Harbor Animal Rescue',
    email: 'team@harbor-rescue.example.org',
    passwordHash: await bcrypt.hash(demoPassword, 12),
    role: 'organization',
    phone: '(555) 010-6650',
    verificationStatus: 'Verified',
    orgDescription: 'A volunteer-run rescue operating shelters, foster homes, and a mobile transport van (demo profile).',
    address: '200 Harbor Road, Demo City (demo address)',
    skills: ['Shelter care', 'Transport', 'Veterinary liaison'],
    supportedAnimals: ['Stray dog', 'Stray cat', 'Cattle', 'Bird'],
    serviceArea: 'Citywide and harbor district (demo)',
    capacity: { max: 20, current: 14 },
    isOnline: true,
  })

  console.log('Creating demo reports...')
  const reports = [
    { animalType: 'Stray dog', emergencyType: 'Injured', severity: 'Critical', landmark: 'Riverside Park bench near entrance', offset: 300 },
    { animalType: 'Stray cat', emergencyType: 'Trapped', severity: 'High', landmark: 'Eastside alley behind 5th Street', offset: -200 },
    { animalType: 'Bird', emergencyType: 'Injured', severity: 'Normal', landmark: 'Lakeside trail under oak tree', offset: 500 },
    { animalType: 'Stray dog', emergencyType: 'Abandoned', severity: 'High', landmark: 'Harbor Road bus stop', offset: -400 },
    { animalType: 'Cattle', emergencyType: 'Endangered', severity: 'Critical', landmark: 'North pasture near highway', offset: 800 },
    { animalType: 'Injured wildlife', emergencyType: 'Injured', severity: 'High', landmark: 'Hilltop nature reserve trail', offset: -600 },
    { animalType: 'Stray dog', emergencyType: 'Abused', severity: 'Critical', landmark: 'Industrial district warehouse 12', offset: 1000 },
    { animalType: 'Stray cat', emergencyType: 'Abandoned', severity: 'Normal', landmark: 'Residential area near school', offset: -300 },
    { animalType: 'Stray dog', emergencyType: 'Trapped', severity: 'High', landmark: 'Construction site on 3rd Avenue', offset: 200 },
    { animalType: 'Bird', emergencyType: 'Other', severity: 'Normal', landmark: 'City center plaza', offset: -100 },
  ]

  for (let index = 0; index < reports.length; index++) {
    const r = reports[index]
    const loc = offsetLocation(DEMO_BASE_LOCATION, r.offset)
    const caseRef = `PR-${1001 + index}`
    const createdAt = new Date(Date.now() - (index + 1) * 3600000)

    const report = await Report.create({
      caseRef,
      reporterId: citizen._id,
      animalType: r.animalType,
      emergencyType: r.emergencyType,
      description: `A ${r.animalType.toLowerCase()} was spotted in the ${r.landmark.toLowerCase()} area. The animal appears to need immediate assistance.`,
      severity: r.severity,
      priority: r.severity,
      priorityReason: `Severity marked as ${r.severity}.`,
      status: 'Reported',
      location: { type: 'Point', coordinates: [loc.lng, loc.lat] },
      landmark: r.landmark,
      observedAt: createdAt,
      createdAt,
      updatedAt: createdAt,
    })

    await RescueCase.create({ reportId: report._id, status: 'Reported' })
  }

  console.log('Creating sample notifications...')
  await Notification.create({
    userId: citizen._id,
    category: 'account',
    title: 'Welcome to PawRescue',
    body: 'Your account is ready. You can now report animals in need.',
    read: false,
  })
  await Notification.create({
    userId: volunteer1._id,
    category: 'rescue',
    title: 'New case available',
    body: 'A nearby case matches your skills and service area.',
    read: false,
  })

  console.log('Creating sample abuse reports...')
  await AbuseReport.create({
    caseRef: 'PR-1007',
    reportedBy: citizen._id,
    reason: 'Possible duplicate of an existing case',
    status: 'Open',
  })
  await AbuseReport.create({
    caseRef: 'PR-1010',
    reportedBy: volunteer1._id,
    reason: 'Location appears incorrect on the map',
    status: 'Open',
  })

  console.log('\nSeed complete!')
  console.log(`Admin account: ${adminEmail}`)
  if (!process.env.ADMIN_BOOTSTRAP_PASSWORD) console.log(`Generated admin password (shown once): ${adminPassword}`)
  console.log('Demo accounts: maya.chen@example.com, jordan.reyes@example.com, team@harbor-rescue.example.org')
  console.log(`Demo accounts password (shown once): ${demoPassword}`)

  await mongoose.connection.close()
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
