import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { Logo } from './Logo'

const FOOTER_LINKS = [
  { to: '/about', label: 'About Us' },
  { to: '/safety', label: 'Safety Guidance' },
  { to: '/contact', label: 'Contact' },
  { to: '/map', label: 'Find Rescues' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-forest-800 bg-forest-900 text-cream-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo className="[&_span:first-child]:bg-cream-50 [&_span:first-child]:text-forest-700" />
          <p className="mt-4 max-w-md text-sm text-cream-100/80">
            PawRescue connects citizens who find animals in need with nearby volunteers and rescue organizations across India.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-100">
            <ShieldCheck className="size-4" /> Verified responders only
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-cream-50">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-cream-100/80 hover:text-cream-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-cream-50">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream-100/80">
            <li className="flex items-center gap-2"><Mail className="size-4 shrink-0" /> hello@pawrescue.in</li>
            <li className="flex items-center gap-2"><Phone className="size-4 shrink-0" /> +91 80 4567 8900</li>
            <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0" /> Vijayawada, Andhra Pradesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-forest-800 px-4 py-5 text-center text-xs text-cream-100/60 sm:px-6">
        PawRescue — Animal rescue coordination for India.
      </div>
    </footer>
  )
}
