import { Link } from 'react-router-dom'
import { HeartHandshake, MapPin, ShieldCheck, Target, Users } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { PHOTOS } from '../../data/demoImages'

const VALUES = [
  { icon: HeartHandshake, title: 'Compassion first', text: 'Every animal deserves a humane response, regardless of species or circumstance.' },
  { icon: ShieldCheck, title: 'Trust through verification', text: 'Volunteers and organizations are verified before they receive cases, so reporters can trust the rescue.' },
  { icon: Target, title: 'Transparency', text: 'Public case timelines keep reporters informed from the first sighting to the final outcome.' },
  { icon: Users, title: 'Community-powered', text: 'Citizens, volunteers, and organizations each play a part in closing the gap to safety.' },
]

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="About PawRescue" title="A community safety net for animals in need" subtitle="PawRescue connects citizens, volunteers, and rescue organizations around a single goal: getting help to animals faster." />

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl shadow-card">
          <ImageWithFallback src={PHOTOS.dogCollie} alt="A cheerful dog" className="aspect-[4/3] w-full" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-forest-700">Our mission</h2>
          <p className="mt-3 text-ink-700">Animals in distress often go unseen. PawRescue makes it easy for anyone to report an animal in need and routes that report to nearby volunteers and organizations who can act. The platform tracks each case through rescue and recovery so no report disappears into a void.</p>
          <p className="mt-3 text-ink-700">PawRescue is built on Node.js, Express.js, and MongoDB. Reports are stored securely and routed to nearby responders who can act on them.</p>
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => {
          const Icon = value.icon
          return (
            <Card key={value.title} className="flex flex-col gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-700"><Icon className="size-5" /></span>
              <h3 className="font-bold">{value.title}</h3>
              <p className="text-sm text-ink-500">{value.text}</p>
            </Card>
          )
        })}
      </div>

      <div className="mt-12 rounded-3xl bg-forest-50 p-6 sm:p-10">
        <h2 className="text-xl font-bold">How to take part</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card><h3 className="font-bold">Report</h3><p className="mt-1 text-sm text-ink-500">Spot an animal in need? File a report in minutes.</p><Button as={Link} to="/report-emergency" variant="secondary" size="sm" className="mt-3">Report now</Button></Card>
          <Card><h3 className="font-bold">Volunteer</h3><p className="mt-1 text-sm text-ink-500">Accept nearby cases that match your skills.</p><Button as={Link} to="/register" variant="secondary" size="sm" className="mt-3">Join as volunteer</Button></Card>
          <Card><h3 className="font-bold">Explore</h3><p className="mt-1 text-sm text-ink-500">See active cases on the rescue map.</p><Button as={Link} to="/map" variant="secondary" size="sm" className="mt-3"><MapPin className="size-4" /> Open map</Button></Card>
        </div>
      </div>
    </div>
  )
}
