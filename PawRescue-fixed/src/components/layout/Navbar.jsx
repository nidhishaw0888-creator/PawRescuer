import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { useAuth } from '../../hooks/useContextHooks'
import { useNotifications } from '../../hooks/useContextHooks'
import { ROLE_HOME, ROLE_LABELS } from '../../utils/constants'
import { clsx } from '../common/clsx'

const PUBLIC_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/map', label: 'Find Rescues' },
  { to: '/volunteer', label: 'Become a Volunteer' },
  { to: '/about', label: 'About Us' },
]

export function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  const dashLink = user ? ROLE_HOME[user.role] : null

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-cream-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="PawRescue home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {PUBLIC_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  clsx('rounded-lg px-3 py-2 text-sm font-semibold transition-colors', isActive ? 'bg-forest-50 text-forest-700' : 'text-ink-700 hover:bg-stone-100')
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="relative rounded-lg p-2 text-ink-700 hover:bg-stone-100" aria-label={`Notifications, ${unreadCount} unread`}>
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-coral-500 text-[9px] font-bold text-cream-50">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative hidden sm:block">
                <button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink-700 hover:bg-stone-100">
                  <span className="grid size-7 place-items-center rounded-full bg-forest-100 text-forest-700">
                    <User className="size-4" />
                  </span>
                  <span className="max-w-[8rem] truncate">{user.name}</span>
                  <ChevronDown className="size-4 text-ink-500" />
                </button>
                {menuOpen && (
                  <>
                    <button type="button" className="fixed inset-0 z-10" aria-hidden="true" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-stone-200 bg-white p-2 shadow-card-hover">
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-bold">{user.name}</p>
                        <Badge tone="teal" className="mt-1">{ROLE_LABELS[user.role]}</Badge>
                      </div>
                      <div className="my-1 h-px bg-stone-100" />
                      {dashLink && (
                        <Link to={dashLink} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-stone-100">
                          <LayoutDashboard className="size-4" /> Dashboard
                        </Link>
                      )}
                      <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-coral-700 hover:bg-coral-50">
                        <LogOut className="size-4" /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to="/register" variant="primary" size="sm">
                Sign up
              </Button>
            </div>
          )}

          <button
            type="button"
            className="rounded-lg p-2 text-ink-700 hover:bg-stone-100 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-cream-50 px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {PUBLIC_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => clsx('block rounded-lg px-3 py-2.5 text-sm font-semibold', isActive ? 'bg-forest-50 text-forest-700' : 'text-ink-700 hover:bg-stone-100')}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {dashLink && (
                  <Button as={Link} to={dashLink} variant="secondary" onClick={() => setMobileOpen(false)}>
                    Go to dashboard
                  </Button>
                )}
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="secondary" onClick={() => setMobileOpen(false)}>
                  Log in
                </Button>
                <Button as={Link} to="/register" variant="primary" onClick={() => setMobileOpen(false)}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
