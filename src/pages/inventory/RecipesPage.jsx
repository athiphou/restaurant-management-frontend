import { useMemo, useState } from 'react'
import * as inventoryApi from '../../api/inventory'
import * as menuApi from '../../api/menu'
import { useApi } from '../../hooks/useApi'
import { useCrud } from '../../hooks/useCrud'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { PageHeader } from '../../components/common/PageHeader'
import { DataTable } from '../../components/admin/DataTable'
import { FormModal } from '../../components/admin/FormModal'
import { Toolbar, RowActions } from '../../components/admin/Crud'
import { Modal } from '../../components/common/Modal'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import { Icon } from '../../components/ui/Icon'
import { classNames } from '../../utils/formatters'

export default function RecipesPage() {
  const toast = useToast()
  const { rows, loading, save, del, saving } = useCrud({
    list: inventoryApi.listRecipes,
    create: inventoryApi.createRecipe,
    update: inventoryApi.updateRecipe,
    remove: inventoryApi.deleteRecipe,
  })
  const foods = useApi(menuApi.listFoods, [])
  const variants = useApi(menuApi.listVariants, [])
  const ingredients = useApi(inventoryApi.listIngredients, [])

  const [itemsTick, setItemsTick] = useState(0)
  const items = useApi(inventoryApi.listRecipeItems, [itemsTick])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [ingOpen, setIngOpen] = useState(false)
  const [recipe, setRecipe] = useState(null)
  const [draft, setDraft] = useState({ ingredient_id: '', quantity_required: '' })
  const [adding, setAdding] = useState(false)

  const fields = useMemo(
    () => [
      { name: 'food_id', label: 'Dish', type: 'select', required: true, placeholder: 'Choose a dish', options: (foods.data || []).map((f) => ({ value: f.id, label: f.name })) },
      { name: 'variant_id', label: 'Variant', type: 'select', placeholder: 'No specific variant', options: (variants.data || []).map((v) => ({ value: v.id, label: `${v.food?.name || ''} ${v.name}`.trim() || `Variant #${v.id}` })) },
      { name: 'instructions', label: 'Instructions', type: 'textarea', placeholder: 'Preparation steps…' },
    ],
    [foods.data, variants.data],
  )

  const foodName = (r) => r.food?.name || (foods.data || []).find((f) => f.id === r.food_id)?.name || `Dish #${r.food_id}`
  const ingredientName = (id) => (ingredients.data || []).find((i) => i.id === id)?.name || `Ingredient #${id}`
  const recipeItems = (id) => (items.data || []).filter((it) => it.recipe_id === id)

  const submit = async (values, id) => {
    try {
      await save(values, id)
      toast.success(id ? 'Recipe updated' : 'Recipe created')
      setOpen(false)
    } catch (err) {
      toast.error('Save failed', err instanceof ApiError ? err.data?.message || err.message : err.message)
    }
  }
  const remove = async (row) => {
    try { await del(row.id); toast.success('Recipe deleted') } catch (err) { toast.error('Delete failed', err.message) }
  }

  const addItem = async () => {
    if (!draft.ingredient_id || draft.quantity_required === '') { toast.warning('Fill the row', 'Choose an ingredient and a quantity.'); return }
    setAdding(true)
    try {
      await inventoryApi.createRecipeItem({ recipe_id: recipe.id, ingredient_id: Number(draft.ingredient_id), quantity_required: Number(draft.quantity_required) })
      setItemsTick((t) => t + 1)
      setDraft({ ingredient_id: '', quantity_required: '' })
    } catch (err) {
      toast.error('Add failed', err.message)
    } finally {
      setAdding(false)
    }
  }
  const removeItem = async (id) => {
    try { await inventoryApi.deleteRecipeItem(id); setItemsTick((t) => t + 1) } catch (err) { toast.error('Delete failed', err.message) }
  }

  const columns = [
    { key: 'food', label: 'Dish', render: (r) => <span className="flex items-center gap-2 font-semibold text-ink"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon name="chefHat" className="h-4 w-4" /></span>{foodName(r)}</span> },
    { key: 'variant', label: 'Variant', render: (r) => <span className="text-muted">{r.variant?.name || '—'}</span>, hideBelow: 'hidden md:table-cell' },
    { key: 'items', label: 'Ingredients', render: (r) => <span className="inline-flex items-center gap-1 rounded-full bg-cream-soft px-2.5 py-0.5 text-xs font-semibold text-brand-700">{recipeItems(r.id).length}</span> },
    { key: 'instructions', label: 'Instructions', render: (r) => <span className="line-clamp-1 max-w-xs text-muted">{r.instructions || '—'}</span>, hideBelow: 'hidden lg:table-cell' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader breadcrumb="Inventory" title="Recipes" description="Ingredient recipes per dish — what each plate consumes from stock."
        action={<Toolbar onAdd={() => { setEditing(null); setOpen(true) }} addLabel="Add recipe" />} />

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="border-b border-line p-4"><Toolbar /></div>
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          empty={<div className="p-10 text-center text-sm text-muted">No recipes yet.</div>}
          rowActions={(r) => (
            <div className="flex items-center justify-end gap-1.5">
              <button type="button" onClick={() => { setRecipe(r); setIngOpen(true) }} className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50">
                <Icon name="clipboard" className="h-3.5 w-3.5" /> Ingredients
              </button>
              <RowActions onEdit={() => { setEditing(r); setOpen(true) }} onDelete={() => remove(r)} />
            </div>
          )}
        />
      </div>

      <FormModal open={open} title={editing ? 'Edit recipe' : 'New recipe'} fields={fields} initial={editing} id={editing?.id} saving={saving} onCancel={() => setOpen(false)} onSubmit={submit} />

      {/* Ingredients manager */}
      <Modal open={ingOpen} onClose={() => setIngOpen(false)} size="lg" title={recipe ? `Ingredients · ${foodName(recipe)}` : 'Ingredients'}>
        <div className="p-5">
          <ul className="divide-y divide-line rounded-xl border border-line">
            {items.loading && <li className="p-4 text-sm text-muted">Loading…</li>}
            {!items.loading && recipeItems(recipe?.id).length === 0 && <li className="p-4 text-sm text-muted">No ingredients yet.</li>}
            {!items.loading &&
              recipeItems(recipe?.id).map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="font-medium text-ink">{it.ingredient?.name || ingredientName(it.ingredient_id)}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-muted">{Number(it.quantity_required)} {(it.ingredient?.unit) || ''}</span>
                    <button type="button" onClick={() => removeItem(it.id)} className="grid h-7 w-7 place-items-center rounded-md text-rose-600 transition hover:bg-rose-50" aria-label="Remove"><Icon name="trash" className="h-4 w-4" /></button>
                  </span>
                </li>
              ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Select label="Ingredient" className="min-w-[180px] flex-1" value={draft.ingredient_id} onChange={(e) => setDraft((d) => ({ ...d, ingredient_id: e.target.value }))}>
              <option value="">Choose…</option>
              {(ingredients.data || []).map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </Select>
            <div className={classNames('w-28')}>
              <label className="mb-1.5 block text-sm font-medium text-ink">Qty</label>
              <input type="number" step="0.01" value={draft.quantity_required} onChange={(e) => setDraft((d) => ({ ...d, quantity_required: e.target.value }))} className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" />
            </div>
            <Button icon="plus" loading={adding} onClick={addItem}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
