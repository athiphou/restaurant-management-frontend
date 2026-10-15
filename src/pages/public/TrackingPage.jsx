import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useApi } from '../../hooks/useApi'
import * as orderApi from '../../api/order'
import {
  ORDER_STATUSES,
  DELIVERY_STATUSES,
  ORDER_FLOW,
  DELIVERY_FLOW,
  orderType,
  orderStatus,
  paymentMethod,
  shortTime,
} from '../../utils/orderMeta'
import { formatCurrency } from '../../utils/formatters'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { EmptyState } from '../../components/common/EmptyState'
import { OrderProgressTracker } from '../../components/customer/OrderProgressTracker'

const byKey = (list, key) => list.filter((s) => ORDER_FLOW.includes(s.key) || DELIVERY_FLOW.includes(s.key)).find((s) => s.key === key)

export default function TrackingPage() {
  const [params, setParams] = useSearchParams()
  const want = params.get('order') || ''
  const { isAuthenticated } = useAuth()
  const [query, setQuery] = useState(want)

  const orders = useApi(
    () => (isAuthenticated ? orderApi.listOrders() : Promise.resolve({ data: [] })),
    [isAuthenticated],
  )

  const local = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('rms.lastOrder')) || null
    } catch {
      return null
    }
  }, [])

  const order = useMemo(() => {
    if (!want) return null
    const list = orders.data || []
    const found =
      list.find((o) => String(o.order_number) === String(want) || String(o.id) === String(want)) ||
      (local && String(local.order_number || local.id) === String(want) ? local : null)
    return found || { order_number: want, status: 'pending', order_type: 'delivery' }
  }, [want, orders.data, local])

  const isDelivery = (order?.order_type || '') === 'delivery'
  const statuses = isDelivery
    ? DELIVERY_STATUSES.filter((s) => DELIVERY_FLOW.includes(s.key))
    : ORDER_STATUSES.filter((s) => ORDER_FLOW.includes(s.key))
  const cancelled = (order?.status || '') === 'cancelled'
  const flowKey = cancelled ? 'cancelled' : (order?.status || 'pending')

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Order tracking</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Where’s my order?</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const next = new URLSearchParams(params)
          if (query.trim()) next.set('order', query.trim())
          else next.delete('order')
          setParams(next, { replace: true })
        }}
        className="mt-6 flex items-end gap-2"
      >
        <Input label="Order number" icon="receipt" placeholder="e.g. ORD-1001" value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
        <Button type="submit" icon="search">Track</Button>
      </form>

      {!want ? (
        <div className="mt-8">
          <EmptyState
            icon="deliveries"
            message="Enter your order number"
            hint={isAuthenticated ? 'Or pick one of your recent orders below.' : 'You’ll find it on your confirmation screen and in My Orders.'}
          />
          {isAuthenticated && (orders.data || []).length > 0 && <RecentOrders orders={orders.data} onSelect={setQuery} />}
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.loading && !order ? (
            <EmptyState icon="clock" message="Looking up your order…" />
          ) : (
            <>
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Order</p>
                    <p className="font-display text-2xl font-bold text-ink">#{order.order_number || order.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={byKey(ORDER_STATUSES.concat(DELIVERY_STATUSES), flowKey)?.tone || orderStatus(order.status).tone} dot>
                      {cancelled ? 'Cancelled' : orderStatus(order.status).label}
                    </Badge>
                    <span className="inline-flex items-center gap-1 rounded-full bg-cream-soft px-2.5 py-1 text-xs font-medium text-ink">
                      <Icon name={orderType(order.order_type).icon} className="h-3.5 w-3.5" /> {orderType(order.order_type).label}
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  {cancelled ? (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                      <Icon name="alert" className="h-5 w-5" /> This order was cancelled.
                    </div>
                  ) : (
                    <OrderProgressTracker statuses={statuses} current={flowKey} />
                  )}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <Meta icon="clock" label="Placed" value={order.created_at ? shortTime(order.created_at) : '—'} />
                  <Meta icon="creditCard" label="Payment" value={paymentMethod(order.payment_method || order.payment?.method).label} />
                  <Meta icon="wallet" label="Total" value={formatCurrency(Number(order.grand_total) || 0)} />
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-ink">Items</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {(order.items || order.order_items || []).map((l, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="text-ink">{l.quantity || l.qty}× {l.name || l.food?.name || 'Dish'}</span>
                      <span className="text-muted">{formatCurrency(Number(l.price) || 0)}</span>
                    </li>
                  ))}
                  {(order.items || order.order_items || []).length === 0 && (
                    <li className="text-muted">Item details aren’t available for this order yet.</li>
                  )}
                </ul>
              </div>
            </>
          )}
          {isAuthenticated && (orders.data || []).length > 0 && <RecentOrders orders={orders.data} onSelect={setQuery} />}
        </div>
      )}
    </div>
  )
}

function Meta({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-cream-soft p-3">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted">
        <Icon name={icon} className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  )
}

function RecentOrders({ orders, onSelect }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-lg font-semibold text-ink">Recent orders</h2>
      <div className="mt-3 space-y-2">
        {orders.slice(0, 5).map((o) => {
          const st = orderStatus(o.status)
          return (
            <button
              key={o.id}
              onClick={() => onSelect(o.order_number || o.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-white p-3 text-left transition hover:border-brand-300 hover:shadow-sm"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="receipt" className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink">#{o.order_number || o.id}</span>
                  <span className="block text-xs text-muted">{orderType(o.order_type).label} · {formatCurrency(Number(o.grand_total) || 0)}</span>
                </span>
              </span>
              <Badge tone={st.tone} dot>{st.label}</Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}
