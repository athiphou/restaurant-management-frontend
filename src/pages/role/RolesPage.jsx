import * as roleApi from '../../api/role'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Badge } from '../../components/ui/Badge'
import { Icon } from '../../components/ui/Icon'

const FIELDS = [
  { name: 'name', label: 'Role name', required: true, placeholder: 'Manager' },
  { name: 'description', label: 'Description', placeholder: 'What this role can do' },
]

export default function RolesPage() {
  return (
    <SimpleCrudPage
      breadcrumb="Access"
      title="Roles"
      singular="role"
      addLabel="Add role"
      description="Permission groups assignable to users."
      services={{ list: roleApi.listRoles, create: roleApi.createRole, update: roleApi.updateRole, remove: roleApi.deleteRole }}
      columns={[
        { key: 'name', label: 'Role', render: (r) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="shield" className="h-4 w-4" /></span>{r.name}</span> },
        { key: 'description', label: 'Description', render: (r) => <span className="text-muted">{r.description || '—'}</span> },
        { key: 'users', label: 'Users', render: (r) => <Badge tone="gray">{r.users?.length ?? r.users_count ?? 0}</Badge> },
      ]}
      fields={FIELDS}
      getSearchText={(r) => `${r.name} ${r.description || ''}`}
    />
  )
}
