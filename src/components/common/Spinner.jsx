import { classNames } from '../../utils/formatters'

export function Spinner({ className, label }) {
  return (
    <span className={classNames('inline-flex items-center gap-2 text-muted', className)} role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      {label && <span className="text-sm">{label}</span>}
    </span>
  )
}
