import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useCart, lineUnitPrice } from '../../context/CartContext'
import { formatCurrency } from '../../utils/formatters'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { FoodImage } from './FoodImage'

/*
  CartDrawer — premium right-side cart (spec §11). Slide-in panel over a fading
  overlay; per-line variant + add-on recap, quantity stepper, remove, and an
  order summary that hands off to checkout (delivery / tax computed there).
*/
export function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, subtotal, count, clear } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const goCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return createPortal(
    <div className="fixed inset-0 z-[95]">
      <div className="animate-fade-in absolute inset-0 bg-brand-950/45 backdrop-blur-[2px]" onClick={onClose} />
      <aside
        className="animate-slide-in-right absolute right-0 top-0 flex h-full w-[min(94vw,420px)] flex-col bg-canvas shadow-2xl"
        role="dialog"
        aria-label="Your cart"
      >
        <header className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <Icon name="cart" className="h-5 w-5 text-brand-700" />
            <h2 className="font-display text-lg font-semibold text-ink">Your cart</h2>
            {count > 0 && (
              <span className="rounded-full bg-gold-400 px-2 py-0.5 text-xs font-bold text-brand-900">
                {count}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-cream-soft hover:text-ink"
            aria-label="Close cart"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </header>

        <div className="scrollbar-warm flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-300">
                <Icon name="shoppingBag" className="h-8 w-8" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-ink">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted">Add something delicious from the menu.</p>
              <Button className="mt-5" variant="primary" icon="utensils" onClick={() => { onClose(); navigate('/menu') }}>
                Browse menu
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((l) => {
                const unit = lineUnitPrice(l)
                return (
                  <li
                    key={l.key}
                    className="animate-fade-up flex gap-3 rounded-2xl border border-line bg-white p-3"
                  >
                    <FoodImage src={l.image} alt={l.name} className="h-20 w-20 shrink-0 rounded-xl" iconClass="h-6 w-6" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-semibold text-ink">{l.name}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(l.key)}
                          className="shrink-0 text-muted transition hover:text-rose-600"
                          aria-label={`Remove ${l.name}`}
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-0.5 space-y-0.5 text-xs text-muted">
                        {l.variant?.name && <p>{l.variant.name}</p>}
                        {l.addons?.length > 0 && <p>+ {l.addons.map((a) => a.name).join(', ')}</p>}
                        {l.notes && <p className="italic text-brand-600">“{l.notes}”</p>}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 rounded-full border border-line">
                          <StepBtn icon="minus" onClick={() => updateQty(l.key, l.qty - 1)} />
                          <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                          <StepBtn icon="plus" onClick={() => updateQty(l.key, l.qty + 1)} />
                        </div>
                        <span className="font-semibold text-gold-600">{formatCurrency(unit * l.qty)}</span>
                      </div>
                    </div>
                  </li>
                )
              })}
              <li className="pt-1 text-center">
                <button onClick={clear} className="text-xs font-medium text-muted underline-offset-2 hover:text-rose-600 hover:underline">
                  Clear cart
                </button>
              </li>
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-line bg-white px-5 py-4">
            <dl className="space-y-1.5 text-sm">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              <p className="text-xs text-muted">Delivery, service charge &amp; tax are calculated at checkout.</p>
            </dl>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-muted">Grand total</span>
              <span className="font-display text-2xl font-bold text-brand-700">{formatCurrency(subtotal)}</span>
            </div>
            <Button fullWidth size="lg" className="mt-4" icon="arrowRight" onClick={goCheckout}>
              Proceed to checkout
            </Button>
          </footer>
        )}
      </aside>
    </div>,
    document.body,
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  )
}

function StepBtn({ icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-full text-brand-800 transition hover:bg-brand-50"
    >
      <Icon name={icon} className="h-3.5 w-3.5" />
    </button>
  )
}
