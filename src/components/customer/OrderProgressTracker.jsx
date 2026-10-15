import { classNames } from '../../utils/formatters'
import { Icon } from '../ui/Icon'

/*
  OrderProgressTracker — horizontal status stepper (spec §15). Completed steps
  render in brand green, the active step pulses, upcoming steps are muted, and the
  connecting progress line animates its width. Pass the relevant statuses list
  (ORDER_STATUSES or DELIVERY_STATUSES) and the current key.
*/
export function OrderProgressTracker({ statuses = [], current = 'pending', cancelled = false }) {
  const idx = Math.max(0, statuses.findIndex((s) => s.key === current))
  const progress = statuses.length > 1 ? (idx / (statuses.length - 1)) * 100 : 0

  return (
    <div className="w-full">
      <div className="relative">
        {/* track */}
        <div className="absolute left-0 right-0 top-4 h-0.5 -translate-y-1/2 rounded-full bg-line" />
        <div
          className={classNames(
            'absolute left-0 top-4 h-0.5 -translate-y-1/2 rounded-full transition-all duration-700 ease-out',
            cancelled ? 'bg-rose-400' : 'bg-brand-600',
          )}
          style={{ width: `${progress}%` }}
        />
        <ol className="relative flex justify-between">
          {statuses.map((s, i) => {
            const done = !cancelled && i < idx
            const active = !cancelled && i === idx
            return (
              <li key={s.key} className="flex flex-1 flex-col items-center gap-2 text-center">
                <span
                  className={classNames(
                    'grid h-8 w-8 place-items-center rounded-full ring-4 ring-canvas transition-colors duration-500',
                    done && 'bg-brand-600 text-white',
                    active && 'animate-pulse-dot bg-gold-400 text-brand-900',
                    !done && !active && 'bg-white text-stone-300 ring-1 ring-line',
                    cancelled && i === idx && 'bg-rose-500 text-white ring-rose-100',
                  )}
                >
                  {done ? (
                    <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                  ) : active ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-800" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-stone-300" />
                  )}
                </span>
                <span
                  className={classNames(
                    'text-[11px] font-semibold leading-tight sm:text-xs',
                    active ? 'text-brand-800' : done ? 'text-ink' : 'text-muted',
                  )}
                >
                  {s.label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
