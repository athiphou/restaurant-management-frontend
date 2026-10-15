import { useMemo, useState } from 'react'
import * as menuApi from '../../api/menu'
import { useCrud } from '../../hooks/useCrud'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormModal } from '../../components/admin/FormModal'
import { Toolbar, RowActions, AsyncToggle } from '../../components/admin/Crud'
import { Badge } from '../../components/ui/Badge'
import { FoodImage } from '../../components/customer/FoodImage'

const FIELDS = [
  { name: 'name', label: 'Category name', required: true, placeholder: 'Khmer Curries' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Short description of the category' },
  { name: 'image', label: 'Image URL', type: 'url', colSpan: 'full', placeholder: 'https://…' },
  { name: 'sort_order', label: 'Sort order', type: 'number', numeric: true, default: 0 },
  { name: 'is_active', label: 'Active', type: 'toggle', default: true, hint: 'Show this category on the site' },
]

export default function CategoriesPage() {
  const toast = useToast()
  const { rows, loading, save, del, reload, saving } = useCrud({
    list: menuApi.listFoodCategories,
    create: menuApi.createFoodCategory,
    update: menuApi.updateFoodCategory,
    remove: menuApi.deleteFoodCategory,
  })
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase()
    return n ? rows.filter((r) => `${r.name} ${r.description || ''}`.toLowerCase().includes(n)) : rows
  }, [rows, q])

  const openCreate = () => { setEditing(null); setOpen(true) }
  const openEdit = (row) => { setEditing(row); setOpen(true) }

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? 'Category updated' : 'Category created', values.name)
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }

  const remove = async (row) => {
    try {
      await del(row.id)
      toast.success('Category deleted', row.name)
    } catch (err) {
      toast.error('Delete failed', err.message)
    }
  }

  const toggleActive = async (row) => {
    try {
      await menuApi.toggleCategoryActive(row.id)
      await reload()
    } catch (err) {
      toast.error('Update failed', err.message)
    }
  }

  const columns = [
    {
      key: 'image',
      label: '',
      render: (r) => <FoodImage src={r.image} alt="" className="h-11 w-11 rounded-lg" iconClass="h-5 w-5" />,
    },
    { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
    { key: 'description', label: 'Description', render: (r) => <span className="line-clamp-1 max-w-xs text-muted">{r.description || '—'}</span>, hideBelow: 'hidden lg:table-cell' },
    {
      key: 'is_active',
      label: 'Active',
      render: (r) => (
        <div className="flex items-center gap-2">
          <AsyncToggle value={r.is_active} onChange={() => toggleActive(r)} />
          <Badge tone={r.is_active ? 'green' : 'gray'}>{r.is_active ? 'Active' : 'Hidden'}</Badge>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb="Menu"
        title="Food Categories"
        description="Group your dishes into categories shown on the customer site."
        action={<Toolbar onAdd={openCreate} addLabel="Add category" />}
      />

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="border-b border-line p-4">
          <Toolbar search={q} onSearch={setQ} placeholder="Search categories…" />
        </div>
        <DataTable
          columns={columns}
          rows={filtered}
          loading={loading}
          empty={<Empty msg="No categories yet" />}
          rowActions={(r) => (
            <RowActions
              onEdit={() => openEdit(r)}
              onDelete={() => remove(r)}
            />
          )}
        />
      </div>

      <FormModal
        open={open}
        title={editing ? 'Edit category' : 'New category'}
        fields={FIELDS}
        initial={editing}
        id={editing?.id}
        saving={saving}
        onCancel={() => setOpen(false)}
        onSubmit={submit}
      />
    </div>
  )
}

function Empty({ msg }) {
  return <div className="p-10 text-center text-sm text-muted">{msg}</div>
}
