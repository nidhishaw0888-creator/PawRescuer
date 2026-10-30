import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft, ClipboardList, Heart, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import { Logo } from '../layout/Logo'
import { Badge } from '../common/Badge'
import { useAuth } from '../../hooks/useContextHooks'
import { useNotifications } from '../../hooks/useContextHooks'
import { ROLE_HOME, ROLE_LABELS } from '../../utils/constants'
import { clsx } from '../common/clsx'

const NAV_BY_ROLE = {
  citizen: [
    { to: '/dashboard/citizen', label: 'Overview', end: true, icon: LayoutDashboard },
    { to: '/dashboard/citizen/reports', label: 'My Reports', icon: ClipboardList },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ],
  volunteer: [
    { to: '/dashboard/volunteer', label: 'Available Cases', end: true, icon: Heart },
    { to: '/dashboard/volunteer/active', label: 'Active Rescues', icon: ClipboardList },
    { to: '/dashboard/volunteer/history', label: 'Completed', icon: ClipboardList },
    { to: '/dashboard/volunteer/profile', label: 'Profile', icon: Users },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ],
  organization: [
    { to: '/dashboard/organization', label: 'Overview', end: true, icon: LayoutDashboard },
    { to: '/dashboard/organization/queue', label: 'Incoming Queue', icon: ClipboardList },
    { to: '/dashboard/organization/team', label: 'Team', icon: Users },
    { to: '/dashboard/organization/profile', label: 'Profile', icon: Users },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ],
  admin: [
    { to: '/dashboard/admin', label: 'Overview', end: true, icon: LayoutDashboard },
    { to: '/dashboard/admin/reports', label: 'Reports', icon: ClipboardList },
    { to: '/dashboard/admin/users', label: 'Users', icon: Users },
    { to: '/dashboard/admin/verifications', label: 'Verifications', icon: Heart },
    { to: '/dashboard/admin/review', label: 'Case Review', icon: ClipboardList },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ],
}

export function DashboardLayout({ children }) {
  const { user, signOut } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!user) return null
  const links = NAV_BY_ROLE[user.role] || []

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-4 lg:hidden">
        <Logo />
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-ink-700 hover:bg-stone-100" aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <div className="hidden px-4 py-4 lg:block">
        <Link to="/" className="inline-block">
          <Logo compact />
        </Link>
      </div>
      <div className="mx-4 mb-3 rounded-xl bg-forest-50 px-3 py-3">
        <p className="truncate text-sm font-bold text-forest-700">{user.name}</p>
        <Badge tone="teal" className="mt-1">{ROLE_LABELS[user.role]}</Badge>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    clsx('flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors', isActive ? 'bg-forest-600 text-cream-50' : 'text-ink-700 hover:bg-stone-100')
                  }
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1">{link.label}</span>
                  {link.label === 'Notifications' && unreadCount > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-coral-500 text-[10px] font-bold text-cream-50">{unreadCount}</span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-stone-200 p-3">
        <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-700 hover:bg-stone-100">
          <ChevronLeft className="size-4" /> Back to site
        </Link>
        <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-coral-700 hover:bg-coral-50">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex max-w-[100rem]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-stone-200 bg-cream-50 lg:block">
          {SidebarContent}
        </aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" className="absolute inset-0 bg-ink-900/50" aria-label="Close menu" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-cream-50 shadow-card-hover">{SidebarContent}</div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-stone-200 bg-cream-50 px-4 py-3 lg:hidden">
            <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-ink-700 hover:bg-stone-100" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <Link to={ROLE_HOME[user.role]} className="text-sm font-bold text-forest-700">
              {ROLE_LABELS[user.role]} dashboard
            </Link>
            <Link to="/notifications" className="relative rounded-lg p-2 text-ink-700 hover:bg-stone-100" aria-label="Notifications">
              <Bell className="size-5" />
              {unreadCount > 0 && <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-coral-500 text-[9px] font-bold text-cream-50">{unreadCount}</span>}
            </Link>
          </div>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
