import { AlertTriangle, Ban, Hand, Phone, ShieldAlert, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'

const GUIDELINES = [
  { icon: Hand, title: 'Do not handle frightened animals', text: 'Injured or scared animals may bite, scratch, or flee. Keep a safe distance and let trained responders take over.' },
  { icon: ShieldAlert, title: 'Do not approach wildlife', text: 'Wildlife can carry disease and behave unpredictably. Note the location and condition and leave handling to a wildlife-trained volunteer.' },
  { icon: Phone, title: 'Call local emergency services for road hazards', text: 'If an animal is loose on a road and creating a traffic danger, contact local traffic or animal control authorities in addition to filing a report.' },
  { icon: Ban, title: 'Do not put yourself at risk', text: 'Never enter traffic, climb structures, or enter private property without permission to reach an animal.' },
]

const INDIA_GUIDANCE = [
  { icon: Hand, title: 'Injured stray dogs and cats', text: 'Do not chase or corner the animal. Keep bystanders and children back and note the exact spot. Call 112 for an emergency, or your local municipal animal control or an authorized animal welfare organization.' },
  { icon: Ban, title: 'Cattle on roads and in the open', text: 'Keep a safe distance from horns and sudden movements. Cattle on highways are a traffic hazard, so call 112 or the local police first, then notify an authorized animal welfare organization or a veterinarian.' },
  { icon: ShieldAlert, title: 'Injured wildlife and snakes', text: 'Do not touch, feed, or move wildlife, including birds and snakes. Wildlife is protected under Indian law. Contact your state Forest Department or an authorized wildlife rescuer.' },
]

const DO_NOT = [
  'Attempt to capture wildlife without training',
  'Feed or give water to an animal you cannot identify safely',
  'Share the reporter’s personal details publicly',
  'Assume an animal is abandoned just because it is alone',
]

export function SafetyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="Safety guidance" title="Report responsibly, stay safe" subtitle="Your safety comes first. Use this guidance when you encounter an animal in distress. This is general information, not professional veterinary or rescue advice." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {GUIDELINES.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="flex flex-col gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-coral-50 text-coral-600"><Icon className="size-5" /></span>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-ink-500">{item.text}</p>
            </Card>
          )
        })}
      </div>

      <div className="mt-10 rounded-3xl border border-coral-100 bg-coral-50 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-coral-700"><AlertTriangle className="size-5" /> Please avoid</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {DO_NOT.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-semibold text-coral-700">
              <Ban className="mt-0.5 size-4 shrink-0" /> {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <Card className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 font-bold"><ShieldCheck className="size-5 text-teal-600" /> Trust verified responders</h2>
          <p className="text-sm text-ink-500">Only verified volunteers and organizations receive cases in the full platform. Always check the verification badge on a profile before sharing additional details.</p>
          <div className="mt-2"><Badge tone="teal">Verified</Badge> <Badge tone="amber">Pending</Badge> <Badge tone="coral">Rejected</Badge></div>
        </Card>
      </div>
    </div>
  )
}
