import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../ui/Icon'

function titleForPath(path) {
  if (path === '/dashboard') return 'Dashboard'
  const seg = path.split('/').filter(Boolean)[0] || 'Console'
  return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
}

/*
  Navbar — admin top bar: sidebar toggle (mobile), current module, search,
  notifications and the account menu.
*/
export function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const name = user?.name || user?.username || 'Console'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="grid h-10 w-10 place-items-center rounded-xl text-brand-800 transition hover:bg-brand-50 lg:hidden"
        aria-label="Open navigation"
      >
        <Icon name="menu" className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate font-display text-lg font-semibold text-ink">
          {titleForPath(pathname)}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <label className="relative hidden md:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon name="search" className="h-4 w-4" />
          </span>
          <input
            placeholder="Search…"
            className="h-10 w-56 rounded-full border border-line bg-cream pl-9 pr-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
          />
        </label>
        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-full text-brand-800 transition hover:bg-brand-50"
          aria-label="Notifications"
        >
          <Icon name="bell" className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-400 ring-2 ring-white" />
        </button>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-brand-50"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-sm font-semibold text-white">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden text-sm font-medium text-ink sm:block">{name}</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-rose-50 hover:text-rose-600"
          aria-label="Log out"
        >
          <Icon name="logout" className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
