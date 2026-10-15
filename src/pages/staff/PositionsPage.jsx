import * as staffApi from '../../api/staff'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { formatCurrency } from '../../utils/formatters'

const FIELDS = [
  { name: 'title', label: 'Job title', required: true, placeholder: 'Head Chef' },
  { name: 'base_salary', label: 'Base salary (USD)', type: 'number', numeric: true, placeholder: '450.00' },
]

export default function PositionsPage() {
  return (
    <SimpleCrudPage
      breadcrumb="Staff"
      title="Staff Positions"
      singular="position"
      addLabel="Add position"
      description="Roles and their base pay."
      services={{ list: staffApi.listPositions, create: staffApi.createPosition, update: staffApi.updatePosition, remove: staffApi.deletePosition }}
      columns={[
        { key: 'title', label: 'Title', render: (r) => <span className="font-semibold text-ink">{r.title}</span> },
        { key: 'base_salary', label: 'Base salary', align: 'right', render: (r) => <span className="text-muted">{r.base_salary ? formatCurrency(Number(r.base_salary)) : '—'}</span> },
        { key: 'employees', label: 'Employees', render: (r) => <span className="text-muted">{r.employees?.length ?? 0}</span> },
      ]}
      fields={FIELDS}
      getSearchText={(r) => r.title}
    />
  )
}
