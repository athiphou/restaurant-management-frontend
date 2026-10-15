import { Link } from 'react-router-dom'
import { useMenu } from '../../context/MenuContext'
import { useCart } from '../../context/CartContext'
import { useApi } from '../../hooks/useApi'
import * as promotionApi from '../../api/promotion'
import { STEPS, REVIEWS } from '../../data/catalog'
import { FoodCard } from '../../components/customer/FoodCard'
import { SkeletonCard } from '../../components/common/Skeleton'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { Stars } from '../../components/customer/FoodImage'
import { formatCurrency } from '../../utils/formatters'
import { classNames } from '../../utils/formatters'

const FEATURES = [
  { icon: 'bike', title: 'Fast Delivery', text: 'Hot food at your door, tracked live.' },
  { icon: 'utensils', title: 'Dine In', text: 'Reserve a table and order from your seat.' },
  { icon: 'shoppingBag', title: 'Takeaway', text: 'Ready for pickup in minutes.' },
]

export default function HomePage() {
  const { categories, foods, loading } = useMenu()
  const { restaurant } = useCart()
  const promos = useApi(promotionApi.listPromotions, [])

  const name = restaurant?.name || 'Our Kitchen'
  const heroImg = categories[0]?.image || foods[0]?.image
  const featured = foods.filter((f) => f.is_available !== false).slice(0, 8)
  const activePromo = (promos.data || []).find((p) => p.is_active !== false)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900">
        {heroImg && (
          <div
            className="animate-kenburns absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url('${heroImg}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/85 to-brand-900/50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400 ring-1 ring-gold-400/30">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> Welcome to {name}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Authentic flavors,
              <br />
              <span className="text-gold-400">made for every moment.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-brand-50/80">
              Fresh food. Traditional taste. A modern ordering experience — delivery, dine-in and takeaway.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu">
                <Button size="lg" variant="hero" icon="cart">Order Now</Button>
              </Link>
              <Link to="/menu">
                <Button size="lg" variant="secondary" className="border-white/40 text-white hover:bg-gold-400 hover:text-brand-900 hover:border-gold-400">
                  Explore Menu
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-400 text-brand-900">
                    <Icon name={f.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-2 text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-brand-50/70">{f.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* floating dish collage */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {(loading ? [] : featured.slice(0, 4)).map((f, i) => (
                <div
                  key={f.id}
                  className={classNames(
                    'overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl',
                    i % 2 === 0 ? 'mt-8' : '',
                  )}
                  style={{ animation: `float 7s ease-in-out ${i * 0.4}s infinite` }}
                >
                  <img src={f.image} alt={f.name} className="h-40 w-full object-cover" />
                  <div className="flex items-center justify-between p-3">
                    <span className="truncate text-sm font-semibold text-ink">{f.name}</span>
                    <span className="text-sm font-bold text-gold-600">{formatCurrency(Number(f.price) || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <SectionHead eyebrow="Browse" title="Explore by category" to="/menu" />
        <div className="scrollbar-warm -mx-6 mt-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/menu?category=${c.id}`}
              className="group flex w-40 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-28 overflow-hidden bg-cream-soft">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="grid h-full place-items-center text-brand-300"><Icon name="utensils" className="h-8 w-8" /></div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate font-display font-semibold text-ink">{c.name}</p>
                <p className="text-xs text-muted">{c.foods?.length || 0} dishes</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      {activePromo && (
        <section className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-8 py-10 text-white sm:px-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/20 blur-2xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Special offer</p>
                <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                  {discountLabel(activePromo)} — {activePromo.name}
                </h3>
                {activePromo.description && <p className="mt-1 text-brand-50/80">{activePromo.description}</p>}
                {activePromo.end_date && (
                  <p className="mt-2 text-sm text-brand-50/70">Ends {new Date(activePromo.end_date).toLocaleDateString()}</p>
                )}
              </div>
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-center ring-1 ring-white/15">
                <p className="text-xs uppercase tracking-wide text-brand-50/70">Use code</p>
                <p className="font-display text-2xl font-bold tracking-wider text-gold-400">{activePromo.code}</p>
                <Link to="/menu" className="mt-2 inline-block">
                  <Button variant="accent" size="sm">Order now</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured dishes */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <SectionHead eyebrow="Chef’s picks" title="Most loved dishes" to="/menu" />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((f) => <FoodCard key={f.id} food={f} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream-soft py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead center eyebrow="How it works" title="From craving to table in four steps" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="relative rounded-2xl border border-line bg-white p-6 shadow-sm">
                <span className="absolute right-5 top-4 font-display text-4xl font-bold text-brand-50">{i + 1}</span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-gold-400">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHead center eyebrow="Loved by locals" title="What our guests say" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <figure key={r.id} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <Stars value={r.rating} />
              <blockquote className="mt-3 text-sm text-ink">“{r.text}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-xs font-bold text-white">{r.avatar}</span>
                <span className="text-sm font-semibold text-ink">{r.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-brand-800 px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Hungry already?</h3>
            <p className="mt-1 text-brand-50/80">Your table — or your doorstep — is a few taps away.</p>
          </div>
          <Link to="/menu">
            <Button size="lg" variant="accent" icon="utensils">Start an order</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function SectionHead({ eyebrow, title, to, center }) {
  return (
    <div className={classNames('flex items-end justify-between gap-4', center && 'flex-col items-center text-center')}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">{eyebrow}</p>
        <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      </div>
      {to && !center && (
        <Link to={to} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex">
          View all <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

function discountLabel(p) {
  if (p.discount_type === 'percentage') return `${Math.round(Number(p.discount_value))}% OFF`
  return `${formatCurrency(Number(p.discount_value) || 0)} OFF`
}
