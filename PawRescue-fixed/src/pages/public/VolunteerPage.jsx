import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, HeartPulse, MapPin, Users, BadgeCheck, ClipboardList } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { PHOTOS } from '../../data/demoImages'

const BENEFITS = [
  { icon: ClipboardList, title: 'A focused case queue', text: 'See nearby cases that match your skills and availability, with distance labels and priority badges.' },
  { icon: MapPin, title: 'Location-aware cases', text: 'Open the rescue map, get directions, and update the case status as you travel and arrive.' },
  { icon: BadgeCheck, title: 'Verified profile', text: 'Upload documents during sign-up. An admin reviews them and marks your account Verified so reporters can trust the rescue.' },
  { icon: HeartPulse, title: 'Recovery tracking', text: 'Add evidence photos and recovery updates so reporters can follow the animal to a final outcome.' },
]

const ROLES_LIST = [
  'Animal transport',
  'Basic first aid',
  'Fostering during recovery',
  'Wildlife handling',
  'Shelter support',
]

export function VolunteerPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="Become a volunteer" title="Turn your skills into rescue" subtitle="Volunteers accept nearby cases, update their status, and help animals reach safety. Create a volunteer account to join the rescue network." />

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl shadow-card">
          <ImageWithFallback src={PHOTOS.dogInjuredVolunteer} alt="A volunteer comforting an injured dog" className="aspect-[4/3] w-full" />
        </div>
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="flex flex-col gap-2">
                  <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon className="size-5" /></span>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-ink-500">{item.text}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-4 rounded-3xl bg-forest-700 p-6 text-cream-50 sm:p-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-extrabold">What volunteers do</h2>
          <p className="mt-3 text-cream-100/80">Roles vary by skill. You can choose what fits you when you create an account.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {ROLES_LIST.map((role) => (
              <li key={role} className="flex items-center gap-2 text-sm font-semibold">
                <HeartHandshake className="size-4 text-teal-100" /> {role}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <Button as={Link} to="/register" variant="coral" size="lg">Create a volunteer account</Button>
          <Button as={Link} to="/how-it-works" variant="secondary" className="bg-cream-50 text-forest-700 hover:bg-cream-100">See how it works <ArrowRight className="size-4" /></Button>
          <p className="text-center text-xs text-cream-100/70"><Users className="mr-1 inline size-3.5" />Join the rescue network</p>
        </div>
      </div>
    </div>
  )
}
