import { useMemo, useState } from 'react'
import * as roleApi from '../../api/role'
import { useApi } from '../../hooks/useApi'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormModal } from '../../components/admin/FormModal'
import { Toolbar, RowActions } from '../../components/admin/Crud'
import { Icon } from '../../components/ui/Icon'

const FIELDS = [
  { name: 'user_id', label: 'User account ID', type: 'number', numeric: true, required: true, hint: 'ID of the user to grant a role to' },
  { name: 'role_id', label: 'Role', type: 'select', required: true, placeholder: 'Choose a role', options: [] },
]

export default function UserRolesPage() {
  const toast = useToast()
  const roles = useApi(roleApi.listRoles, [])
  const [tick, setTick] = useState(0)
  const list = useApi(roleApi.listUserRoles, [tick])
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const roleName = (id) => roles.data?.find((r) => r.id === id)?.name || (id ? `Role #${id}` : '—')

  const fields = useMemo(() => FIELDS.map((f) => (f.name === 'role_id' ? { ...f, options: (roles.data || []).map((r) => ({ value: r.id, label: r.name })) } : f)), [roles.data])

  const assign = async (values) => {
    setSaving(true)
    try {
      await roleApi.assignRole(values)
      toast.success('Role assigned')
      setOpen(false)
      setTick((t) => t + 1)
    } catch (err) {
      toast.error('Assign failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    } finally {
      setSaving(false)
    }
  }

  const revoke = async (row) => {
    try {
      await roleApi.revokeRole(row.id)
      toast.success('Role revoked')
      setTick((t) => t + 1)
    } catch (err) {
      toast.error('Revoke failed', err.message)
    }
  }

  const columns = [
    { key: 'user', label: 'User', render: (r) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="user" className="h-4 w-4" /></span>{r.user?.name || `User #${r.user_id}`}</span> },
    { key: 'email', label: 'Email', render: (r) => <span className="text-muted">{r.user?.email || '—'}</span>, hideBelow: 'hidden md:table-cell' },
    { key: 'role', label: 'Role', render: (r) => <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800"><Icon name="shield" className="h-3.5 w-3.5" />{r.role?.name || roleName(r.role_id)}</span> },
  ]

  return (
    <div className="space-y-5">
      <PageHeader breadcrumb="Access" title="User Roles" description="Grant or revoke roles for user accounts."
        action={<Toolbar onAdd={() => setOpen(true)} addLabel="Assign role" />} />
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <DataTable columns={columns} rows={list.data || []} loading={list.loading}
          empty={<div className="p-10 text-center text-sm text-muted">No role assignments yet.</div>}
          rowActions={(r) => <RowActions onDelete={() => revoke(r)} />} />
      </div>
      <FormModal open={open} title="Assign role" fields={fields} initial={null} id={null} saving={saving} onCancel={() => setOpen(false)} onSubmit={assign} />
    </div>
  )
}
