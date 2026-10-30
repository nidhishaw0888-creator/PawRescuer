import { Outlet, ScrollRestoration } from 'react-router-dom'
import { PHOTOS } from '../data/demoImages'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto grid min-h-screen max-w-6xl items-stretch gap-0 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src={PHOTOS.dogVolunteerHug}
            alt="A volunteer comforting a rescued dog"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
          <div className="absolute inset-0 flex items-end p-10">
            <blockquote className="max-w-md rounded-2xl bg-cream-50/95 p-6 shadow-card-hover">
              <p className="text-sm font-semibold text-forest-700">
                &ldquo;Every report through PawRescue helps a vulnerable animal reach safety. Join our network of citizens, volunteers, and rescue organizations across India.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-teal-600">PawRescue India</p>
            </blockquote>
          </div>
        </div>
      </div>
      <ScrollRestoration />
    </div>
  )
}
