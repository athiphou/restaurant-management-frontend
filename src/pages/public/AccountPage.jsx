import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useApi } from '../../hooks/useApi'
import * as orderApi from '../../api/order'
import * as customerApi from '../../api/customer'
import * as promotionApi from '../../api/promotion'
import { ApiError } from '../../api/client'
import { orderStatus, orderType } from '../../utils/orderMeta'
import { formatCurrency } from '../../utils/formatters'
import { classNames } from '../../utils/formatters'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/common/Modal'
import { EmptyState } from '../../components/common/EmptyState'
import { Skeleton } from '../../components/common/Skeleton'

const TABS = [
  { key: 'orders', label: 'My Orders', icon: 'receipt' },
  { key: 'profile', label: 'Profile', icon: 'user' },
  { key: 'addresses', label: 'Addresses', icon: 'mapPin' },
  { key: 'promotions', label: 'Promotions', icon: 'percent' },
]

const emptyAddress = () => ({ id: null, label: '', address: '', city: '', phone: '', is_default: false })

export default function AccountPage() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const [tab, setTab] = useState('orders')

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20">
        <EmptyState
          icon="userCircle"
          message="Sign in to view your account"
          hint="Track orders, save addresses and manage your profile."
          action={<Link to="/login"><Button icon="logout">Sign in</Button></Link>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-700 font-display text-xl font-bold text-white">
            {(user?.name || 'U').slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{user?.name || 'Guest'}</h1>
            <p className="text-sm text-muted">{user?.email || 'Welcome back'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/dashboard">
              <Button variant="primary" icon="grid">Admin console</Button>
            </Link>
          )}
          <Button variant="secondary" icon="logout" onClick={logout}>Log out</Button>
        </div>
      </div>

      <div className="scrollbar-warm mt-6 flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={classNames(
              'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition',
              tab === t.key ? 'bg-brand-700 text-white' : 'text-ink hover:bg-brand-50',
            )}
          >
            <Icon name={t.icon} className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'orders' && <OrdersTab />}
        {tab === 'profile' && <ProfileTab user={user} />}
        {tab === 'addresses' && <AddressesTab userId={user?.id} />}
        {tab === 'promotions' && <PromotionsTab />}
      </div>
    </div>
  )
}

