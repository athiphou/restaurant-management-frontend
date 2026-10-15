import { useMemo, useState } from 'react'
import { useMenu } from '../../context/MenuContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { formatCurrency } from '../../utils/formatters'
import { classNames } from '../../utils/formatters'
import { Modal } from '../common/Modal'
import { Icon } from '../ui/Icon'
import { FoodImage, Stars } from './FoodImage'
import { Button } from '../ui/Button'

const money = (v) => formatCurrency(Number(v) || 0)
const extraOf = (v) => Number(v?.priceDelta ?? v?.extra_price ?? v?.price ?? 0) || 0

/*
  FoodDetailModal — spec §10. Uses the real Food → Variants / Add-ons → Add-on
  Items relationship. Handles grouped add-ons (an addon with an items[] array)
  and flat single add-ons. Mounted from PublicLayout, driven by MenuContext.
*/
export function FoodDetailModal() {
  const { detail, closeFood } = useMenu()
  return (
    <Modal open={Boolean(detail)} onClose={closeFood} size="lg" title={null}>
      {detail && <DetailBody key={detail.id} food={detail} onClose={closeFood} />}
    </Modal>
  )
}

function DetailBody({ food, onClose }) {
  const { addItem } = useCart()
  const toast = useToast()

  const variants = food.variants || []
  const addonGroups = useMemo(
    () =>
      (food.addons || []).map((a) =>
        Array.isArray(a.items) && a.items.length
          ? { kind: 'group', id: a.id, name: a.name, items: a.items }
          : { kind: 'single', id: a.id, name: a.name, price: Number(a.price) || 0 },
      ),
    [food],
  )

  const [variantId, setVariantId] = useState(variants[0]?.id ?? null)
  const [selected, setSelected] = useState(() => new Set())
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)

  const variant = variants.find((v) => v.id === variantId) || null
  const base = Number(food.price) || 0

  const selectedExtras = useMemo(() => {
    let total = 0
    for (const g of addonGroups) {
      if (g.kind === 'single' && selected.has(String(g.id))) total += g.price
      if (g.kind === 'group')
        for (const it of g.items)
          if (selected.has(`${g.id}:${it.id}`)) total += Number(it.price) || 0
    }
    return total
  }, [addonGroups, selected])

  const unit = base + extraOf(variant) + selectedExtras
  const lineTotal = unit * qty

  const toggleItem = (id) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const chosenAddons = () => {
    const out = []
    for (const g of addonGroups) {
      if (g.kind === 'single' && selected.has(String(g.id)))
        out.push({ id: g.id, name: g.name, price: g.price })
      if (g.kind === 'group')
        for (const it of g.items)
          if (selected.has(`${g.id}:${it.id}`))
            out.push({ id: it.id, name: it.name, price: Number(it.price) || 0 })
    }
    return out
  }

  const handleAdd = () => {
    addItem(food, { variant, addons: chosenAddons(), qty, notes })
    setAdded(true)
    toast.success(`${qty} × ${food.name} added`, 'Review it in your cart.')
    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 850)
  }

  const available = food.is_available !== false

  return (
    <div className="grid gap-0 md:grid-cols-2">
      <div className="relative h-56 md:h-full md:min-h-[420px]">
        <FoodImage src={food.image} alt={food.name} className="h-full w-full" iconClass="h-12 w-12" />
        {food.rating ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 shadow-sm">
            <Stars value={food.rating} />
          </span>
        ) : null}
      </div>

      <div className="flex max-h-[70vh] flex-col overflow-y-auto p-5 scrollbar-warm md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">{food.name}</h2>
            {food.category?.name && (
              <p className="mt-0.5 text-sm font-medium text-brand-600">{food.category.name}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-cream-soft hover:text-ink"
            aria-label="Close"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        {food.description && <p className="mt-2 text-sm text-muted">{food.description}</p>}

        <div className="mt-3 flex items-center gap-3">
          <span className="font-display text-2xl font-bold text-gold-600">{money(base)}</span>
          <span
            className={classNames(
              'text-xs font-semibold',
              available ? 'text-success' : 'text-rose-600',
            )}
          >
            {available ? '● Available now' : '● Sold out'}
          </span>
        </div>

        {variants.length > 0 && (
          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-semibold text-ink">Choose size</legend>
            <div className="grid grid-cols-2 gap-2">
              {variants.map((v) => {
                const active = v.id === variantId
                const d = extraOf(v)
                return (
                  <label
                    key={v.id}
                    className={classNames(
                      'flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition',
                      active
                        ? 'border-brand-700 bg-brand-50 text-brand-900'
                        : 'border-line hover:border-brand-300',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="variant"
                        className="sr-only"
                        checked={active}
                        onChange={() => setVariantId(v.id)}
                      />
                      <span
                        className={classNames(
                          'grid h-4 w-4 place-items-center rounded-full border-2',
                          active ? 'border-brand-700' : 'border-stone-300',
                        )}
                      >
                        {active && <span className="h-2 w-2 rounded-full bg-brand-700" />}
                      </span>
                      {v.name}
                    </span>
                    {d > 0 && <span className="text-xs font-semibold text-gold-600">+{money(d)}</span>}
                  </label>
                )
              })}
            </div>
          </fieldset>
        )}

        {addonGroups.length > 0 && (
          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-semibold text-ink">Add extras</legend>
            <div className="space-y-3">
              {addonGroups.map((g) => (
                <div key={g.id} className="rounded-xl border border-line p-3">
                  {g.kind === 'single' ? (
                    <label className="flex cursor-pointer items-center justify-between text-sm">
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selected.has(String(g.id))}
                          onChange={() => toggleItem(String(g.id))}
                        />
                        <CheckMark on={selected.has(String(g.id))} />
                        {g.name}
                      </span>
                      {g.price > 0 && <span className="text-xs font-semibold text-gold-600">+{money(g.price)}</span>}
                    </label>
                  ) : (
                    <>
                      <p className="mb-2 text-sm font-medium text-ink">{g.name}</p>
                      <div className="space-y-1.5">
                        {g.items.map((it) => {
                          const id = `${g.id}:${it.id}`
                          return (
                            <label key={it.id} className="flex cursor-pointer items-center justify-between text-sm">
                              <span className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={selected.has(id)}
                                  onChange={() => toggleItem(id)}
                                />
                                <CheckMark on={selected.has(id)} />
                                {it.name}
                              </span>
                              {Number(it.price) > 0 && (
                                <span className="text-xs font-semibold text-gold-600">+{money(it.price)}</span>
                              )}
                            </label>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-semibold text-ink">Special instructions</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="No cilantro, extra spicy…"
            className="w-full resize-y rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <div className="flex items-center gap-2 rounded-full border border-line p-1">
            <QtyBtn icon="minus" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} />
            <span className="w-8 text-center text-sm font-semibold text-ink">{qty}</span>
            <QtyBtn icon="plus" disabled={qty >= 20} onClick={() => setQty((q) => q + 1)} />
          </div>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!available}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <Icon name="check" className="h-5 w-5" /> Added to cart
              </>
            ) : (
              <>
                <Icon name="cart" className="h-5 w-5" /> Add · {money(lineTotal)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function CheckMark({ on }) {
  return (
    <span
      className={classNames(
        'grid h-[18px] w-[18px] place-items-center rounded-md border-2 transition',
        on ? 'border-brand-700 bg-brand-700 text-white' : 'border-stone-300 bg-white',
      )}
    >
      {on && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
    </span>
  )
}

function QtyBtn({ icon, ...rest }) {
  return (
    <button
      type="button"
      className="grid h-8 w-8 place-items-center rounded-full text-brand-800 transition hover:bg-brand-50 disabled:opacity-40"
      {...rest}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  )
}
