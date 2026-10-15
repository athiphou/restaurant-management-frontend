import { useMemo, useState } from 'react'
import * as restaurantApi from '../../api/restaurant'
import { useApi } from '../../hooks/useApi'
import { useCrud } from '../../hooks/useCrud'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormModal } from '../../components/admin/FormModal'
import { Toolbar, RowActions } from '../../components/admin/Crud'
import { Select } from '../../components/ui/Input'
import { Icon } from '../../components/ui/Icon'

export default function BranchesPage() {
  const toast = useToast()
  const { rows, loading, save, del, saving } = useCrud({
    list: restaurantApi.listRestaurantBranches,
    create: restaurantApi.createRestaurantBranch,
    update: restaurantApi.updateRestaurantBranch,
    remove: restaurantApi.deleteRestaurantBranch,
  })
  const restaurants = useApi(restaurantApi.listRestaurants, [])
  const restName = (id) => restaurants.data?.find((r) => r.id === id)?.name || (id ? `#${id}` : '—')

  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    let list = rows
    if (filter !== 'all') list = list.filter((b) => String(b.restaurant_id) === String(filter))
    const n = q.trim().toLowerCase()
    if (n) list = list.filter((b) => `${b.name} ${b.address || ''}`.toLowerCase().includes(n))
    return list
  }, [rows, filter, q])

  const fields = [
    { name: 'restaurant_id', label: 'Restaurant', type: 'select', required: true, placeholder: 'Choose a restaurant', options: (restaurants.data || []).map((r) => ({ value: r.id, label: r.name })) },
    { name: 'name', label: 'Branch name', required: true, placeholder: 'Downtown Branch' },
    { name: 'phone', label: 'Phone', placeholder: '02-111-2222' },
    { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Street, city' },
  ]

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? 'Branch updated' : 'Branch created', values.name)
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }
  const remove = async (row) => {
    try { await del(row.id); toast.success('Branch deleted', row.name) } catch (err) { toast.error('Delete failed', err.message) }
  }

  const columns = [
    { key: 'restaurant', label: 'Restaurant', render: (b) => <span className="text-muted">{b.restaurant?.name || restName(b.restaurant_id)}</span> },
    { key: 'name', label: 'Branch', render: (b) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="mapPin" className="h-4 w-4" /></span>{b.name}</span> },
    { key: 'phone', label: 'Phone', render: (b) => <span className="text-muted">{b.phone || '—'}</span>, hideBelow: 'hidden md:table-cell' },
    { key: 'address', label: 'Address', render: (b) => <span className="line-clamp-1 max-w-xs text-muted">{b.address || '—'}</span>, hideBelow: 'hidden lg:table-cell' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader breadcrumb="Restaurant" title="Branches" description="Physical locations for each restaurant."
        action={<Toolbar onAdd={() => { setEditing(null); setOpen(true) }} addLabel="Add branch" />} />
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <Toolbar search={q} onSearch={setQ} placeholder="Search branches…" />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-auto min-w-[170px]">
            <option value="all">All restaurants</option>
            {(restaurants.data || []).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Select>
        </div>
        <DataTable columns={columns} rows={filtered} loading={loading}
          empty={<div className="p-10 text-center text-sm text-muted">No branches yet.</div>}
          rowActions={(r) => <RowActions onEdit={() => { setEditing(r); setOpen(true) }} onDelete={() => remove(r)} />} />
      </div>
      <FormModal open={open} title={editing ? 'Edit branch' : 'New branch'} fields={fields} initial={editing} id={editing?.id} saving={saving} onCancel={() => setOpen(false)} onSubmit={submit} />
    </div>
  )
}
