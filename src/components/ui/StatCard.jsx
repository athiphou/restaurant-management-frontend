import { useEffect, useRef, useState } from 'react'
import { classNames } from '../../utils/formatters'
import { Icon } from './Icon'

/*
  StatCard — KPI tile (spec §19). The number counts up smoothly on mount; honors
  prefers-reduced-motion by rendering the final value instantly.
*/
const TONES = {
  brand: 'bg-brand-50 text-brand-700',
  gold: 'bg-gold-100 text-gold-700',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-rose-50 text-rose-600',
  sky: 'bg-sky-50 text-sky-600',
}

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  const frame = useRef()

  useEffect(() => {
    const end = Number(target) || 0
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(end)
      return
    }
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(end * eased)
      if (p < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])

  return value
}

export function StatCard({
  label,
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon,
  tone = 'brand',
  hint,
  delta,
  deltaLabel = 'vs. yesterday',
  count = true,
  className,
}) {
  const animated = useCountUp(value)
  const shown = count ? animated : Number(value) || 0

  const formatted = shown.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <div
      className={classNames(
        'rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted">{label}</p>
          <p className="mt-1 font-display text-[26px] font-semibold leading-tight text-ink">
            {prefix}
            {formatted}
            {suffix}
          </p>
        </div>
        {icon && (
          <span
            className={classNames(
              'grid h-11 w-11 shrink-0 place-items-center rounded-xl',
              TONES[tone] || TONES.brand,
            )}
          >
            <Icon name={icon} className="h-5 w-5" />
          </span>
        )}
      </div>
      {(delta != null || hint) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {delta != null && (
            <span
              className={classNames(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold',
                delta >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
              )}
            >
              <Icon
                name="trendingUp"
                className={classNames('h-3.5 w-3.5', delta < 0 && 'rotate-180')}
              />
              {delta >= 0 ? '+' : ''}
              {delta}%
            </span>
          )}
          {delta != null && <span className="text-muted">{deltaLabel}</span>}
          {hint && !delta && delta == null && <span className="text-muted">{hint}</span>}
        </div>
      )}
    </div>
  )
}
