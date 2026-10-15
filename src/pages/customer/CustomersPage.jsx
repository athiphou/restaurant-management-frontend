import * as customerApi from '../../api/customer'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Icon } from '../../components/ui/Icon'
import { classNames } from '../../utils/formatters'

const FIELDS = [
  { name: 'name', label: 'Customer name', required: true, placeholder: 'Sokha Dara' },
  { name: 'phone', label: 'Phone', placeholder: '+855 12 345 678' },
  { name: 'email', label: 'Email', type: 'url', placeholder: 'customer@example.com' },
]

const initials = (name = '') => name.trim().slice(0, 1).toUpperCase() || '?'

export default function CustomersPage() {
  return (
    <SimpleCrudPage
      breadcrumb="People"
      title="Customers"
      singular="customer"
      addLabel="Add customer"
      description="Registered diners and their order history."
      services={{ list: customerApi.listCustomers, create: customerApi.createCustomer, update: customerApi.updateCustomer, remove: customerApi.deleteCustomer }}
      columns={[
        { key: 'name', label: 'Customer', render: (r) => (
          <span className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-sm font-semibold text-white">{initials(r.name)}</span>
            <span className="font-semibold text-ink">{r.name}</span>
          </span>
        ) },
        { key: 'email', label: 'Email', render: (r) => <span className="text-muted">{r.email || '—'}</span>, hideBelow: 'hidden md:table-cell' },
        { key: 'phone', label: 'Phone', render: (r) => <span className="text-muted">{r.phone || '—'}</span> },
        { key: 'orders', label: 'Orders', render: (r) => <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-soft px-2.5 py-0.5 text-xs font-semibold text-brand-700"><Icon name="receipt" className="h-3.5 w-3.5" />{r.orders?.length ?? r.orders_count ?? 0}</span> },
        { key: 'created_at', label: 'Joined', render: (r) => <span className={classNames('text-muted')}>{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</span>, hideBelow: 'hidden lg:table-cell' },
      ]}
      fields={FIELDS}
      getSearchText={(r) => `${r.name} ${r.email || ''} ${r.phone || ''}`}
    />
  )
}
