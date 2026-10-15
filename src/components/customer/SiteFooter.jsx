import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useMenu } from '../../context/MenuContext'
import { Icon } from '../ui/Icon'

export function SiteFooter() {
  const { restaurant, branches } = useCart()
  const { categories } = useMenu()
  const name = restaurant?.name || 'Restaurant'
  const top = categories.slice(0, 6)

  return (
    <footer className="mt-20 bg-brand-800 text-brand-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 font-display text-lg font-bold text-brand-900">
              {name.slice(0, 1)}
            </span>
            <span className="font-display text-xl font-bold text-white">{name}</span>
          </div>
          <p className="mt-3 text-sm text-brand-100/80">
            Authentic Khmer flavours, made for every moment. Dine-in, takeaway or fast delivery
            across the country.
          </p>
          <div className="mt-4 flex gap-2">
            {['Cash', 'KHQR', 'Card'].map((m) => (
              <span key={m} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-50">
                {m}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-gold-400">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-100/80">
            <li><Link to="/menu" className="transition hover:text-white">Full menu</Link></li>
            <li><Link to="/locations" className="transition hover:text-white">Locations</Link></li>
            <li><Link to="/tracking" className="transition hover:text-white">Track an order</Link></li>
            <li><Link to="/account" className="transition hover:text-white">My account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-gold-400">Categories</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-100/80">
            {top.map((c) => (
              <li key={c.id}>
                <Link to={`/menu?category=${c.id}`} className="transition hover:text-white">{c.name}</Link>
              </li>
            ))}
            {top.length === 0 && <li className="text-brand-100/50">Loading…</li>}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-gold-400">Visit us</h4>
          <ul className="mt-3 space-y-3 text-sm text-brand-100/80">
            {(branches.length ? branches : [{ name, address: restaurant?.address }]).slice(0, 3).map((b, i) => (
              <li key={b.id ?? i} className="flex gap-2">
                <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>
                  <span className="block font-medium text-white">{b.name}</span>
                  {b.address && <span className="block text-brand-100/70">{b.address}</span>}
                </span>
              </li>
            ))}
            {restaurant?.phone && (
              <li className="flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-gold-400" />
                <a href={`tel:${restaurant.phone}`} className="transition hover:text-white">{restaurant.phone}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-100/60">
        © {new Date().getFullYear()} {name}. Crafted with care · Authentic Khmer Kitchen
      </div>
    </footer>
  )
}
