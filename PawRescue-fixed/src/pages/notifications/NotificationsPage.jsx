import { Link } from 'react-router-dom'
import { Bell, CheckCheck, Clock } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/States'
import { useAuth, useNotifications, useToast } from '../../hooks/useContextHooks'
import { formatRelativeTime } from '../../utils/format'
import { clsx } from '../../components/common/clsx'

const CATEGORY_TONES = {
  rescue: 'teal',
  report: 'forest',
  account: 'amber',
  system: 'neutral',
}

export function NotificationsPage() {
  const { user } = useAuth()
  const { items, loading, unreadCount, markRead, markAllRead } = useNotifications()
  const { showToast } = useToast()

  const handleMarkAll = async () => {
    try {
      await markAllRead()
      showToast('All notifications marked as read', 'success')
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  const handleOpen = async (item) => {
    if (item.read) return
    try {
      await markRead(item.id)
    } catch (error) {
      showToast(error.message, 'error')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        eyebrow="Notifications"
        title="Your updates"
        subtitle={user ? `Updates for ${user.name}.` : 'Sign in to see notifications for your account.'}
        actions={
          user && unreadCount > 0 ? (
            <Button variant="secondary" size="sm" onClick={handleMarkAll}>
              <CheckCheck className="size-4" /> Mark all as read
            </Button>
          ) : null
        }
      />

      <div className="mt-8">
        {!user ? (
          <EmptyState icon={Bell} title="Not signed in" description="Sign in to see notifications for your account." action={<Button as={Link} to="/login">Sign in</Button>} />
        ) : loading ? (
          <LoadingState label="Loading notifications" />
        ) : items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications yet" description="Updates about your cases and account will appear here." />
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleOpen(item)}
                  className={clsx(
                    'flex w-full gap-3 rounded-2xl border bg-white p-4 text-left transition-shadow hover:shadow-card-hover',
                    item.read ? 'border-stone-200' : 'border-teal-500/40 bg-teal-50/40',
                  )}
                >
                  <span className={clsx('mt-1.5 size-2.5 shrink-0 rounded-full', item.read ? 'bg-stone-300' : 'bg-coral-500')} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={CATEGORY_TONES[item.category] || 'neutral'}>{item.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-ink-500">
                        <Clock className="size-3" /> {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 font-bold text-ink-900">{item.title}</p>
                    <p className="mt-1 text-sm text-ink-700">{item.body}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
