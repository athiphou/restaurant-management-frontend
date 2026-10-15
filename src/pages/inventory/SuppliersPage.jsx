import * as inventoryApi from '../../api/inventory'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Icon } from '../../components/ui/Icon'

const FIELDS = [
  { name: 'name', label: 'Supplier name', required: true, placeholder: 'Phnom Penh Produce' },
  { name: 'contact_name', label: 'Contact person', placeholder: 'Sokha' },
  { name: 'phone', label: 'Phone', placeholder: '012 345 678' },
  { name: 'email', label: 'Email', type: 'url', placeholder: 'sales@supplier.com' },
]

export default function SuppliersPage() {
  return (
    <SimpleCrudPage
      breadcrumb="Inventory"
      title="Suppliers"
      singular="supplier"
      addLabel="Add supplier"
      description="Who you buy ingredients from."
      services={{ list: inventoryApi.listSuppliers, create: inventoryApi.createSupplier, update: inventoryApi.updateSupplier, remove: inventoryApi.deleteSupplier }}
      columns={[
        { key: 'name', label: 'Supplier', render: (r) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="store" className="h-4 w-4" /></span>{r.name}</span> },
        { key: 'contact_name', label: 'Contact', render: (r) => <span className="text-muted">{r.contact_name || '—'}</span> },
        { key: 'phone', label: 'Phone', render: (r) => <span className="text-muted">{r.phone || '—'}</span>, hideBelow: 'hidden md:table-cell' },
        { key: 'email', label: 'Email', render: (r) => <span className="text-muted">{r.email || '—'}</span>, hideBelow: 'hidden lg:table-cell' },
      ]}
      fields={FIELDS}
      getSearchText={(r) => `${r.name} ${r.contact_name || ''}`}
    />
  )
}
