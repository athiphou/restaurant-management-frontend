import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useMenu } from '../../context/MenuContext'
import { useToast } from '../../context/ToastContext'
import { formatCurrency } from '../../utils/formatters'
import { classNames } from '../../utils/formatters'
import { Icon } from '../ui/Icon'
import { FoodImage, Stars } from './FoodImage'

/*
  FoodCard — grid tile (spec §9): image, name, description, price (gold),
  rating, availability and an Add-to-Cart button with the
  "Add to Cart → Adding… → ✓ Added" micro-interaction (spec §34).
  Tapping the card opens the detail modal (variants + add-ons).
*/
export function FoodCard({ food, className }) {
  const { addItem } = useCart()
  const { openFood } = useMenu()
  const toast = useToast()
  const [state, setState] = useState('idle')
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const available = food.is_available !== false
  const hasOptions = (food.variants?.length || 0) + (food.addons?.length || 0) > 0

  const quickAdd = (e) => {
    e?.stopPropagation()
    if (!available || state !== 'idle') return
    setState('adding')
    addItem(food)
    timers.current.push(
      setTimeout(() => {
        setState('added')
        toast.success(`${food.name} added`, 'Review it in your cart.')
      }, 650),
    )
    timers.current.push(setTimeout(() => setState('idle'), 2000))
  }

  return (
    <article
      onClick={() => available && openFood(food)}
      className={classNames(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg',
        !available && 'cursor-not-allowed',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-soft">
        <FoodImage
          src={food.image}
          alt={food.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {!available && (
          <div className="absolute inset-0 grid place-items-center bg-brand-950/45">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-600">
              Sold out
            </span>
          </div>
        )}
        {hasOptions && available && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-700 shadow-sm">
            {food.variants?.length ? `${food.variants.length} sizes` : ''}
            {food.variants?.length && food.addons?.length ? ' · ' : ''}
            {food.addons?.length ? `${food.addons.length} extras` : ''}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[17px] font-semibold leading-tight text-ink">
            {food.name}
          </h3>
          {food.rating ? <Stars value={food.rating} /> : null}
        </div>
        {food.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{food.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between gap-2 pt-1">
          <span className="font-display text-lg font-bold text-gold-600">
            {formatCurrency(Number(food.price) || 0)}
          </span>
          <button
            type="button"
            onClick={quickAdd}
            disabled={!available}
            aria-label={`Add ${food.name} to cart`}
            className={classNames(
              'inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition',
              !available
                ? 'cursor-not-allowed bg-stone-100 text-stone-400'
                : state === 'added'
                  ? 'bg-success text-white'
                  : 'bg-brand-700 text-white hover:bg-brand-800',
            )}
          >
            {state === 'adding' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : state === 'added' ? (
              <Icon name="check" className="h-4 w-4" />
            ) : (
              <Icon name="plus" className="h-4 w-4" />
            )}
            {state === 'added' ? 'Added' : state === 'adding' ? 'Adding…' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
