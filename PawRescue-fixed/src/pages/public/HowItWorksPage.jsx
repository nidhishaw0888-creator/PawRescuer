import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList, MapPin, LifeBuoy, Siren, ShieldCheck, PawPrint } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { PHOTOS } from '../../data/demoImages'

const STEPS = [
  { icon: ClipboardList, title: 'Report an animal in need', text: 'Open the report form, pick the animal and emergency type, describe the condition, and add photos so responders know what to expect.' },
  { icon: MapPin, title: 'Set the location', text: 'Use GPS, drop a pin on the map, or type coordinates and a landmark. A precise location is the single most useful detail you can provide.' },
  { icon: Siren, title: 'Match to responders', text: 'Nearby volunteers and organizations see the case in their queue. They accept it based on skills, distance, and availability.' },
  { icon: LifeBuoy, title: 'Rescue and recover', text: 'The responder updates the case status as they travel, arrive, and secure the animal. Reporters follow the timeline until a safe outcome.' },
]

const FAQ = [
  { q: 'Is this a real rescue service?', a: 'PawRescue connects citizens with verified volunteers and rescue organizations. For urgent, real-world emergencies, always contact local authorities as well.' },
  { q: 'Who can report an emergency?', a: 'Any visitor can open the report form. Creating an account lets you track the cases you file from your dashboard.' },
  { q: 'How are volunteers verified?', a: 'Volunteers and organizations upload documents during sign-up. An admin reviews them and marks the account Pending, Verified, or Rejected. Unverified accounts are never shown as verified.' },
  { q: 'What if GPS is unavailable?', a: 'The report form lets you drop a pin on the map or enter coordinates manually. It never pretends GPS was captured when permission was denied.' },
]

export function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="How it works" title="From a sighting to a safe outcome" subtitle="PawRescue guides every case through four clear steps, from the first report to recovery." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <Card key={step.title} className="flex flex-col gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-700"><Icon className="size-5" /></span>
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-sm text-ink-500">{step.text}</p>
            </Card>
          )
        })}
      </div>

      <div className="mt-12 grid items-center gap-8 rounded-3xl bg-forest-50 p-6 lg:grid-cols-2 lg:p-10">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-forest-700"><PawPrint className="size-6" /> Ready to help?</h2>
          <p className="mt-3 text-ink-700">File a report if you see an animal in need, or create a volunteer account to explore the responder workflow.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button as={Link} to="/report-emergency" variant="coral"><Siren className="size-5" /> Report an emergency</Button>
            <Button as={Link} to="/volunteer" variant="secondary">Become a volunteer <ArrowRight className="size-4" /></Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl shadow-card">
          <ImageWithFallback src={PHOTOS.dogVetCare} alt="A dog receiving veterinary care" className="aspect-[4/3] w-full" />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          {FAQ.map((item) => (
            <Card key={item.q} className="flex flex-col gap-2">
              <h3 className="flex items-center gap-2 font-bold"><ShieldCheck className="size-4 text-teal-600" /> {item.q}</h3>
              <p className="text-sm text-ink-500">{item.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
