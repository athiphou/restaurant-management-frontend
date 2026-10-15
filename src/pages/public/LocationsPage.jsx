import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { Skeleton } from '../../components/common/Skeleton'
import { googleMapEmbedUrl } from '../../utils/formatters'
import { classNames } from '../../utils/formatters'

export default function LocationsPage() {
  const { branches, restaurants, selectedBranch, setBranch } = useCart()
  const navigate = useNavigate()

  const loading = branches.length === 0 && restaurants.length === 0

  const orderFrom = (id) => {
    setBranch(id)
    navigate('/menu')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">Find us</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Our locations</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Pick a branch to dine in, collect a takeaway or get it delivered near you.
        </p>
      </div>

      {loading ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="space-y-2 p-5">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : branches.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon="mapPin" message="No branches yet" hint="Locations will appear here once they’re set up in the console." />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {branches.map((b) => {
            const rest = restaurants.find((r) => r.id === b.restaurant_id)
            const selected = selectedBranch?.id === b.id
            const mapQuery = b.lat != null ? { lat: b.lat, lng: b.lng } : b.address || rest?.address
            return (
              <div
                key={b.id}
                className={classNames(
                  'overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md',
                  selected ? 'border-brand-700 ring-1 ring-brand-700/30' : 'border-line',
                )}
              >
                <div className="h-44 w-full overflow-hidden bg-cream-soft">
                  {mapQuery && (
                    <iframe
                      title={`${b.name} map`}
                      src={googleMapEmbedUrl(mapQuery)}
                      className="h-full w-full border-0"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">{b.name}</h3>
                      {rest?.name && <p className="text-xs font-medium uppercase tracking-wide text-gold-600">{rest.name}</p>}
                    </div>
                    {selected && (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">Selected</span>
                    )}
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm text-muted">
                    {b.address && <p className="flex items-center gap-2"><Icon name="mapPin" className="h-4 w-4 text-brand-500" /> {b.address}</p>}
                    {b.phone && <p className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4 text-brand-500" /> {b.phone}</p>}
                    {rest?.email && <p className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4 text-brand-500" /> {rest.email}</p>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => orderFrom(b.id)} icon="check">
                      Order from here
                    </Button>
                    {b.lat != null && (
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="secondary" icon="navigation">Directions</Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
