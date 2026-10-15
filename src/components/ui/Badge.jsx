import { classNames } from '../../utils/formatters'

/*
  Badge — soft pill labels for statuses / categories.
  Tones mirror the palette used by orderMeta (gray/blue/yellow/violet/green/red)
  plus brand + gold. `dot` renders a leading status dot.
*/
const TONES = {
  gray: 'bg-stone-100 text-stone-600 ring-stone-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  gold: 'bg-gold-100 text-brand-800 ring-gold-300',
}

const DOTS = {
  gray: 'bg-stone-400',
  slate: 'bg-slate-400',
  blue: 'bg-sky-500',
  sky: 'bg-sky-500',
  yellow: 'bg-amber-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  green: 'bg-emerald-500',
  emerald: 'bg-emerald-500',
  red: 'bg-rose-500',
  rose: 'bg-rose-500',
  brand: 'bg-brand-700',
  gold: 'bg-gold-400',
}

export function Badge({ tone = 'gray', dot = false, className, children }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        TONES[tone] || TONES.gray,
        className,
      )}
    >
      {dot && <span className={classNames('h-1.5 w-1.5 rounded-full', DOTS[tone] || DOTS.gray)} />}
      {children}
    </span>
  )
}
