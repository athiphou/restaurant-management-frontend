import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters'
import { orderType, paymentMethod } from '../../utils/orderMeta'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'

function readOrder(state) {
  if (state?.order) return state.order
  try {
    return JSON.parse(localStorage.getItem('rms.lastOrder')) || null
  } catch {
    return null
  }
}

export default function OrderConfirmationPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [order] = useState(() => readOrder(state))

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">No recent order</h1>
        <p className="mt-2 text-muted">Place an order to see its confirmation here.</p>
        <Link to="/menu" className="mt-6 inline-block">
          <Button icon="utensils">Go to menu</Button>
        </Link>
      </div>
    )
  }

  const number = order.order_number || order.id || '—'
  const items = order.items || []
  const type = orderType(order.order_type)

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="rounded-3xl border border-line bg-white p-8 text-center shadow-sm">
        <AnimatedCheck />
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">Order confirmed</h1>
        <p className="mt-2 text-muted">Thank you for your order! We’re firing up the kitchen.</p>

        <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-cream-soft p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Order number</p>
          <p className="font-display text-2xl font-bold text-brand-700">#{number}</p>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-ink">
            <Icon name={type.icon} className="h-4 w-4 text-brand-600" /> {type.label}
            <span className="text-line">·</span>
            <Icon name={paymentIcon(order.payment_method)} className="h-4 w-4 text-brand-600" /> {paymentMethod(order.payment_method || 'cash').label}
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted">
            <Icon name="clock" className="h-4 w-4" /> Estimated 20–30 minutes
          </p>
        </div>

        {items.length > 0 && (
          <div className="mt-6 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Items</p>
            <ul className="space-y-1.5 text-sm">
              {items.slice(0, 6).map((l, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-ink">{l.quantity || l.qty}× {l.name || l.food?.name || 'Dish'}</span>
                  <span className="text-muted">{formatCurrency(Number(l.price) || 0)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-display text-xl font-bold text-brand-700">{formatCurrency(Number(order.grand_total) || 0)}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button fullWidth size="lg" icon="deliveries" onClick={() => navigate(`/tracking?order=${number}`)}>
            Track order
          </Button>
          <Link to="/menu" className="flex-1">
            <Button fullWidth size="lg" variant="secondary">Continue shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function paymentIcon(key) {
  return { cash: 'wallet', aba_khqr: 'qr', aba_card: 'creditCard' }[(key || '').toLowerCase()] || 'creditCard'
}

function AnimatedCheck() {
  return (
    <div className="relative mx-auto grid h-24 w-24 place-items-center">
      <span className="absolute inset-0 rounded-full bg-success/10" />
      <svg viewBox="0 0 52 52" className="h-20 w-20">
        <circle cx="26" cy="26" r="24" fill="none" stroke="#16803c" strokeWidth="2" strokeDasharray="151" strokeDashoffset="151" style={{ animation: 'draw 0.5s ease-out both' }} />
        <path d="M15 27l7 7 15-15" fill="none" stroke="#16803c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40" style={{ animation: 'draw 0.4s ease-out 0.4s both' }} />
      </svg>
    </div>
  )
}
