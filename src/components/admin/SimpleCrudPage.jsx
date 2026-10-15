import { useMemo, useState } from 'react'
import { useCrud } from '../../hooks/useCrud'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { PageHeader } from '../common/PageHeader'
import { DataTable } from './DataTable'
import { FormModal } from './FormModal'
import { Toolbar, RowActions } from './Crud'

/*
  SimpleCrudPage — a full CRUD screen (list + search + create/edit modal + delete)
  driven by config. Pages pass services (menuApi/staffApi/... functions), table
  columns and form fields. `getSearchText` enables the search box; `toolbarRight`
  hosts extra filters.
*/
export function SimpleCrudPage({
  breadcrumb,
  title,
  description,
  addLabel = 'Add',
  singular = 'record',
  services,
  columns,
  fields,
  getSearchText,
  toolbarRight,
  emptyMessage,
  mapRow,
}) {
  const toast = useToast()
  const { rows, loading, save, del, saving, toForm } = useCrud({ ...services, mapRow })
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = useMemo(() => {
    if (!getSearchText) return rows
    const n = q.trim().toLowerCase()
    return n ? rows.filter((r) => String(getSearchText(r)).toLowerCase().includes(n)) : rows
  }, [rows, q, getSearchText])

  const openCreate = () => { setEditing(null); setOpen(true) }
  const openEdit = (row) => { setEditing(row); setOpen(true) }

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? `${title} updated` : `${title.replace(/s$/, '')} created`, values.name || values.title || values.code || '')
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }

  const remove = async (row) => {
    try {
      await del(row.id)
      toast.success(`${singular} deleted`)
    } catch (err) {
      toast.error('Delete failed', err.message)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumb={breadcrumb}
        title={title}
        description={description}
        action={<Toolbar onAdd={openCreate} addLabel={addLabel} />}
      />
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          {getSearchText && <Toolbar search={q} onSearch={setQ} placeholder={`Search ${title.toLowerCase()}…`} />}
          {toolbarRight}
        </div>
        <DataTable
          columns={columns}
          rows={filtered}
          loading={loading}
          empty={<div className="p-10 text-center text-sm text-muted">{emptyMessage || `No ${title.toLowerCase()} yet.`}</div>}
          rowActions={(r) => <RowActions onEdit={() => openEdit(r)} onDelete={() => remove(r)} />}
        />
      </div>
      <FormModal
        open={open}
        title={editing ? `Edit ${singular}` : `New ${singular}`}
        fields={fields}
        initial={editing ? toForm(editing) : null}
        id={editing?.id}
        saving={saving}
        onCancel={() => setOpen(false)}
        onSubmit={submit}
      />
    </div>
  )
}
