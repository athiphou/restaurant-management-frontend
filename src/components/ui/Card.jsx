import { classNames } from '../../utils/formatters'

/*
  Card — the standard elevated white surface. `interactive` adds hover lift for
  clickable cards. CardTitle is a serif heading with an optional caption.
*/
export function Card({ className, children, interactive = false, as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={classNames(
        'rounded-2xl border border-line bg-white shadow-sm',
        interactive &&
          'transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function CardTitle({ title, caption, action, className }) {
  return (
    <div className={classNames('flex items-start justify-between gap-3', className)}>
      <div>
        {title && <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>}
        {caption && <p className="mt-0.5 text-sm text-muted">{caption}</p>}
      </div>
      {action}
    </div>
  )
}
