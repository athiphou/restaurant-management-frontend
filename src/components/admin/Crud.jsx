import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { Toggle } from '../ui/Toggle'
import { classNames } from '../../utils/formatters'

/*
  Shared building blocks for admin CRUD pages (toolbar, row actions, async toggle).
*/

export function Toolbar({ search, onSearch, placeholder = 'Search…', children, onAdd, addLabel = 'Add' }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {onSearch && (
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" className="h-4 w-4" /></span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            className="h-10 w-full rounded-full border border-line bg-white pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      )}
      {children}
      {onAdd && (
        <Button className={classNames(!search && 'ml-auto')} icon="plus" onClick={onAdd}>{addLabel}</Button>
      )}
    </div>
  )
}

export function RowActions({ onEdit, onDelete, deleting }) {
  return (
    <>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="grid h-8 w-8 place-items-center rounded-lg text-brand-700 transition hover:bg-brand-50"
          aria-label="Edit"
        >
          <Icon name="edit" className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          disabled={deleting}
          onClick={() => {
            if (window.confirm('Delete this record? This cannot be undone.')) onDelete()
          }}
          className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
          aria-label="Delete"
        >
          <Icon name="trash" className="h-4 w-4" />
        </button>
      )}
    </>
  )
}

// A Toggle wired to an async handler with a per-row busy state.
export function AsyncToggle({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  return (
    <Toggle
      checked={Boolean(value)}
      disabled={busy}
      onChange={async (v) => {
        setBusy(true)
        try {
          await onChange(v)
        } finally {
          setBusy(false)
        }
      }}
    />
  )
}
