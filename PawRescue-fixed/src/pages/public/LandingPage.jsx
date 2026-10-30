import { Link } from 'react-router-dom'
import {
  ArrowRight,
  HeartHandshake,
  HeartPulse,
  LifeBuoy,
  MapPin,
  MessageSquareWarning,
  PawPrint,
  ShieldCheck,
  Siren,
  Users,
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { ReportCard } from '../../components/reports/ReportCard'
import { PageHeader } from '../../components/layout/PageHeader'
import { useRescues } from '../../hooks/useContextHooks'
import { PHOTOS } from '../../data/demoImages'

const STATS = [
  { label: 'Reports filed', value: '1,240', icon: MessageSquareWarning },
  { label: 'Rescues completed', value: '980', icon: HeartPulse },
  { label: 'Active volunteers', value: '320', icon: Users },
  { label: 'Partner organizations', value: '24', icon: HeartHandshake },
]

const STEPS = [
  { icon: MessageSquareWarning, title: 'Report', text: 'Describe the animal, its condition, and the location with a photo.' },
  { icon: Siren, title: 'Connect', text: 'Nearby volunteers and organizations are matched to the case.' },
  { icon: LifeBuoy, title: 'Rescue', text: 'A responder accepts the case and heads to the animal.' },
  { icon: HeartPulse, title: 'Recover', text: 'Follow the case timeline through care and a final outcome.' },
]

const WHY = [
  { icon: Siren, title: 'Quick reporting', text: 'A guided multi-step form captures the details responders need most.' },
  { icon: MapPin, title: 'Location-based rescue', text: 'An interactive map shows nearby cases and lets responders navigate.' },
  { icon: ShieldCheck, title: 'Transparent tracking', text: 'Each case has a public timeline so reporters can follow progress.' },
  { icon: HeartHandshake, title: 'Verified rescuers', text: 'Volunteers and organizations pass verification before receiving cases.' },
]

export function LandingPage() {
  const { reports } = useRescues()
  const featured = reports.slice(0, 3)

  return (
    <div>
      <section className="relative overflow-hidden bg-cream-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="fade-up">
            <Badge tone="forest" className="mb-4">
              <PawPrint className="size-3.5" /> Emergency Animal Rescue
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-forest-700 sm:text-5xl">
              Every Paw Deserves a Chance.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-700">
              PawRescue connects people who find injured, abandoned, or trapped animals with nearby volunteers and rescue organizations, so help arrives faster and every case can be followed to a safe outcome.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button as={Link} to="/report-emergency" variant="coral" size="lg">
                <Siren className="size-5" /> Report an Emergency
              </Button>
              <Button as={Link} to="/volunteer" variant="secondary" size="lg">
                Become a Volunteer <ArrowRight className="size-4" />
              </Button>
            </div>
            <p className="mt-4 text-xs text-ink-500">Connect with verified volunteers and rescue organizations across India.</p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-card-hover">
              <ImageWithFallback
                src={PHOTOS.dogVolunteerHug}
                alt="A rescue volunteer holding a dog"
                className="aspect-[4/3] w-full"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl bg-white p-4 shadow-card-hover sm:block">
              <p className="flex items-center gap-2 text-sm font-bold text-forest-700">
                <HeartPulse className="size-5 text-coral-500" /> Active cases nearby
              </p>
              <p className="text-xs text-ink-500">Live from recent reports</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest-700 py-12 text-cream-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-teal-100">Platform impact</p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="rounded-2xl bg-cream-50/10 p-5 text-center">
                  <Icon className="mx-auto size-7 text-teal-100" />
                  <p className="mt-2 text-2xl font-extrabold sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-cream-100/80">{stat.label}</p>
                </div>
              )
            })}
          </div>
          <p className="mt-6 text-center text-xs text-cream-100/70">Figures reflect activity on the platform.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageHeader
          eyebrow="How it works"
          title="From a first report to a safe outcome"
          subtitle="Four steps guide every case from the moment someone spots an animal in need to recovery."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-700">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-teal-600">Step {index + 1}</span>
                </div>
                <h3 className="text-base font-bold">{step.title}</h3>
                <p className="text-sm text-ink-500">{step.text}</p>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="bg-cream-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <PageHeader
            eyebrow="Featured emergencies"
            title="Cases needing attention right now"
            subtitle="Cases reported by the community that need attention. Open any case to see its full details and timeline."
            actions={<Button as={Link} to="/map" variant="secondary">View rescue map <ArrowRight className="size-4" /></Button>}
          />
          {featured.length ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-ink-500">No cases reported yet. Be the first to report an animal in need.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="Why PawRescue" title="Built for fast, transparent rescue" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="flex flex-col gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-bold">{item.title}</h3>
                <p className="text-sm text-ink-500">{item.text}</p>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="bg-forest-700 py-16 text-cream-50">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Volunteers make rescue possible</h2>
            <p className="mt-3 text-cream-100/80">
              Whether you can transport animals, offer first aid, or foster during recovery, your skills help close the gap between a report and a safe outcome. Create a volunteer account to join the rescue network.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button as={Link} to="/register" variant="coral">Create a volunteer account</Button>
              <Button as={Link} to="/how-it-works" variant="secondary" className="bg-cream-50 text-forest-700 hover:bg-cream-100">Learn the process</Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-card-hover">
            <ImageWithFallback src={PHOTOS.dogInjuredVolunteer} alt="A volunteer comforting an injured dog" className="aspect-[4/3] w-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PageHeader eyebrow="Safety & guidance" title="Report responsibly, stay safe" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="flex flex-col gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-coral-50 text-coral-600"><ShieldCheck className="size-5" /></span>
            <h3 className="font-bold">Keep your distance</h3>
            <p className="text-sm text-ink-500">An injured or frightened animal may bite or flee. Observe from a safe distance and do not attempt to handle wildlife without guidance.</p>
          </Card>
          <Card className="flex flex-col gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700"><MapPin className="size-5" /></span>
            <h3 className="font-bold">Pin the location</h3>
            <p className="text-sm text-ink-500">A precise location is the most useful detail you can provide. Use GPS or drop a pin on the map.</p>
          </Card>
          <Card className="flex flex-col gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-700"><Siren className="size-5" /></span>
            <h3 className="font-bold">Let responders take over</h3>
            <p className="text-sm text-ink-500">Once a verified responder accepts, step back and follow the case timeline for updates.</p>
          </Card>
        </div>
        <div className="mt-6">
          <Button as={Link} to="/safety" variant="secondary">Read the full safety guide <ArrowRight className="size-4" /></Button>
        </div>
      </section>

      <section className="bg-cream-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <PageHeader eyebrow="Community voices" title="What people say about PawRescue" />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              { name: 'Maya, citizen', text: 'I reported a limping dog near my street and could follow the case all the way to a shelter. The timeline made the whole process feel transparent.' },
              { name: 'Jordan, volunteer', text: 'The available-cases queue lets me pick up nearby rescues that match my skills. Seeing the distance label helps me decide what I can reach.' },
              { name: 'Harbor Rescue, organization', text: 'The incoming queue and team view help us assign cases without phone tag. We can see capacity at a glance.' },
            ].map((item) => (
              <Card key={item.name} className="flex flex-col gap-3">
                <p className="text-sm text-ink-700">&ldquo;{item.text}&rdquo;</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">{item.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
