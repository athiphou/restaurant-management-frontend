import * as staffApi from '../../api/staff'
import * as restaurantApi from '../../api/restaurant'
import { useApi } from '../../hooks/useApi'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Icon } from '../../components/ui/Icon'
import { formatCurrency } from '../../utils/formatters'

export default function EmployeesPage() {
  const positions = useApi(staffApi.listPositions, [])
  const branches = useApi(restaurantApi.listRestaurantBranches, [])

  const fields = [
    { name: 'user_id', label: 'User account ID', type: 'number', numeric: true, required: true, hint: 'ID of the linked user account' },
    { name: 'position_id', label: 'Position', type: 'select', required: true, placeholder: 'Choose a position', options: (positions.data || []).map((p) => ({ value: p.id, label: p.title })) },
    { name: 'branch_id', label: 'Branch', type: 'select', required: true, placeholder: 'Choose a branch', options: (branches.data || []).map((b) => ({ value: b.id, label: b.name })) },
    { name: 'hire_date', label: 'Hire date', type: 'date', required: true },
    { name: 'salary', label: 'Salary (USD)', type: 'number', numeric: true, required: true, placeholder: '500.00' },
  ]

  return (
    <SimpleCrudPage
      breadcrumb="Staff"
      title="Employees"
      singular="employee"
      addLabel="Add employee"
      description="Staff assigned to a branch and position."
      services={{ list: staffApi.listEmployees, create: staffApi.createEmployee, update: staffApi.updateEmployee, remove: staffApi.deleteEmployee }}
      columns={[
        { key: 'user', label: 'Employee', render: (r) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="user" className="h-4 w-4" /></span>{r.user?.name || `User #${r.user_id}`}</span> },
        { key: 'position', label: 'Position', render: (r) => <span className="text-muted">{r.position?.title || '—'}</span> },
        { key: 'branch', label: 'Branch', render: (r) => <span className="text-muted">{r.branch?.name || '—'}</span>, hideBelow: 'hidden md:table-cell' },
        { key: 'hire_date', label: 'Hired', render: (r) => <span className="text-muted">{r.hire_date ? new Date(r.hire_date).toLocaleDateString() : '—'}</span>, hideBelow: 'hidden lg:table-cell' },
        { key: 'salary', label: 'Salary', align: 'right', render: (r) => <span className="font-semibold text-brand-700">{formatCurrency(Number(r.salary) || 0)}</span> },
      ]}
      fields={fields}
      getSearchText={(r) => `${r.user?.name || ''} ${r.position?.title || ''}`}
    />
  )
}
