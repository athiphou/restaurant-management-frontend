import { useState } from 'react'
import { classNames } from '../../utils/formatters'

/*
  Toggle — animated switch (spec §27 availability toggles, §18 settings).
  Controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
*/
export function Toggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled,
  size = 'md',
  'aria-label': ariaLabel,
}) {
  const [internal, setInternal] = useState(defaultChecked)
  const checked = controlledChecked ?? internal

  const handle = () => {
    if (disabled) return
    const next = !checked
    if (controlledChecked === undefined) setInternal(next)
    onChange?.(next)
  }

  const dims =
    size === 'sm'
      ? { track: 'h-5 w-9', knob: 'h-3.5 w-3.5', on: 'translate-x-4' }
      : { track: 'h-6 w-11', knob: 'h-5 w-5', on: 'translate-x-5' }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handle}
      className={classNames(
        'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:opacity-50',
        dims.track,
        checked ? 'bg-brand-700' : 'bg-stone-300',
      )}
    >
      <span
        className={classNames(
          'inline-block transform rounded-full bg-white shadow transition-transform duration-200',
          dims.knob,
          checked ? dims.on : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function ToggleRow({ label, description, checked, defaultChecked, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-muted">{description}</p>}
      </div>
      <Toggle
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  )
}
