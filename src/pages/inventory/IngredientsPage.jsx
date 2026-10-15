import * as inventoryApi from '../../api/inventory'
import { SimpleCrudPage } from '../../components/admin/SimpleCrudPage'
import { Badge } from '../../components/ui/Badge'

const FIELDS = [
  { name: 'name', label: 'Ingredient name', required: true, placeholder: 'Fish paste' },
  { name: 'unit', label: 'Unit', required: true, placeholder: 'kg / g / ml / pcs' },
  { name: 'reorder_level', label: 'Reorder level', type: 'number', numeric: true, default: 0, hint: 'Warn when stock falls to this level' },
]

export default function IngredientsPage() {
  return (
    <SimpleCrudPage
      breadcrumb="Inventory"
      title="Ingredients"
      singular="ingredient"
      addLabel="Add ingredient"
      description="Raw items tracked in stock."
      services={{ list: inventoryApi.listIngredients, create: inventoryApi.createIngredient, update: inventoryApi.updateIngredient, remove: inventoryApi.deleteIngredient }}
      columns={[
        { key: 'name', label: 'Ingredient', render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
        { key: 'unit', label: 'Unit', render: (r) => <Badge tone="brand">{r.unit}</Badge> },
        { key: 'reorder_level', label: 'Reorder level', align: 'right', render: (r) => <span className="text-muted">{r.reorder_level ?? 0}</span> },
      ]}
      fields={FIELDS}
      getSearchText={(r) => r.name}
    />
  )
}
