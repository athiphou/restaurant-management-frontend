import { useMemo, useState } from 'react'
import * as restaurantApi from '../../api/restaurant'
import { useCrud } from '../../hooks/useCrud'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormModal } from '../../components/admin/FormModal'
import { Toolbar, RowActions } from '../../components/admin/Crud'
import { Icon } from '../../components/ui/Icon'

const FIELDS = [
  { name: 'name', label: 'Restaurant name', required: true, placeholder: 'The Food Place' },
  { name: 'phone', label: 'Phone', placeholder: '02-999-9999' },
  { name: 'email', label: 'Email', type: 'url', placeholder: 'info@restaurant.com' },
  { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Street, city' },
]

export default function RestaurantsPage() {
  const toast = useToast()
  const { rows, loading, save, del, saving } = useCrud({
    list: restaurantApi.listRestaurants,
    create: restaurantApi.createRestaurant,
    update: restaurantApi.updateRestaurant,
    remove: restaurantApi.deleteRestaurant,
  })
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase()
    return n ? rows.filter((r) => `${r.name} ${r.address || ''}`.toLowerCase().includes(n)) : rows
  }, [rows, q])

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? 'Restaurant updated' : 'Restaurant created', values.name)
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }
  const remove = async (row) => {
    try { await del(row.id); toast.success('Restaurant deleted', row.name) } catch (err) { toast.error('Delete failed', err.message) }
  }

  const columns = [
    { key: 'name', label: 'Restaurant', render: (r) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="building" className="h-4 w-4" /></span>{r.name}</span> },
    { key: 'phone', label: 'Phone', render: (r) => <span className="text-muted">{r.phone || '—'}</span> },
    { key: 'email', label: 'Email', render: (r) => <span className="text-muted">{r.email || '—'}</span>, hideBelow: 'hidden lg:table-cell' },
    { key: 'address', label: 'Address', render: (r) => <span className="line-clamp-1 max-w-xs text-muted">{r.address || '—'}</span>, hideBelow: 'hidden md:table-cell' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader breadcrumb="Restaurant" title="Restaurants" description="Manage restaurant brands."
        action={<Toolbar onAdd={() => { setEditing(null); setOpen(true) }} addLabel="Add restaurant" />} />
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="border-b border-line p-4"><Toolbar search={q} onSearch={setQ} placeholder="Search restaurants…" /></div>
        <DataTable columns={columns} rows={filtered} loading={loading}
          empty={<div className="p-10 text-center text-sm text-muted">No restaurants yet.</div>}
          rowActions={(r) => <RowActions onEdit={() => { setEditing(r); setOpen(true) }} onDelete={() => remove(r)} />} />
      </div>
      <FormModal open={open} title={editing ? 'Edit restaurant' : 'New restaurant'} fields={FIELDS} initial={editing} id={editing?.id} saving={saving} onCancel={() => setOpen(false)} onSubmit={submit} />
    </div>
  )
}
