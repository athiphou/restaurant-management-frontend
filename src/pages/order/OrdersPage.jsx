import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import * as orderApi from '../../api/order'
import * as restaurantApi from '../../api/restaurant'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import {
  ORDER_STATUSES,
  ORDER_TYPES,
  ORDER_FLOW,
  DELIVERY_FLOW,
  orderStatus,
  orderType,
  paymentMethod,
  nextOrderStatus,
  isOrderActive,
} from '../../utils/orderMeta'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { classNames } from '../../utils/formatters'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Select } from '../../components/ui/Input'
import { Modal } from '../../components/common/Modal'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { Skeleton } from '../../components/common/Skeleton'
import { OrderProgressTracker } from '../../components/customer/OrderProgressTracker'
import { FoodImage } from '../../components/customer/FoodImage'

const money = (v) => Number(v) || 0
const custName = (o) => o.customer?.name || o.customer_name || (o.customer_id ? `Customer #${o.customer_id}` : 'Guest')
const custPhone = (o) => o.customer?.phone || o.customer_phone || o.phone || ''
const payOf = (o) => o.payment_method || o.payment?.method || 'cash'

export default function OrdersPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const { id: routeId } = useParams()
  const branches = useApi(restaurantApi.listRestaurantBranches, [])

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('newest')
  const [openId, setOpenId] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    orderApi
      .listOrders()
      .then((res) => setOrders(res?.data || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (routeId) setOpenId(Number(routeId)) }, [routeId])

  const branchName = (id) => branches.data?.find((b) => b.id === id)?.name || (id ? `#${id}` : '—')

  const counts = useMemo(() => {
    const c = { all: orders.length }
    for (const o of orders) c[(o.status || 'pending').toLowerCase()] = (c[(o.status || 'pending').toLowerCase()] || 0) + 1
    return c
  }, [orders])

  const filtered = useMemo(() => {
    let list = orders
    if (status !== 'all') list = list.filter((o) => (o.status || '').toLowerCase() === status)
    if (type !== 'all') list = list.filter((o) => (o.order_type || '').toLowerCase() === type)
    const needle = q.trim().toLowerCase()
    if (needle)
      list = list.filter((o) =>
        `${o.order_number || o.id} ${custName(o)} ${o.notes || ''}`.toLowerCase().includes(needle),
      )
    list = [...list]
    if (sort === 'newest') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    else if (sort === 'oldest') list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    else if (sort === 'amount-desc') list.sort((a, b) => money(b.grand_total) - money(a.grand_total))
    else if (sort === 'amount-asc') list.sort((a, b) => money(a.grand_total) - money(b.grand_total))
    return list
  }, [orders, status, type, q, sort])

  const detail = useMemo(() => orders.find((o) => o.id === openId) || null, [orders, openId])

  const changeStatus = async (order, next) => {
    setBusyId(order.id)
    try {
      await orderApi.updateOrder(order.id, { status: next })
      toast.success(`Order #${order.order_number || order.id}`, `Status → ${orderStatus(next).label}`)
      await load()
    } catch (err) {
      toast.error('Update failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb="Operations"
        title="Orders"
        description="Track, filter and advance every customer order."
        action={
          <Button variant="secondary" icon="refresh" onClick={load}>Refresh</Button>
        }
      />

      {/* Status filter chips */}
      <div className="scrollbar-warm -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Chip active={status === 'all'} onClick={() => setStatus('all')} label="All" count={counts.all} />
        {ORDER_STATUSES.map((s) => (
          <Chip
            key={s.key}
            active={status === s.key}
            onClick={() => setStatus(s.key)}
            label={s.label}
            count={counts[s.key] || 0}
            dot={s.dot}
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" className="h-4 w-4" /></span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order #, customer…"
            className="h-10 w-full rounded-full border border-line bg-white pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-auto min-w-[150px]">
          <option value="all">All types</option>
          {ORDER_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-auto min-w-[160px]">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="amount-desc">Amount: high → low</option>
          <option value="amount-asc">Amount: low → high</option>
        </Select>
        <span className="ml-auto text-sm text-muted">{loading ? '…' : `${filtered.length} orders`}</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        {error ? (
          <EmptyState icon="alert" message="Couldn’t load orders" hint="Check your session and try again." action={<Button variant="secondary" icon="refresh" onClick={load}>Retry</Button>} />
        ) : loading ? (
          <div className="divide-y divide-line">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-10" /></div>)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="receipt" message="No orders match" hint="Try clearing the filters." action={<Button variant="secondary" onClick={() => { setQ(''); setStatus('all'); setType('all') }}>Reset</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-line bg-cream/50 text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Branch</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((o) => {
                  const st = orderStatus(o.status)
                  const ty = orderType(o.order_type)
                  const advance = nextOrderStatus(o.status)
                  return (
                    <tr key={o.id} className="transition hover:bg-cream/40">
                      <td className="px-4 py-3 font-semibold text-ink">#{o.order_number || o.id}</td>
                      <td className="px-4 py-3 text-ink">{custName(o)}</td>
                      <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-muted"><Icon name={ty.icon} className="h-4 w-4" />{ty.label}</span></td>
                      <td className="px-4 py-3 text-muted">{branchName(o.branch_id)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-700">{formatCurrency(money(o.grand_total))}</td>
                      <td className="px-4 py-3 text-muted">{paymentMethod(payOf(o)).label}</td>
                      <td className="px-4 py-3"><Badge tone={st.tone} dot>{st.label}</Badge></td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(o.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {advance && (
                            <button
                              type="button"
                              disabled={busyId === o.id}
                              onClick={() => changeStatus(o, advance)}
                              className="rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50"
                              title={`Advance to ${orderStatus(advance).label}`}
                            >
                              → {orderStatus(advance).label}
                            </button>
                          )}
                          <Button size="sm" variant="secondary" onClick={() => setOpenId(o.id)}>View</Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailModal
        order={detail}
        onClose={() => { setOpenId(null); if (routeId) navigate('/orders') }}
        branchName={branchName}
        busy={busyId === detail?.id}
        onChangeStatus={changeStatus}
      />
    </div>
  )
}

/* ---------- pieces ---------- */

function Chip({ active, onClick, label, count, dot }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
        active ? 'border-brand-700 bg-brand-700 text-white' : 'border-line bg-white text-ink hover:border-brand-300',
      )}
    >
      {dot && <span className={classNames('h-2 w-2 rounded-full', dot)} />}
      {label}
      <span className={classNames('rounded-full px-1.5 text-xs', active ? 'bg-white/20' : 'bg-cream-soft text-muted')}>{count}</span>
    </button>
  )
}

function OrderDetailModal({ order, onClose, branchName, busy, onChangeStatus }) {
  if (!order) return null
  const isDelivery = (order.order_type || '') === 'delivery'
  const statuses = isDelivery
    ? DELIVERY_STATUSES.filter((s) => DELIVERY_FLOW.includes(s.key))
    : ORDER_STATUSES.filter((s) => ORDER_FLOW.includes(s.key))
  const cancelled = (order.status || '') === 'cancelled'
  const items = order.items || order.order_items || []

  return (
    <Modal open={Boolean(order)} onClose={onClose} size="lg" title={`Order #${order.order_number || order.id}`}>
      <div className="space-y-6 p-5 sm:p-6">
        {/* status tracker */}
        <div>
          {cancelled ? (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              <Icon name="alert" className="h-5 w-5" /> This order was cancelled.
            </div>
          ) : (
            <OrderProgressTracker statuses={statuses} current={order.status} />
          )}
        </div>

        {/* meta grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Info label="Customer" icon="user" value={custName(order)} />
          <Info label="Phone" icon="phone" value={custPhone(order) || '—'} />
          <Info label="Order type" icon={orderType(order.order_type).icon} value={`${orderType(order.order_type).label}${order.table_id ? ` · Table #${order.table_id}` : ''}`} />
          <Info label="Branch" icon="store" value={branchName(order.branch_id)} />
          <Info label="Payment" icon="creditCard" value={`${paymentMethod(payOf(order)).label}`} />
          <Info label="Created" icon="clock" value={formatDate(order.created_at)} />
        </div>

        {order.notes && (
          <div className="rounded-xl bg-cream-soft px-4 py-3 text-sm text-ink">
            <span className="font-semibold">Notes: </span>{order.notes}
          </div>
        )}

        {/* items */}
        <div>
          <h4 className="mb-2 font-display text-base font-semibold text-ink">Items</h4>
          <div className="overflow-hidden rounded-xl border border-line">
            {items.length === 0 ? (
              <p className="p-4 text-sm text-muted">No item details available.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-line">
                  {items.map((l, i) => (
                    <tr key={i}>
                      <td className="flex items-center gap-2 px-3 py-2">
                        <FoodImage src={l.image || l.food?.image} alt="" className="h-8 w-8 rounded-lg" iconClass="h-4 w-4" />
                        <span className="text-ink">{l.name || l.food?.name || 'Dish'}</span>
                      </td>
                      <td className="px-3 py-2 text-center text-muted">×{l.quantity || l.qty || 1}</td>
                      <td className="px-3 py-2 text-right font-medium text-ink">{formatCurrency(money(l.price) * (l.quantity || l.qty || 1))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <dl className="mt-3 space-y-1 text-sm">
            <Sum label="Subtotal" value={formatCurrency(money(order.subtotal))} />
            {money(order.discount) > 0 && <Sum label="Discount" value={`− ${formatCurrency(money(order.discount))}`} />}
            <Sum label="Tax" value={formatCurrency(money(order.tax))} />
            {money(order.service_charge) > 0 && <Sum label="Service charge" value={formatCurrency(money(order.service_charge))} />}
            {money(order.delivery_fee) > 0 && <Sum label="Delivery fee" value={formatCurrency(money(order.delivery_fee))} />}
            <div className="flex items-center justify-between border-t border-line pt-2">
              <dt className="font-semibold text-ink">Grand total</dt>
              <dd className="font-display text-lg font-bold text-brand-700">{formatCurrency(money(order.grand_total))}</dd>
            </div>
          </dl>
        </div>

        {/* status controls */}
        <div className="rounded-2xl border border-line p-4">
          <h4 className="mb-3 font-display text-base font-semibold text-ink">Update status</h4>
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUSES.map((s) => {
              const active = (order.status || '').toLowerCase() === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  disabled={busy || active}
                  onClick={() => onChangeStatus(order, s.key)}
                  className={classNames(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60',
                    active ? 'border-brand-700 bg-brand-700 text-white' : 'border-line text-ink hover:border-brand-300 hover:bg-brand-50',
                  )}
                >
                  <span className={classNames('h-2 w-2 rounded-full', s.dot)} /> {s.label}
                </button>
              )
            })}
          </div>
          {isOrderActive(order.status) && (
            <div className="mt-3 border-t border-line pt-3">
              <Button
                variant="ghost"
                className="text-rose-600 hover:bg-rose-50"
                icon="x"
                disabled={busy}
                onClick={() => onChangeStatus(order, 'cancelled')}
              >
                Cancel this order
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

function Info({ label, icon, value }) {
  return (
    <div className="rounded-xl border border-line px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted"><Icon name={icon} className="h-3.5 w-3.5" /> {label}</p>
      <p className="mt-1 font-medium text-ink">{value}</p>
    </div>
  )
}

function Sum({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  )
}