function OrdersTab() {
  const { data, loading, error } = useApi(orderApi.listOrders, [])
  const orders = data || []
  if (loading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
  if (error) return <EmptyState icon="alert" message="Couldn’t load your orders" />
  if (orders.length === 0)
    return <EmptyState icon="receipt" message="No orders yet" hint="Your placed orders will show up here." action={<Link to="/menu"><Button>Browse menu</Button></Link>} />

  return (
    <div className="space-y-3">
      {orders.map((o) => {
        const st = orderStatus(o.status)
        const first = o.items?.[0] || o.order_items?.[0]
        return (
          <div key={o.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700"><Icon name={orderType(o.order_type).icon} className="h-5 w-5" /></span>
                <div>
                  <p className="font-semibold text-ink">#{o.order_number || o.id}</p>
                  <p className="text-xs text-muted">{orderType(o.order_type).label}{first ? ` · ${first.quantity || first.qty}× ${first.name || first.food?.name || ''}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-bold text-brand-700">{formatCurrency(Number(o.grand_total) || 0)}</span>
                <Badge tone={st.tone} dot>{st.label}</Badge>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Link to={`/tracking?order=${o.order_number || o.id}`}>
                <Button size="sm" variant="secondary" iconRight="arrowRight">Track order</Button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProfileTab({ user }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" icon="user" value={user?.name || '—'} />
      <Field label="Email" icon="mail" value={user?.email || '—'} />
      <Field label="Phone" icon="phone" value={user?.phone || 'Not provided'} />
      <Field label="Account type" icon="shield" value={user?.roles?.[0]?.name || user?.role || 'Customer'} />
    </div>
  )
}
function Field({ label, icon, value }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted"><Icon name={icon} className="h-3.5 w-3.5" /> {label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  )
}

function PromotionsTab() {
  const { data, loading } = useApi(promotionApi.listPromotions, [])
  const promos = (data || []).filter((p) => p.is_active !== false)
  if (loading) return <Skeleton className="h-24" />
  if (promos.length === 0) return <EmptyState icon="percent" message="No promotions right now" />
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {promos.map((p) => (
        <div key={p.id} className="flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gold-600">
              {p.discount_type === 'percentage' ? `${Math.round(Number(p.discount_value))}% OFF` : `${formatCurrency(Number(p.discount_value))} OFF`}
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-ink">{p.name}</p>
            {p.end_date && <p className="text-xs text-muted">Ends {new Date(p.end_date).toLocaleDateString()}</p>}
          </div>
          <span className="rounded-xl border-2 border-dashed border-gold-400 bg-gold-50 px-4 py-2 font-display text-lg font-bold tracking-wider text-brand-800">{p.code}</span>
        </div>
      ))}
    </div>
  )
}

function AddressesTab({ userId }) {
  const toast = useToast()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(emptyAddress())
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    customerApi
      .listAddresses(userId)
      .then((res) => setList(res?.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => { load() }, [load])

  const openNew = () => { setDraft(emptyAddress()); setErrors({}); setOpen(true) }
  const openEdit = (a) => { setDraft({ id: a.id, label: a.label || '', address: a.address || a.address_line_1 || '', city: a.city || '', phone: a.phone || '', is_default: Boolean(a.is_default) }); setErrors({}); setOpen(true) }

  const save = async () => {
    if (!draft.address.trim()) { setErrors({ address: 'Address is required' }); return }
    setSaving(true)
    try {
      const payload = { customer_id: userId, label: draft.label, address: draft.address, city: draft.city, phone: draft.phone, is_default: draft.is_default }
      if (draft.id) await customerApi.updateAddress(draft.id, payload)
      else await customerApi.createAddress(payload)
      toast.success(draft.id ? 'Address updated' : 'Address saved')
      setOpen(false)
      load()
    } catch (err) {
      const fe = err instanceof ApiError ? err.data?.errors : null
      if (fe) setErrors(fe)
      toast.error('Could not save address', err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    try {
      await customerApi.deleteAddress(id)
      toast.success('Address removed')
      load()
    } catch (err) {
      toast.error('Could not delete', err.message)
    }
  }

  if (loading) return <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{list.length} saved {list.length === 1 ? 'address' : 'addresses'}</p>
        <Button size="sm" icon="plus" onClick={openNew}>Add address</Button>
      </div>
      {list.length === 0 ? (
        <EmptyState icon="mapPin" message="No saved addresses" hint="Add one to check out faster next time." action={<Button icon="plus" onClick={openNew}>Add address</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((a) => (
            <div key={a.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-ink">
                    <Icon name="mapPin" className="h-4 w-4 text-brand-600" /> {a.label || 'Home'}
                    {a.is_default && <Badge tone="gold" className="ml-1">Default</Badge>}
                  </p>
                  <p className="mt-1 text-sm text-muted">{a.address || a.address_line_1 || ''}{a.city ? `, ${a.city}` : ''}</p>
                  {a.phone && <p className="text-sm text-muted">{a.phone}</p>}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" icon="edit" onClick={() => openEdit(a)}>Edit</Button>
                <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" icon="trash" onClick={() => remove(a.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={draft.id ? 'Edit address' : 'Add address'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={save}>{draft.id ? 'Save changes' : 'Add address'}</Button>
          </div>
        }
      >
        <div className="space-y-4 p-5">
          <Input label="Label" placeholder="Home, Office…" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          <Input label="Address" placeholder="Street, building" value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} error={Array.isArray(errors.address) ? errors.address[0] : errors.address} />
          <Input label="City / district" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
          <Input label="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
        </div>
      </Modal>
    </div>
  )
}
