import { useMemo, useState } from 'react'
import * as menuApi from '../../api/menu'
import { useApi } from '../../hooks/useApi'
import { useCrud } from '../../hooks/useCrud'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormModal } from '../../components/admin/FormModal'
import { Toolbar, RowActions, AsyncToggle } from '../../components/admin/Crud'
import { Badge } from '../../components/ui/Badge'

export default function AddonsPage() {
  const toast = useToast()
  const { rows, loading, save, del, reload, saving } = useCrud({
    list: menuApi.listAddons,
    create: menuApi.createAddon,
    update: menuApi.updateAddon,
    remove: menuApi.deleteAddon,
  })
  const foods = useApi(menuApi.listFoods, [])
  const foodName = (id) => foods.data?.find((f) => f.id === id)?.name || (id ? `#${id}` : '—')

  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase()
    return n ? rows.filter((r) => `${foodName(r.food_id)} ${r.name}`.toLowerCase().includes(n)) : rows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, q, foods.data])

  const fields = [
    { name: 'food_id', label: 'Dish', type: 'select', required: true, placeholder: 'Choose a dish', options: (foods.data || []).map((f) => ({ value: f.id, label: f.name })) },
    { name: 'name', label: 'Add-on group name', required: true, placeholder: 'Extras' },
    { name: 'is_required', label: 'Required', type: 'toggle', hint: 'Customer must choose at least one item' },
    { name: 'is_available', label: 'Available', type: 'toggle', default: true },
  ]

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? 'Add-on updated' : 'Add-on created', values.name)
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }
  const remove = async (row) => {
    try { await del(row.id); toast.success('Add-on deleted') } catch (err) { toast.error('Delete failed', err.message) }
  }
  const toggleAvail = async (row) => {
    try { await menuApi.toggleAddonAvailability(row.id); await reload() } catch (err) { toast.error('Update failed', err.message) }
  }

  const columns = [
    { key: 'food', label: 'Dish', render: (r) => <span className="font-medium text-ink">{r.food?.name || foodName(r.food_id)}</span> },
    { key: 'name', label: 'Group', render: (r) => <span className="text-ink">{r.name}</span> },
    { key: 'is_required', label: 'Required', render: (r) => (r.is_required ? <Badge tone="gold">Required</Badge> : <Badge tone="gray">Optional</Badge>) },
    { key: 'is_available', label: 'Available', align: 'center', render: (r) => <AsyncToggle value={r.is_available} onChange={() => toggleAvail(r)} /> },
  ]

  return (
    <div className="space-y-5">
      <PageHeader breadcrumb="Menu" title="Food Add-ons" description="Group add-on choices attached to a dish (e.g. Extras, Sides)."
        action={<Toolbar onAdd={() => { setEditing(null); setOpen(true) }} addLabel="Add add-on group" />} />
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="border-b border-line p-4"><Toolbar search={q} onSearch={setQ} placeholder="Search add-ons…" /></div>
        <DataTable columns={columns} rows={filtered} loading={loading}
          empty={<div className="p-10 text-center text-sm text-muted">No add-on groups yet.</div>}
          rowActions={(r) => <RowActions onEdit={() => { setEditing(r); setOpen(true) }} onDelete={() => remove(r)} />} />
      </div>
      <FormModal open={open} title={editing ? 'Edit add-on group' : 'New add-on group'} fields={fields} initial={editing} id={editing?.id} saving={saving} onCancel={() => setOpen(false)} onSubmit={submit} />
    </div>
  )
}
