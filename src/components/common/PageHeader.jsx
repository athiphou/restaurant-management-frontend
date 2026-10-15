import { classNames } from '../../utils/formatters'

export function PageHeader({ title, description, action, breadcrumb, className }) {
  return (
    <div className={classNames('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        {breadcrumb && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{breadcrumb}</p>
        )}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}
