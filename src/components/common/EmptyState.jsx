import { Icon } from '../ui/Icon'

/*
  EmptyState — friendly placeholder for no-data / module-in-progress.
  Props: icon, message, hint, action.
*/
export function EmptyState({ icon = 'box', message, hint, action, className }) {
  return (
    <div
      className={
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-14 text-center ' +
        (className || '')
      }
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <p className="mt-4 font-display text-lg font-semibold text-ink">
        {message || 'Nothing here yet'}
      </p>
      {hint && <p className="mt-1 max-w-sm text-sm text-muted">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
