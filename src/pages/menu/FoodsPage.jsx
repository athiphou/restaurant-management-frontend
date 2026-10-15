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
import { FoodImage } from '../../components/customer/FoodImage'
import { Select } from '../../components/ui/Input'
import { formatCurrency } from '../../utils/formatters'

export default function FoodsPage() {
  const toast = useToast()
  const { rows, loading, save, del, reload, saving } = useCrud({
    list: menuApi.listFoods,
    create: menuApi.createFood,
    update: menuApi.updateFood,
    remove: menuApi.deleteFood,
  })
  const cats = useApi(menuApi.listFoodCategories, [])

  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    let list = rows
    if (cat !== 'all') list = list.filter((f) => String(f.category_id) === String(cat))
    const n = q.trim().toLowerCase()
    if (n) list = list.filter((f) => `${f.name} ${f.description || ''}`.toLowerCase().includes(n))
    return list
  }, [rows, cat, q])

  const fields = [
    { name: 'name', label: 'Dish name', required: true, placeholder: 'Fish Amok' },
    {
      name: 'category_id',
      label: 'Category',
      type: 'select',
      required: true,
      placeholder: 'Choose a category',
      options: (cats.data || []).map((c) => ({ value: c.id, label: c.name })),
    },
    { name: 'price', label: 'Price (USD)', type: 'number', numeric: true, required: true, placeholder: '6.50' },
    { name: 'image', label: 'Image URL', type: 'url', colSpan: 'full', placeholder: 'https://…' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Traditional Khmer steamed curry…' },
    { name: 'is_available', label: 'Available', type: 'toggle', default: true, hint: 'Customers can order this dish' },
  ]

  const openCreate = () => { setEditing(null); setOpen(true) }
  const openEdit = (row) => { setEditing(row); setOpen(true) }

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? 'Dish updated' : 'Dish created', values.name)
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }

  const remove = async (row) => {
    try {
      await del(row.id)
      toast.success('Dish deleted', row.name)
    } catch (err) {
      toast.error('Delete failed', err.message)
    }
  }

  const toggleAvail = async (row) => {
    try {
      await menuApi.toggleFoodAvailability(row.id)
      await reload()
    } catch (err) {
      toast.error('Update failed', err.message)
    }
  }

  const columns = [
    { key: 'image', label: '', render: (r) => <FoodImage src={r.image} alt="" className="h-11 w-11 rounded-lg" iconClass="h-5 w-5" /> },
    { key: 'name', label: 'Dish', render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
    { key: 'category', label: 'Category', render: (r) => <span className="text-muted">{r.category?.name || '—'}</span>, hideBelow: 'hidden md:table-cell' },
    { key: 'price', label: 'Price', align: 'right', render: (r) => <span className="font-semibold text-brand-700">{formatCurrency(Number(r.price) || 0)}</span> },
    {
      key: 'is_available',
      label: 'Available',
      align: 'center',
      render: (r) => <AsyncToggle value={r.is_available} onChange={() => toggleAvail(r)} />,
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb="Menu"
        title="Foods"
        description="Manage every dish on the menu."
        action={<Toolbar onAdd={openCreate} addLabel="Add dish" />}
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <Toolbar search={q} onSearch={setQ} placeholder="Search dishes…" />
          <Select value={cat} onChange={(e) => setCat(e.target.value)} className="w-auto min-w-[160px]">
            <option value="all">All categories</option>
            {(cats.data || []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        <DataTable
          columns={columns}
          rows={filtered}
          loading={loading}
          empty={<div className="p-10 text-center text-sm text-muted">No dishes found.</div>}
          rowActions={(r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => remove(r)} />}
        />
      </div>

      <FormModal
        open={open}
        title={editing ? 'Edit dish' : 'New dish'}
        fields={fields}
        initial={editing}
        id={editing?.id}
        saving={saving}
        onCancel={() => setOpen(false)}
        onSubmit={submit}
      />
    </div>
  )
}
