import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMenu } from '../../context/MenuContext'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { classNames } from '../../utils/formatters'
import { Icon } from '../ui/Icon'

/*
  SiteHeader — premium sticky navbar (spec §4). White, green text, gold accents.
  On scroll it shrinks and gains a shadow. Includes Food Categories + Location
  dropdowns (both from the API), search, cart with a bouncing badge, and the
  account menu. Collapses to a mobile drawer under lg.
*/
export function SiteHeader({ onOpenCart }) {
  const { categories } = useMenu()
  const { count, branches, selectedBranch, setBranch, restaurant } = useCart()
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(null) // 'category' | 'location' | 'account' | 'mobile'
  const [q, setQ] = useState('')
  const [bump, setBump] = useState(false)
  const wrapRef = useRef(null)
  const prevCount = useRef(count)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 500)
      prevCount.current = count
      return () => clearTimeout(t)
    }
    prevCount.current = count
  }, [count])

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenu(null)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const toggle = (id) => setMenu((cur) => (cur === id ? null : id))

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/menu?q=${encodeURIComponent(q.trim())}` : '/menu')
    setMenu(null)
  }

  const goCategory = (id) => {
    navigate(`/menu?category=${id}`)
    setMenu(null)
  }

  const name = restaurant?.name || 'Restaurant'

  return (
    <header
      ref={wrapRef}
      className={classNames(
        'sticky top-0 z-50 w-full border-b bg-white transition-all duration-300',
        scrolled ? 'border-line shadow-sm' : 'border-transparent',
      )}
    >
      <div
        className={classNames(
          'mx-auto flex max-w-7xl items-center gap-3 px-4 transition-all duration-300 sm:px-6',
          scrolled ? 'h-16' : 'h-20',
        )}
      >
        {/* Logo + name */}
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className={classNames(
              'grid place-items-center rounded-xl bg-brand-700 font-display font-bold text-gold-400 shadow-sm transition-all',
              scrolled ? 'h-9 w-9 text-base' : 'h-11 w-11 text-lg',
            )}
          >
            {name.slice(0, 1)}
          </span>
          <span className="leading-tight">
            <span
              className={classNames(
                'block font-display font-bold text-brand-800 transition-all',
                scrolled ? 'text-lg' : 'text-xl',
              )}
            >
              {name}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">
              Khmer Kitchen
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <Link to="/" className="rounded-full px-3 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50">
            Home
          </Link>
          <Link to="/menu" className="rounded-full px-3 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50">
            Menu
          </Link>

          {/* Food categories dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('category')}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              Food Categories
              <Icon name="chevronDown" className={classNames('h-4 w-4 transition-transform', menu === 'category' && 'rotate-180')} />
            </button>
            {menu === 'category' && (
              <div className="animate-fade-up absolute left-0 top-full mt-2 w-72 origin-top rounded-2xl border border-line bg-white p-2 shadow-xl">
                {categories.length === 0 && <p className="p-3 text-sm text-muted">Loading categories…</p>}
                <DropdownLink onClick={() => goCategory('all')}>All dishes</DropdownLink>
                {categories.map((c) => (
                  <DropdownLink key={c.id} onClick={() => goCategory(c.id)}>
                    <FoodDot /> {c.name}
                    <span className="ml-auto text-xs text-muted">{c.foods?.length || 0}</span>
                  </DropdownLink>
                ))}
              </div>
            )}
          </div>

          {/* Location dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('location')}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              <Icon name="mapPin" className="h-4 w-4" />
              {selectedBranch?.name || 'Branch'}
              <Icon name="chevronDown" className={classNames('h-4 w-4 transition-transform', menu === 'location' && 'rotate-180')} />
            </button>
            {menu === 'location' && (
              <div className="animate-fade-up absolute left-0 top-full mt-2 w-64 origin-top rounded-2xl border border-line bg-white p-2 shadow-xl">
                {branches.length === 0 && <p className="p-3 text-sm text-muted">Loading branches…</p>}
                {branches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => { setBranch(b.id); setMenu(null) }}
                    className={classNames(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-cream-soft',
                      selectedBranch?.id === b.id ? 'font-semibold text-brand-800' : 'text-ink',
                    )}
                  >
                    <Icon name="store" className="h-4 w-4 text-brand-600" />
                    <span className="min-w-0">
                      <span className="block truncate">{b.name}</span>
                      {b.address && <span className="block truncate text-xs text-muted">{b.address}</span>}
                    </span>
                    {selectedBranch?.id === b.id && <Icon name="check" className="ml-auto h-4 w-4 text-gold-600" />}
                  </button>
                ))}
                <Link to="/locations" onClick={() => setMenu(null)} className="mt-1 block rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                  View all locations
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Search */}
          <form onSubmit={submitSearch} className="relative hidden md:block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" className="h-4 w-4" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dishes…"
              className="h-10 w-44 rounded-full border border-line bg-cream pl-9 pr-3 text-sm outline-none transition focus:w-56 focus:border-brand-500 focus:bg-white"
            />
          </form>

          {/* Account */}
          <div className="relative hidden sm:block">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => toggle('account')}
                className="grid h-10 w-10 place-items-center rounded-full bg-brand-700 text-sm font-semibold text-white transition hover:bg-brand-800"
                aria-label="Account"
              >
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 rounded-full border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-gold-400 hover:border-gold-400 hover:text-brand-800">
                <Icon name="user" className="h-4 w-4" /> Login
              </Link>
            )}
            {menu === 'account' && (
              <div className="animate-fade-up absolute right-0 top-full mt-2 w-48 rounded-2xl border border-line bg-white p-2 shadow-xl">
                <DropdownLink onClick={() => { navigate('/account'); setMenu(null) }}>
                  <Icon name="userCircle" className="h-4 w-4" /> My account
                </DropdownLink>
                {isAdmin && (
                  <DropdownLink onClick={() => { navigate('/dashboard'); setMenu(null) }}>
                    <Icon name="grid" className="h-4 w-4" /> Admin console
                  </DropdownLink>
                )}
                <DropdownLink onClick={() => { navigate('/tracking'); setMenu(null) }}>
                  <Icon name="deliveries" className="h-4 w-4" /> Track order
                </DropdownLink>
                <button
                  onClick={() => { logout(); setMenu(null) }}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-line px-3 py-2 pt-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  <Icon name="logout" className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-700 text-white shadow-sm transition hover:bg-brand-800"
            aria-label="Open cart"
          >
            <Icon name="cart" className={classNames('h-5 w-5', bump && 'animate-cart-bounce')} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[11px] font-bold text-brand-900 ring-2 ring-white">
                {count}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => toggle('mobile')}
            className="grid h-10 w-10 place-items-center rounded-full text-brand-800 transition hover:bg-brand-50 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Icon name={menu === 'mobile' ? 'x' : 'menu'} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {menu === 'mobile' && (
        <div className="animate-slide-up border-t border-line bg-white px-4 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="relative mb-3">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" className="h-4 w-4" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dishes…"
              className="h-11 w-full rounded-full border border-line bg-cream pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:bg-white"
            />
          </form>
          <div className="grid grid-cols-2 gap-2">
            <MobileLink to="/" onClick={() => setMenu(null)} icon="home">Home</MobileLink>
            <MobileLink to="/menu" onClick={() => setMenu(null)} icon="utensils">Menu</MobileLink>
            <MobileLink to="/locations" onClick={() => setMenu(null)} icon="mapPin">Locations</MobileLink>
            <MobileLink to="/tracking" onClick={() => setMenu(null)} icon="deliveries">Track order</MobileLink>
            {isAuthenticated ? (
              <MobileLink to="/account" onClick={() => setMenu(null)} icon="userCircle">Account</MobileLink>
            ) : (
              <MobileLink to="/login" onClick={() => setMenu(null)} icon="user">Login</MobileLink>
            )}
          </div>
          <div className="mt-3 rounded-2xl border border-line p-2">
            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted">Categories</p>
            <div className="max-h-52 overflow-y-auto scrollbar-warm">
              <MobileLink to="/menu" onClick={() => setMenu(null)} icon="grid">All dishes</MobileLink>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => goCategory(c.id)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-brand-800 hover:bg-brand-50"
                >
                  <FoodDot /> {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function FoodDot() {
  return <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-gold-400" />
}

function DropdownLink({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink transition hover:bg-cream-soft hover:text-brand-800"
    >
      {children}
    </button>
  )
}

function MobileLink({ to, icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-800 transition hover:bg-brand-50"
    >
      <Icon name={icon} className="h-4 w-4" />
      {children}
    </Link>
  )
}
