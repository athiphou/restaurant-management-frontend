import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMenu } from '../../context/MenuContext'
import { FoodCard } from '../../components/customer/FoodCard'
import { SkeletonGrid } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { classNames } from '../../utils/formatters'

const SORTS = [
  { key: 'popular', label: 'Popular' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]

export default function MenuPage() {
  const { categories, foods, loading, error } = useMenu()
  const [params, setParams] = useSearchParams()
  const activeCat = params.get('category') || 'all'
  const q = params.get('q') || ''
  const [sort, setSort] = useState('popular')
  const [availableOnly, setAvailableOnly] = useState(false)

  const setCat = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setParams(next, { replace: true })
  }
  const setQuery = (value) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete('q')
    else next.set('q', value)
    setParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    let list = foods
    if (activeCat !== 'all') {
      const cat = categories.find((c) => String(c.id) === String(activeCat))
      list = cat?.foods || []
    }
    const needle = q.trim().toLowerCase()
    if (needle) list = list.filter((f) => `${f.name} ${f.description || ''}`.toLowerCase().includes(needle))
    if (availableOnly) list = list.filter((f) => f.is_available !== false)
    const price = (f) => Number(f.price) || 0
    list = [...list]
    if (sort === 'price-asc') list.sort((a, b) => price(a) - price(b))
    else if (sort === 'price-desc') list.sort((a, b) => price(b) - price(a))
    else if (sort === 'newest') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    else list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return list
  }, [foods, categories, activeCat, q, sort, availableOnly])

  const activeCategory = categories.find((c) => String(c.id) === String(activeCat))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Our menu</p>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {activeCategory ? activeCategory.name : 'Everything we cook'}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            {activeCategory?.description || 'Fresh Khmer classics, made to order. Tap any dish to choose a size and extras.'}
          </p>
        </div>
      </div>

      {/* Category strip */}
      <div className="scrollbar-warm -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <CatChip active={activeCat === 'all'} onClick={() => setCat('all')} label="All" icon="grid" count={foods.length} />
        {categories.map((c) => (
          <CatChip
            key={c.id}
            active={String(c.id) === String(activeCat)}
            onClick={() => setCat(c.id)}
            label={c.name}
            img={c.image}
            count={c.foods?.length}
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <Icon name="search" className="h-4 w-4" />
          </span>
          <input
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this menu…"
            className="h-10 w-full rounded-full border border-line bg-white pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <label className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm">
          <Icon name="sliders" className="h-4 w-4 text-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cursor-pointer bg-transparent font-medium text-ink outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => setAvailableOnly((v) => !v)}
          className={classNames(
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
            availableOnly ? 'border-brand-700 bg-brand-700 text-white' : 'border-line bg-white text-ink hover:border-brand-300',
          )}
        >
          <Icon name="check" className="h-4 w-4" /> Available only
        </button>
        <span className="ml-auto text-sm text-muted">{loading ? '…' : `${visible.length} dishes`}</span>
      </div>

      {/* Grid */}
      <div className="mt-6">
        {loading ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          <EmptyState
            icon="alert"
            message="We couldn’t load the menu"
            hint="Please check your connection and try again."
            action={<Button variant="secondary" icon="refresh">Retry</Button>}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="search"
            message="No dishes match"
            hint="Try a different category or clear your search."
            action={
              <Button variant="secondary" onClick={() => { setCat('all'); setQuery('') }}>
                Reset filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CatChip({ active, onClick, label, icon, img, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'group flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition',
        active
          ? 'border-brand-700 bg-brand-700 text-white shadow-sm'
          : 'border-line bg-white text-brand-800 hover:border-gold-400',
      )}
    >
      {img ? (
        <img src={img} alt="" className="h-6 w-6 rounded-full object-cover" />
      ) : (
        <Icon name={icon || 'utensils'} className="h-4 w-4" />
      )}
      {label}
      {count != null && (
        <span className={classNames('rounded-full px-1.5 text-xs', active ? 'bg-white/20' : 'bg-cream-soft text-muted')}>
          {count}
        </span>
      )}
    </button>
  )
}
