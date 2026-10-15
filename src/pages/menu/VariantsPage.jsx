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
import { formatCurrency } from '../../utils/formatters'

export default function VariantsPage() {
  const toast = useToast()
  const { rows, loading, save, del, reload, saving } = useCrud({
    list: menuApi.listVariants,
    create: menuApi.createVariant,
    update: menuApi.updateVariant,
    remove: menuApi.deleteVariant,
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
    { name: 'name', label: 'Variant name', required: true, placeholder: 'Large' },
    { name: 'price', label: 'Price (USD)', type: 'number', numeric: true, required: true, placeholder: '8.00' },
    { name: 'is_available', label: 'Available', type: 'toggle', default: true },
  ]

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? 'Variant updated' : 'Variant created', values.name)
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }
  const remove = async (row) => {
    try { await del(row.id); toast.success('Variant deleted') } catch (err) { toast.error('Delete failed', err.message) }
  }
  const toggleAvail = async (row) => {
    try { await menuApi.toggleVariantAvailability(row.id); await reload() } catch (err) { toast.error('Update failed', err.message) }
  }

  const columns = [
    { key: 'food', label: 'Dish', render: (r) => <span className="font-medium text-ink">{r.food?.name || foodName(r.food_id)}</span> },
    { key: 'name', label: 'Variant', render: (r) => <span className="text-ink">{r.name}</span> },
    { key: 'price', label: 'Price', align: 'right', render: (r) => <span className="font-semibold text-brand-700">{formatCurrency(Number(r.price) || 0)}</span> },
    { key: 'is_available', label: 'Available', align: 'center', render: (r) => <AsyncToggle value={r.is_available} onChange={() => toggleAvail(r)} /> },
  ]

  return (
    <div className="space-y-5">
      <PageHeader breadcrumb="Menu" title="Food Variants" description="Sizes and options for each dish (e.g. Regular / Large)."
        action={<Toolbar onAdd={() => { setEditing(null); setOpen(true) }} addLabel="Add variant" />} />
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="border-b border-line p-4"><Toolbar search={q} onSearch={setQ} placeholder="Search variants…" /></div>
        <DataTable columns={columns} rows={filtered} loading={loading}
          empty={<div className="p-10 text-center text-sm text-muted">No variants yet.</div>}
          rowActions={(r) => <RowActions onEdit={() => { setEditing(r); setOpen(true) }} onDelete={() => remove(r)} />} />
      </div>
      <FormModal open={open} title={editing ? 'Edit variant' : 'New variant'} fields={fields} initial={editing} id={editing?.id} saving={saving} onCancel={() => setOpen(false)} onSubmit={submit} />
    </div>
  )
}
