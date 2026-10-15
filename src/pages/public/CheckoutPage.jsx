import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, lineUnitPrice } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useApi } from '../../hooks/useApi'
import * as orderApi from '../../api/order'
import * as customerApi from '../../api/customer'
import * as restaurantApi from '../../api/restaurant'
import * as promotionApi from '../../api/promotion'
import { ApiError } from '../../api/client'
import { ORDER_TYPES, PAYMENT_METHODS } from '../../utils/orderMeta'
import { formatCurrency } from '../../utils/formatters'
import { classNames } from '../../utils/formatters'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { Input, Textarea, Select } from '../../components/ui/Input'
import { FoodImage } from '../../components/customer/FoodImage'
import { EmptyState } from '../../components/common/EmptyState'

const VAT = 0.1
const SERVICE_DINE = 0.1
const DELIVERY_FEE = 1.5
const STEPS = ['Order type', 'Your details', 'Address / table', 'Payment', 'Review']
const money = (n) => formatCurrency(Number(n) || 0)
const r2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100

export default function CheckoutPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { items, subtotal, branchId, branches, setBranch, clear } = useCart()
  const { isAuthenticated, user } = useAuth()

  const tables = useApi(restaurantApi.listRestaurantTables, [])
  const promos = useApi(promotionApi.listPromotions, [])
  const addresses = useApi(
    () => customerApi.listAddresses(user?.id ?? undefined),
    [user?.id],
  )

  const [step, setStep] = useState(0)
  const [orderType, setOrderType] = useState('delivery')
  const [info, setInfo] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' })
  const [delivery, setDelivery] = useState({ addressId: null, line1: '', city: '', note: '' })
  const [tableId, setTableId] = useState(null)
  const [payment, setPayment] = useState('cash')
  const [promo, setPromo] = useState({ code: '', applied: null })
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    if (user) setInfo((s) => ({ name: user.name || s.name, phone: user.phone || s.phone, email: user.email || s.email }))
  }, [user])

  const emptyCart = items.length === 0

  const applicablePromos = useMemo(
    () => (promos.data || []).filter((p) => p.is_active !== false),
    [promos.data],
  )

  const discount = useMemo(() => {
    const p = promo.applied
    if (!p) return 0
    if (subtotal < (Number(p.min_order_amount) || 0)) return 0
    if (p.discount_type === 'percentage') return r2(subtotal * (Number(p.discount_value) / 100))
    return r2(Math.min(Number(p.discount_value) || 0, subtotal))
  }, [promo.applied, subtotal])

  const totals = useMemo(() => {
    const taxable = Math.max(0, subtotal - discount)
    const tax = r2(taxable * VAT)
    const service = orderType === 'dine_in' ? r2(taxable * SERVICE_DINE) : 0
    const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0
    const grand = r2(taxable + tax + service + deliveryFee)
    return { subtotal, discount, tax, service, deliveryFee, grand }
  }, [subtotal, discount, orderType])

  const canApplyPromo = (code) => {
    const p = applicablePromos.find((x) => (x.code || '').toLowerCase() === code.trim().toLowerCase())
    if (!p) {
      toast.error('Invalid code', 'That promotion code was not found.')
      return
    }
    if (subtotal < (Number(p.min_order_amount) || 0)) {
      toast.warning('Not eligible yet', `Spend at least ${money(p.min_order_amount)} to use ${p.code}.`)
      return
    }
    setPromo({ code: p.code, applied: p })
    toast.success('Promotion applied', `${p.name} · ${p.code}`)
  }

  const stepValid = (s) => {
    if (s === 0) return Boolean(branchId)
    if (s === 1) return info.name.trim() && info.phone.trim()
    if (s === 2) {
      if (orderType === 'delivery') return Boolean(delivery.addressId || delivery.line1.trim())
      if (orderType === 'dine_in') return Boolean(tableId)
      return true
    }
    if (s === 3) return Boolean(payment)
    return true
  }

  const next = () => {
    if (!stepValid(step)) {
      toast.warning('Missing details', 'Please complete this step to continue.')
      return
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }
  const back = () => setStep((s) => Math.max(0, s - 1))

  const buildPayload = () => {
    const chosenAddress = (addresses.data || []).find((a) => a.id === delivery.addressId)
    return {
      branch_id: branchId,
      table_id: orderType === 'dine_in' ? tableId : null,
      customer_id: user?.id ?? null,
      promotion_id: promo.applied?.id ?? null,
      order_type: orderType,
      status: 'pending',
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      service_charge: totals.service,
      delivery_fee: totals.deliveryFee,
      grand_total: totals.grand,
      notes: [notes, orderType === 'delivery' ? (chosenAddress ? `${chosenAddress.address || chosenAddress.line1 || ''}` : delivery.line1) : '']
        .filter(Boolean)
        .join(' · '),
      items: items.map((l) => ({
        food_id: l.foodId,
        variant_id: l.variant?.id ?? null,
        quantity: l.qty,
        price: lineUnitPrice(l),
        notes: l.notes || null,
        addons: (l.addons || []).map((a) => ({ addon_id: a.id, price: a.price })),
      })),
    }
  }

  const placeOrder = async () => {
    if (!stepValid(4)) return
    setPlacing(true)
    const payload = buildPayload()
    try {
      const res = await orderApi.createOrder(payload)
      const order = res?.data ?? payload
      finish({ ...payload, ...order, id: order.id ?? null, order_number: order.order_number || order.id })
    } catch (err) {
      const msg = err instanceof ApiError ? err.data?.message || err.message : 'Order failed'
      toast.error('Could not submit your order', msg)
      setPlacing(false)
    }
  }

  const finish = (order) => {
    localStorage.setItem('rms.lastOrder', JSON.stringify({ ...order, placedAt: new Date().toISOString() }))
    clear()
    navigate('/order-confirmed', { state: { order } })
  }

  if (emptyCart) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState
          icon="cart"
          message="Your cart is empty"
          hint="Add a few dishes before heading to checkout."
          action={<Link to="/menu"><Button icon="utensils">Browse the menu</Button></Link>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/menu" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-brand-700">
        <Icon name="arrowLeft" className="h-4 w-4" /> Continue shopping
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Checkout</h1>

      <Stepper step={step} onJump={(i) => i < step && setStep(i)} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div key={step} className="animate-fade-up">
            {step === 0 && (
              <Panel title="How would you like to order?">
                <div className="grid gap-3 sm:grid-cols-3">
                  {ORDER_TYPES.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setOrderType(t.key)}
                      className={classNames(
                        'flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition',
                        orderType === t.key ? 'border-brand-700 bg-brand-50 ring-1 ring-brand-700' : 'border-line hover:border-brand-300',
                      )}
                    >
                      <span className={classNames('grid h-10 w-10 place-items-center rounded-xl', orderType === t.key ? 'bg-brand-700 text-gold-400' : 'bg-cream-soft text-brand-600')}>
                        <Icon name={t.icon} className="h-5 w-5" />
                      </span>
                      <span className="font-display text-lg font-semibold text-ink">{t.label}</span>
                      <span className="text-xs text-muted">{orderHint(t.key)}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-5">
                  <Select label="Branch" value={branchId ?? ''} onChange={(e) => setBranch(Number(e.target.value))}>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}{b.address ? ` — ${b.address}` : ''}</option>
                    ))}
                  </Select>
                </div>
              </Panel>
            )}

            {step === 1 && (
              <Panel title="Your details">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Full name" value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} icon="user" placeholder="Your name" />
                  <Input label="Phone" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} icon="phone" placeholder="+855 …" />
                  <Input className="sm:col-span-2" label="Email (optional)" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} icon="mail" placeholder="you@example.com" />
                </div>
                {!isAuthenticated && (
                  <p className="mt-3 rounded-xl bg-cream-soft px-4 py-3 text-sm text-muted">
                    Have an account? <Link to="/login" className="font-semibold text-brand-700">Sign in</Link> to save addresses and track orders after checkout.
                  </p>
                )}
              </Panel>
            )}

            {step === 2 && (
              <Panel
                title={orderType === 'dine_in' ? 'Choose your table' : orderType === 'delivery' ? 'Delivery address' : 'Pickup details'}
                subtitle={orderType === 'dine_in' ? 'We’ll seat you and bring the order to your table.' : orderType === 'delivery' ? 'Where should we bring your food?' : 'We’ll have it ready at your selected branch.'}
              >
                {orderType === 'delivery' && <DeliveryStep addresses={addresses.data || []} delivery={delivery} setDelivery={setDelivery} />}
                {orderType === 'dine_in' && (
                  <TableStep tables={tables.data || []} branchId={branchId} tableId={tableId} setTableId={setTableId} loading={tables.loading} />
                )}
                {orderType === 'takeaway' && (
                  <div className="rounded-2xl border border-line p-5">
                    <p className="text-sm text-muted">
                      Collect from <span className="font-semibold text-ink">{branches.find((b) => b.id === branchId)?.name || 'your branch'}</span>. Add a note if there’s anything we should know.
                    </p>
                  </div>
                )}
                <div className="mt-4">
                  <Textarea label="Order notes (optional)" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, spice level, gate code…" />
                </div>
              </Panel>
            )}

            {step === 3 && (
              <Panel title="Payment method">
                <div className="grid gap-3 sm:grid-cols-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setPayment(m.key)}
                      className={classNames(
                        'flex items-center gap-3 rounded-2xl border p-4 text-left transition',
                        payment === m.key ? 'border-brand-700 bg-brand-50 ring-1 ring-brand-700' : 'border-line hover:border-brand-300',
                      )}
                    >
                      <span className={classNames('grid h-10 w-10 place-items-center rounded-xl', payment === m.key ? 'bg-brand-700 text-gold-400' : 'bg-cream-soft text-brand-600')}>
                        <Icon name={payIcon(m.key)} className="h-5 w-5" />
                      </span>
                      <span className="font-semibold text-ink">{m.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                  <Icon name="info" className="h-4 w-4" /> Payments are collected on delivery / at the counter in this demo flow.
                </p>
              </Panel>
            )}

            {step === 4 && (
              <Panel title="Review & confirm">
                <div className="space-y-3 text-sm">
                  <ReviewRow icon={orderTypeIcon(orderType)} label="Order type" value={ORDER_TYPES.find((t) => t.key === orderType)?.label} onEdit={() => setStep(0)} />
                  <ReviewRow icon="store" label="Branch" value={branches.find((b) => b.id === branchId)?.name || '—'} onEdit={() => setStep(0)} />
                  <ReviewRow icon="user" label="Contact" value={`${info.name} · ${info.phone}`} onEdit={() => setStep(1)} />
                  {orderType === 'delivery' && (
                    <ReviewRow icon="mapPin" label="Deliver to" value={delivery.addressId ? (addresses.data || []).find((a) => a.id === delivery.addressId)?.label || 'Saved address' : delivery.line1} onEdit={() => setStep(2)} />
                  )}
                  {orderType === 'dine_in' && (
                    <ReviewRow icon="table" label="Table" value={(tables.data || []).find((t) => t.id === tableId)?.name || `Table ${tableId}`} onEdit={() => setStep(2)} />
                  )}
                  <ReviewRow icon={payIcon(payment)} label="Payment" value={PAYMENT_METHODS.find((m) => m.key === payment)?.label} onEdit={() => setStep(3)} />
                </div>
                <div className="mt-5 space-y-2">
                  {items.map((l) => (
                    <div key={l.key} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <FoodImage src={l.image} alt="" className="h-9 w-9 rounded-lg" iconClass="h-4 w-4" />
                        <span className="truncate">{l.qty} × {l.name}{l.variant?.name ? ` (${l.variant.name})` : ''}</span>
                      </span>
                      <span className="font-semibold text-ink">{money(lineUnitPrice(l) * l.qty)}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>

          {/* Nav buttons */}
          <div className="mt-6 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button variant="secondary" icon="arrowLeft" onClick={back}>Back</Button>
            ) : <span />}
            {step < STEPS.length - 1 ? (
              <Button iconRight="arrowRight" onClick={next}>Continue</Button>
            ) : (
              <Button size="lg" loading={placing} icon="check" onClick={placeOrder}>
                Place order · {money(totals.grand)}
              </Button>
            )}
          </div>
        </div>

        {/* Summary rail */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>
            <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto scrollbar-warm">
              {items.map((l) => (
                <li key={l.key} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate text-ink">{l.qty}× {l.name}</span>
                  <span className="shrink-0 text-muted">{money(lineUnitPrice(l) * l.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <input
                value={promo.code}
                onChange={(e) => setPromo({ ...promo, code: e.target.value })}
                placeholder="Promo code"
                className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-cream px-3 text-sm outline-none focus:border-brand-500 focus:bg-white"
              />
              <Button size="sm" variant="secondary" onClick={() => canApplyPromo(promo.code)}>Apply</Button>
            </div>
            {applicablePromos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {applicablePromos.slice(0, 3).map((p) => (
                  <button key={p.id} onClick={() => setPromo({ code: p.code, applied: p })} className="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-semibold text-brand-800 hover:bg-gold-200">
                    {p.code}
                  </button>
                ))}
              </div>
            )}

            <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
              <Line label="Subtotal" value={money(totals.subtotal)} />
              {totals.discount > 0 && <Line label="Discount" value={`− ${money(totals.discount)}`} accent />}
              <Line label="Tax (10%)" value={money(totals.tax)} />
              {totals.service > 0 && <Line label="Service charge" value={money(totals.service)} />}
              {totals.deliveryFee > 0 && <Line label="Delivery fee" value={money(totals.deliveryFee)} />}
            </dl>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="font-semibold text-ink">Grand total</span>
              <span className="font-display text-2xl font-bold text-brand-700">{money(totals.grand)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

/* ---------- pieces ---------- */

function orderHint(key) {
  return { dine_in: 'Eat in with table service', takeaway: 'Collect on your way', delivery: 'Brought to your door' }[key]
}
function orderTypeIcon(key) {
  return ORDER_TYPES.find((t) => t.key === key)?.icon || 'utensils'
}
function payIcon(key) {
  return { cash: 'wallet', aba_khqr: 'qr', aba_card: 'creditCard' }[key] || 'creditCard'
}

function Stepper({ step, onJump }) {
  return (
    <ol className="mt-6 flex items-center gap-1 overflow-x-auto pb-1">
      {STEPS.map((label, i) => {
        const done = i < step
        const active = i === step
        return (
          <li key={label} className="flex items-center gap-1">
            <button
              type="button"
              disabled={i > step}
              onClick={() => onJump(i)}
              className={classNames(
                'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition',
                active ? 'bg-brand-700 text-white' : done ? 'text-brand-700 hover:bg-brand-50' : 'text-muted',
              )}
            >
              <span className={classNames('grid h-5 w-5 place-items-center rounded-full text-xs', active ? 'bg-gold-400 text-brand-900' : done ? 'bg-brand-100 text-brand-700' : 'bg-stone-100 text-stone-400')}>
                {done ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className="hidden whitespace-nowrap sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-line" />}
          </li>
        )
      })}
    </ol>
  )
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function DeliveryStep({ addresses, delivery, setDelivery }) {
  return (
    <div className="space-y-4">
      {addresses.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {addresses.map((a) => {
            const active = delivery.addressId === a.id
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setDelivery((d) => ({ ...d, addressId: a.id, line1: '' }))}
                className={classNames('rounded-2xl border p-3 text-left transition', active ? 'border-brand-700 bg-brand-50 ring-1 ring-brand-700' : 'border-line hover:border-brand-300')}
              >
                <p className="text-sm font-semibold text-ink">{a.label || a.address_line_1 || a.address || 'Saved address'}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">{a.address || a.address_line_1 || ''}{a.city ? `, ${a.city}` : ''}</p>
              </button>
            )
          })}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input className="sm:col-span-2" label="Delivery address" icon="mapPin" value={delivery.addressId ? '' : delivery.line1} disabled={Boolean(delivery.addressId)} onChange={(e) => setDelivery((d) => ({ ...d, line1: e.target.value }))} placeholder="Street, building, city" />
        <Input label="City / district" value={delivery.city} disabled={Boolean(delivery.addressId)} onChange={(e) => setDelivery((d) => ({ ...d, city: e.target.value }))} placeholder="Phnom Penh" />
        <Input label="Landmark (optional)" value={delivery.note} disabled={Boolean(delivery.addressId)} onChange={(e) => setDelivery((d) => ({ ...d, note: e.target.value }))} placeholder="Blue gate, near café" />
      </div>
      {delivery.addressId && (
        <button type="button" onClick={() => setDelivery((d) => ({ ...d, addressId: null }))} className="text-sm font-medium text-brand-700 hover:underline">
          Or enter a new address
        </button>
      )}
    </div>
  )
}

function TableStep({ tables, branchId, tableId, setTableId, loading }) {
  const scoped = tables.filter((t) => !t.branch_id || t.branch_id === branchId)
  if (loading) return <p className="text-sm text-muted">Loading tables…</p>
  if (scoped.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
        No tables are configured for this branch yet. Choose any branch — or continue and the host will seat you.
      </div>
    )
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {scoped.map((t) => {
        const active = tableId === t.id
        const status = (t.status || 'available').toLowerCase()
        const tone = { available: 'border-brand-200 bg-white', occupied: 'border-brand-700 bg-brand-700 text-white', reserved: 'border-gold-400 bg-gold-100' }[status] || 'border-line'
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTableId(t.id)}
            className={classNames('flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-semibold transition', tone, active && 'ring-2 ring-brand-700 ring-offset-1')}
          >
            <Icon name="table" className="h-5 w-5" />
            {t.name || `Table ${t.id}`}
          </button>
        )
      })}
    </div>
  )
}

function ReviewRow({ icon, label, value, onEdit }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-2.5">
      <span className="flex items-center gap-2 text-muted"><Icon name={icon} className="h-4 w-4" /> {label}</span>
      <span className="flex items-center gap-2">
        <span className="truncate font-medium text-ink">{value}</span>
        <button onClick={onEdit} className="text-xs font-semibold text-brand-700 hover:underline">Edit</button>
      </span>
    </div>
  )
}

function Line({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={classNames('font-medium', accent ? 'text-success' : 'text-ink')}>{value}</dd>
    </div>
  )
}
