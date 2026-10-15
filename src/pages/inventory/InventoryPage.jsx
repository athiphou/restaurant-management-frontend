import * as inventoryApi from '../../api/inventory'
import * as restaurantApi from '../../api/restaurant'
import { useApi } from '../../hooks/useApi'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Badge } from '../../components/ui/Badge'

export default function InventoryPage() {
  const branches = useApi(restaurantApi.listRestaurantBranches, [])
  const ingredients = useApi(inventoryApi.listIngredients, [])

  const fields = [
    { name: 'branch_id', label: 'Branch', type: 'select', required: true, placeholder: 'Choose a branch', options: (branches.data || []).map((b) => ({ value: b.id, label: b.name })) },
    { name: 'ingredient_id', label: 'Ingredient', type: 'select', required: true, placeholder: 'Choose an ingredient', options: (ingredients.data || []).map((i) => ({ value: i.id, label: i.name })) },
    { name: 'quantity', label: 'Quantity in stock', type: 'number', numeric: true, required: true, default: 0 },
  ]

  const stockBadge = (r) => {
    const qty = Number(r.quantity) || 0
    const reorder = Number(r.ingredient?.reorder_level) || 0
    if (qty <= 0) return <Badge tone="red" dot>Out of stock</Badge>
    if (reorder && qty <= reorder) return <Badge tone="gold" dot>Low stock</Badge>
    return <Badge tone="green" dot>In stock</Badge>
  }

  return (
    <SimpleCrudPage
      breadcrumb="Inventory"
      title="Inventory"
      singular="stock item"
      addLabel="Add stock"
      description="Per-branch stock levels for each ingredient."
      services={{ list: inventoryApi.listInventory, create: inventoryApi.createInventory, update: inventoryApi.updateInventory, remove: inventoryApi.deleteInventory }}
      columns={[
        { key: 'ingredient', label: 'Ingredient', render: (r) => <span className="font-semibold text-ink">{r.ingredient?.name || `Ingredient #${r.ingredient_id}`}</span> },
        { key: 'branch', label: 'Branch', render: (r) => <span className="text-muted">{r.branch?.name || '—'}</span>, hideBelow: 'hidden md:table-cell' },
        { key: 'quantity', label: 'Stock', align: 'right', render: (r) => <span className="font-semibold text-brand-700">{Number(r.quantity) || 0} {r.ingredient?.unit || ''}</span> },
        { key: 'status', label: 'Status', render: stockBadge },
      ]}
      fields={fields}
      getSearchText={(r) => `${r.ingredient?.name || ''} ${r.branch?.name || ''}`}
    />
  )
}
