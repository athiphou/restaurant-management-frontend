import { forwardRef, useId } from 'react'
import { classNames } from '../../utils/formatters'
import { Icon } from './Icon'

/*
  Form fields. `label` renders an accessible <label>; `error` shows a red hint and
  tints the control. All spread remaining props to the underlying element.
*/
const CONTROL =
  'w-full rounded-xl border bg-white px-3.5 text-sm text-ink placeholder:text-muted/70 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'

const fieldClass = (invalid, extra) =>
  classNames(CONTROL, invalid ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-line', extra)

export const Input = forwardRef(function Input(
  { label, error, icon, hint, className, id, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id || autoId
  const invalid = Boolean(error)
  return (
    <div className={classNames('w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <Icon name={icon} className="h-4.5 w-4.5" />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={invalid}
          className={fieldClass(invalid, classNames('h-11', icon && 'pl-10'))}
          {...rest}
        />
      </div>
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {invalid && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, className, rows = 3, id, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id || autoId
  const invalid = Boolean(error)
  return (
    <div className={classNames('w-full', className)}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={invalid}
        className={fieldClass(invalid, 'py-2.5 resize-y')}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {invalid && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select(
  { label, error, hint, className, children, id, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id || autoId
  const invalid = Boolean(error)
  return (
    <div className={classNames('w-full', className)}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={invalid}
          className={fieldClass(invalid, 'h-11 appearance-none pr-9')}
          {...rest}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          <Icon name="chevronDown" className="h-4 w-4" />
        </span>
      </div>
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {invalid && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
})
