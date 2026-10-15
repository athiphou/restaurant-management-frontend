import { useState } from 'react'
import { classNames } from '../../utils/formatters'
import { Icon } from '../ui/Icon'

/*
  FoodImage — lazy <img> with a graceful cream placeholder when an item has no
  (or a broken) image, so the grid never shows empty frames.
*/
export function FoodImage({ src, alt, className, iconClass = 'h-8 w-8' }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div
        className={classNames(
          'flex items-center justify-center bg-gradient-to-br from-brand-50 to-cream-soft text-brand-300',
          className,
        )}
      >
        <Icon name="utensils" className={iconClass} />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={classNames('object-cover', className)}
    />
  )
}

export function Stars({ value, className }) {
  const rating = Number(value) || 0
  return (
    <span className={classNames('inline-flex items-center gap-1 text-gold-500', className)}>
      <Icon name="star" filled className="h-4 w-4 text-gold-400" />
      <span className="text-sm font-semibold text-ink">{rating ? rating.toFixed(1) : '—'}</span>
    </span>
  )
}
