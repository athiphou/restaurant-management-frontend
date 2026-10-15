import * as inventoryApi from '../../api/inventory'
import { useApi } from '../../hooks/useApi'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'

const TYPES = ['purchase', 'sale', 'adjustment', 'waste'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }))
const toneFor = (t) => ({ purchase: 'green', sale: 'brand', adjustment: 'blue', waste: 'red' }[(t || '').toLowerCase()] || 'gray')

export default function TransactionsPage() {
  const inventory = useApi(inventoryApi.listInventory, [])
  const suppliers = useApi(inventoryApi.listSuppliers, [])

  const invLabel = (r) => r.ingredient?.name || r.inventory?.ingredient?.name || `Stock #${r.inventory_id}`
  const fields = [
    { name: 'inventory_id', label: 'Stock item', type: 'select', required: true, placeholder: 'Choose a stock item', options: (inventory.data || []).map((i) => ({ value: i.id, label: `${i.ingredient?.name || 'Stock'} · ${i.branch?.name || ''}` })) },
    { name: 'supplier_id', label: 'Supplier', type: 'select', placeholder: 'None', options: (suppliers.data || []).map((s) => ({ value: s.id, label: s.name })) },
    { name: 'transaction_type', label: 'Type', type: 'select', required: true, options: TYPES },
    { name: 'quantity', label: 'Quantity', type: 'number', numeric: true, required: true },
    { name: 'unit_cost', label: 'Unit cost ($)', type: 'number', numeric: true, default: 0 },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ]

  return (
    <SimpleCrudPage
      breadcrumb="Inventory"
      title="Inventory Transactions"
      singular="transaction"
      addLabel="Add transaction"
      description="Stock in/out movements and their cost."
      services={{ list: inventoryApi.listTransactions, create: inventoryApi.createTransaction, update: inventoryApi.updateTransaction, remove: inventoryApi.deleteTransaction }}
      columns={[
        { key: 'inv', label: 'Ingredient', render: (r) => <span className="font-semibold text-ink">{invLabel(r)}</span> },
        { key: 'type', label: 'Type', render: (r) => <Badge tone={toneFor(r.transaction_type)}>{r.transaction_type}</Badge> },
        { key: 'supplier', label: 'Supplier', render: (r) => <span className="text-muted">{r.supplier?.name || '—'}</span>, hideBelow: 'hidden md:table-cell' },
        { key: 'quantity', label: 'Qty', align: 'right', render: (r) => <span className="font-medium text-ink">{Number(r.quantity) || 0}</span> },
        { key: 'unit_cost', label: 'Unit cost', align: 'right', render: (r) => <span className="text-muted">{formatCurrency(Number(r.unit_cost) || 0)}</span>, hideBelow: 'hidden lg:table-cell' },
        { key: 'created_at', label: 'Date', render: (r) => <span className="text-muted">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</span>, hideBelow: 'hidden lg:table-cell' },
      ]}
      fields={fields}
      getSearchText={(r) => `${invLabel(r)} ${r.transaction_type || ''}`}
    />
  )
}
