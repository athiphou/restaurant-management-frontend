import { useMemo, useState } from 'react'
import * as restaurantApi from '../../api/restaurant'
import { useApi } from '../../hooks/useApi'
import { useCrud } from '../../hooks/useCrud'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { PageHeader } from '../../components/common/PageHeader'
import { FormModal } from '../../components/admin/FormModal'
import { Toolbar } from '../../components/admin/Crud'
import { Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { Skeleton } from '../../components/common/Skeleton'
import { classNames } from '../../utils/formatters'

const TABLE_STATUSES = [
  { key: 'available', label: 'Available', card: 'border-brand-200 bg-white text-ink', chip: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  { key: 'occupied', label: 'Occupied', card: 'border-brand-700 bg-brand-700 text-white', chip: 'bg-white/15 text-white', dot: 'bg-gold-400' },
  { key: 'reserved', label: 'Reserved', card: 'border-gold-400 bg-gold-100 text-brand-900', chip: 'bg-gold-200 text-brand-800', dot: 'bg-gold-500' },
]
const statusMeta = (key) => TABLE_STATUSES.find((s) => s.key === (key || '').toLowerCase()) || TABLE_STATUSES[0]

export default function TablesPage() {
  const toast = useToast()
  const { rows, loading, save, del, reload, saving } = useCrud({
    list: restaurantApi.listRestaurantTables,
    create: restaurantApi.createRestaurantTable,
    update: restaurantApi.updateRestaurantTable,
    remove: restaurantApi.deleteRestaurantTable,
  })
  const branches = useApi(restaurantApi.listRestaurantBranches, [])
  const branchName = (id) => branches.data?.find((b) => b.id === id)?.name || (id ? `Branch #${id}` : '—')

  const [branch, setBranch] = useState('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const filtered = useMemo(() => (branch === 'all' ? rows : rows.filter((t) => String(t.branch_id) === String(branch))), [rows, branch])

  const counts = useMemo(() => {
    const c = { available: 0, occupied: 0, reserved: 0 }
    for (const t of filtered) { const m = statusMeta(t.status).key; c[m] = (c[m] || 0) + 1 }
    return c
  }, [filtered])

  const fields = [
    { name: 'branch_id', label: 'Branch', type: 'select', required: true, placeholder: 'Choose a branch', options: (branches.data || []).map((b) => ({ value: b.id, label: b.name })) },
    { name: 'table_number', label: 'Table number', required: true, placeholder: 'T12' },
    { name: 'capacity', label: 'Capacity (seats)', type: 'number', numeric: true, required: true, default: 4 },
    { name: 'status', label: 'Status', type: 'select', options: TABLE_STATUSES.map((s) => ({ value: s.key, label: s.label })), default: 'available' },
  ]

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? 'Table updated' : 'Table created', `Table ${values.table_number}`)
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }
  const remove = async (row) => {
    if (!window.confirm(`Delete table ${row.table_number}?`)) return
    try { await del(row.id); toast.success('Table deleted') } catch (err) { toast.error('Delete failed', err.message) }
  }
  const setStatus = async (row, status) => {
    if ((row.status || 'available') === status) return
    setBusyId(row.id)
    try {
      await restaurantApi.updateRestaurantTable(row.id, { branch_id: row.branch_id, table_number: row.table_number, capacity: row.capacity, status })
      await reload()
    } catch (err) {
      toast.error('Update failed', err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb="Restaurant"
        title="Tables"
        description="Visual floor layout — tap a table to seat, reserve or free it."
        action={<Toolbar onAdd={() => { setEditing(null); setOpen(true) }} addLabel="Add table" />}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-auto min-w-[180px]">
          <option value="all">All branches</option>
          {(branches.data || []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </Select>
        {/* legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted">
          {TABLE_STATUSES.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5">
              <span className={classNames('h-3 w-3 rounded-full', s.dot)} /> {s.label} · {counts[s.key] || 0}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-14 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-300"><Icon name="table" className="h-7 w-7" /></span>
          <p className="mt-3 font-display text-lg font-semibold text-ink">No tables here</p>
          <p className="text-sm text-muted">Add tables to build the floor layout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t) => {
            const meta = statusMeta(t.status)
            const busy = busyId === t.id
            return (
              <div key={t.id} className={classNames('flex flex-col rounded-2xl border-2 p-4 shadow-sm transition', meta.card)}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-bold leading-tight">Table {t.table_number}</p>
                    <p className={classNames('text-xs', t.status === 'occupied' ? 'text-brand-100/80' : 'text-muted')}>
                      <Icon name="users" className="mr-1 inline h-3.5 w-3.5" />{t.capacity} seats
                    </p>
                  </div>
                  <span className={classNames('rounded-full px-2 py-0.5 text-[11px] font-semibold', meta.chip)}>{meta.label}</span>
                </div>

                {/* quick status */}
                <div className="mt-3 flex gap-1">
                  {TABLE_STATUSES.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      disabled={busy}
                      onClick={() => setStatus(t, s.key)}
                      title={s.label}
                      className={classNames(
                        'flex-1 rounded-lg py-1 text-[10px] font-bold uppercase tracking-wide transition disabled:opacity-50',
                        s.key === meta.key
                          ? (t.status === 'occupied' ? 'bg-white/20 text-white' : 'bg-brand-700 text-white')
                          : (t.status === 'occupied' ? 'bg-white/5 text-brand-100 hover:bg-white/10' : 'bg-black/5 text-muted hover:bg-black/10'),
                      )}
                    >
                      {s.label.slice(0, 3)}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-current/10 pt-2">
                  <span className={classNames('text-[11px]', t.status === 'occupied' ? 'text-brand-100/80' : 'text-muted')}>{branchName(t.branch_id)}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => { setEditing(t); setOpen(true) }} className={classNames('grid h-7 w-7 place-items-center rounded-md transition', t.status === 'occupied' ? 'text-white hover:bg-white/15' : 'text-brand-700 hover:bg-brand-50')} aria-label="Edit"><Icon name="edit" className="h-4 w-4" /></button>
                    <button type="button" onClick={() => remove(t)} className={classNames('grid h-7 w-7 place-items-center rounded-md transition', t.status === 'occupied' ? 'text-white hover:bg-white/15' : 'text-rose-600 hover:bg-rose-50')} aria-label="Delete"><Icon name="trash" className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <FormModal open={open} title={editing ? 'Edit table' : 'New table'} fields={fields} initial={editing} id={editing?.id} saving={saving} onCancel={() => setOpen(false)} onSubmit={submit} />
    </div>
  )
}
