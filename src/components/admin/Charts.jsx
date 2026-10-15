import { useEffect, useState } from 'react'
import { classNames } from '../../utils/formatters'

/*
  Hand-rolled charts (the project avoids Recharts). All animation is transform/
  opacity/height only and honors prefers-reduced-motion via the global CSS guard.
*/

// Vertical bar chart with animated grow-in, hover value, and a max reference.
export function BarChart({ data, height = 190, format = (v) => v, className }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(r)
  }, [])
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className={classNames('w-full', className)}>
      <div className="relative flex items-end gap-1.5 sm:gap-2" style={{ height }}>
        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <div
            key={g}
            className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-line"
            style={{ bottom: `${g * 100}%` }}
          />
        ))}
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          const isMax = d.value === max && d.value > 0
          return (
            <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
              <div
                className={classNames(
                  'pointer-events-none absolute -top-1 z-10 -translate-y-full whitespace-nowrap rounded-md bg-brand-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100',
                )}
              >
                {format(d.value)}
              </div>
              <div
                className={classNames(
                  'w-full rounded-t-md transition-[height] duration-700 ease-out',
                  isMax ? 'bg-gold-400' : 'bg-brand-600 group-hover:bg-brand-700',
                )}
                style={{ height: mounted ? `${Math.max(pct, d.value > 0 ? 4 : 0)}%` : '0%' }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 truncate text-center text-[10px] font-medium text-muted">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// Horizontal labeled bars for status breakdown.
export function BarList({ items, format = (v) => v }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(r)
  }, [])
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-ink">
              {it.dot && <span className={classNames('h-2 w-2 rounded-full', it.dot)} />}
              {it.label}
            </span>
            <span className="tabular-nums text-muted">{format(it.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream-soft">
            <div
              className={classNames('h-full rounded-full transition-[width] duration-700 ease-out', it.bar || 'bg-brand-600')}
              style={{ width: mounted ? `${(it.value / max) * 100}%` : '0%' }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

// Donut for order-type split. segments: [{label, value, color}]
export function Donut({ segments, size = 168, thickness = 24, centerLabel }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef5f1" strokeWidth={thickness} />
          {total > 0 &&
            segments.map((s, i) => {
              const dash = (s.value / total) * c
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${c - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  style={{ transition: 'stroke-dasharray 0.7s ease' }}
                />
              )
              offset += dash
              return el
            })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-ink">{total}</p>
            {centerLabel && <p className="text-[11px] uppercase tracking-wide text-muted">{centerLabel}</p>}
          </div>
        </div>
      </div>
      <ul className="w-full space-y-1.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="font-semibold tabular-nums text-muted">
              {s.value}
              {total > 0 && <span className="ml-1 text-xs">({Math.round((s.value / total) * 100)}%)</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
