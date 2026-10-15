import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { PageHeader } from '../../components/common/PageHeader'
import { Card, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Icon } from '../../components/ui/Icon'

export default function ProfilePage() {
  const { user, logout, isAdmin, refresh } = useAuth()
  const toast = useToast()

  const roles = (user?.roles || (user?.role ? [user.role] : [])).map((r) => (typeof r === 'string' ? r : r?.name)).filter(Boolean)
  const name = user?.name || 'Account'
  const since = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : null

  const doRefresh = async () => {
    try { await refresh(); toast.success('Profile refreshed') } catch { toast.error('Could not refresh') }
  }

  return (
    <div className="space-y-5">
      <PageHeader breadcrumb="Account" title="Profile" description="Your account details."
        action={<Button variant="secondary" icon="refresh" onClick={doRefresh}>Refresh</Button>} />

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Identity card */}
        <Card className="p-6 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-brand-700 font-display text-3xl font-bold text-gold-400">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-ink">{name}</h2>
          {user?.email && <p className="text-sm text-muted">{user.email}</p>}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {isAdmin && <Badge tone="gold" dot>Owner / Manager</Badge>}
            {roles.map((r) => <Badge key={r} tone="brand">{r}</Badge>)}
            {roles.length === 0 && !isAdmin && <Badge tone="gray">Customer</Badge>}
          </div>
          {since && <p className="mt-4 text-xs text-muted">Member since {since}</p>}
        </Card>

        {/* Details */}
        <div className="space-y-5">
          <Card className="p-6">
            <CardTitle title="Account details" caption="Read-only — managed by your administrator." />
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field icon="user" label="Full name" value={user?.name || '—'} />
              <Field icon="mail" label="Email" value={user?.email || '—'} />
              <Field icon="phone" label="Phone" value={user?.phone || 'Not provided'} />
              <Field icon="shield" label="Roles" value={roles.length ? roles.join(', ') : isAdmin ? 'Admin' : 'Customer'} />
            </dl>
          </Card>

          <Card className="p-6">
            <CardTitle title="Session" caption="Sign out of the admin console." />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="danger" icon="logout" onClick={logout}>Sign out</Button>
              <Link to="/dashboard">
                <Button variant="secondary" icon="home">Back to dashboard</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Field({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-line px-4 py-3">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted">
        <Icon name={icon} className="h-3.5 w-3.5" /> {label}
      </dt>
      <dd className="mt-1 font-medium text-ink">{value}</dd>
    </div>
  )
}
