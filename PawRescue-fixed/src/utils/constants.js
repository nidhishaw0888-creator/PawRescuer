export const ROLES = {
  CITIZEN: 'citizen',
  VOLUNTEER: 'volunteer',
  ORGANIZATION: 'organization',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  citizen: 'Citizen',
  volunteer: 'Volunteer',
  organization: 'Rescue Organization',
  admin: 'Administrator',
}

export const ROLE_HOME = {
  citizen: '/dashboard/citizen',
  volunteer: '/dashboard/volunteer',
  organization: '/dashboard/organization',
  admin: '/dashboard/admin',
}

export const ANIMAL_TYPES = ['Stray dog', 'Stray cat', 'Bird', 'Cattle', 'Injured wildlife', 'Other']

export const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

export const EMERGENCY_TYPES = ['Injured', 'Abandoned', 'Trapped', 'Abused', 'Endangered', 'Other']

export const SEVERITY_LEVELS = ['Critical', 'High', 'Normal']

export const RESCUE_STATUSES = ['Reported', 'Accepted', 'En Route', 'On Scene', 'Rescued', 'In Care', 'Resolved']

export const STATUS_TRANSITIONS = {
  Reported: ['Accepted'],
  Accepted: ['En Route'],
  'En Route': ['On Scene'],
  'On Scene': ['Rescued'],
  Rescued: ['In Care'],
  'In Care': ['Resolved'],
  Resolved: [],
}

export const ACTIVE_STATUSES = ['Accepted', 'En Route', 'On Scene', 'Rescued', 'In Care']

export const VERIFICATION_STATUSES = ['Pending', 'Verified', 'Rejected']

export const RECOVERY_OUTCOMES = ['Recovered', 'Reunited', 'Adopted', 'Transferred', 'Other']

export const ACCOUNT_TYPES = [
  { value: 'citizen', label: 'Citizen', description: 'Report animals in need and follow their rescue.' },
  { value: 'volunteer', label: 'Volunteer', description: 'Accept nearby cases and help in the field.' },
  { value: 'organization', label: 'Rescue Organization', description: 'Receive requests and manage a rescue team.' },
]

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE_MB = 5
export const MAX_PHOTOS = 6

export const INDIA_MAP_VIEW = { center: { lat: 16.5062, lng: 80.648 }, zoom: 7, label: 'Andhra Pradesh' }

export const DEFAULT_MAP_CENTER = { lat: 16.5062, lng: 80.648, label: 'Andhra Pradesh, India' }
