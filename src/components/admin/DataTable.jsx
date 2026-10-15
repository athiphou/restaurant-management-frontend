import { Skeleton } from '../common/Skeleton'
import { EmptyState } from '../common/EmptyState'
import { classNames } from '../../utils/formatters'

/*
  DataTable — presentational admin table.
  columns: [{ key, label, render?(row), align?, hideBelow? }]
  rowActions?: (row) => ReactNode  → renders a trailing Actions column.
*/
export function DataTable({ columns, rows, loading, rowActions, empty }) {
  if (loading) {
    return (
      <div className="divide-y divide-line">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4">
            <Skeleton className="h-10" />
          </div>
        ))}
      </div>
    )
  }

  if (!rows || rows.length === 0) {
    return (
      empty || (
        <EmptyState icon="box" message="Nothing here yet" hint="Records you create will appear in this table." />
      )
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="border-b border-line bg-cream/50 text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={classNames('px-4 py-3 font-semibold', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center', c.hideBelow)}>
                {c.label}
              </th>
            ))}
            {rowActions && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="transition hover:bg-cream/40">
              {columns.map((c) => (
                <td key={c.key} className={classNames('px-4 py-3', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center', c.hideBelow)}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {rowActions && <td className="px-4 py-3"><div className="flex items-center justify-end gap-1.5">{rowActions(row)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
