import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { classNames } from '../../utils/formatters'

/*
  Sidebar — the admin navigation tree (spec §18). Grouped, collapsible, with an
  active state driven by NavLink's isActive. Collapses into an off-canvas drawer
  on small screens (controlled by MainLayout).
*/
const NAV = [
  {
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: 'home' },
      { to: '/orders', label: 'Orders', icon: 'orders' },
      { to: '/customers', label: 'Customers', icon: 'users' },
    ],
  },
  {
    label: 'Menu',
    icon: 'utensils',
    items: [
      { to: '/admin/menu/categories', label: 'Food Categories', icon: 'tag' },
      { to: '/admin/menu', label: 'Foods', icon: 'menu_list' },
      { to: '/admin/menu/variants', label: 'Food Variants', icon: 'layers' },
      { to: '/admin/menu/addons', label: 'Food Add-ons', icon: 'plus' },
      { to: '/admin/menu/addon-items', label: 'Add-on Items', icon: 'box' },
    ],
  },
  {
    label: 'Restaurant',
    icon: 'store',
    items: [
      { to: '/restaurants', label: 'Restaurants', icon: 'building' },
      { to: '/branches', label: 'Branches', icon: 'mapPin' },
      { to: '/tables', label: 'Tables', icon: 'table' },
    ],
  },
  {
    label: 'Delivery',
    icon: 'truck',
    items: [
      { to: '/deliveries', label: 'Deliveries', icon: 'deliveries' },
      { to: '/drivers', label: 'Delivery Drivers', icon: 'bike' },
    ],
  },
  {
    label: 'Staff',
    icon: 'userCircle',
    items: [
      { to: '/staff/positions', label: 'Staff Positions', icon: 'clipboard' },
      { to: '/staff', label: 'Employees', icon: 'users' },
    ],
  },
  {
    label: 'Inventory',
    icon: 'inventory',
    items: [
      { to: '/suppliers', label: 'Suppliers', icon: 'store' },
      { to: '/ingredients', label: 'Ingredients', icon: 'box' },
      { to: '/inventory', label: 'Inventory', icon: 'grid' },
      { to: '/inventory/transactions', label: 'Transactions', icon: 'activity' },
      { to: '/recipes', label: 'Recipes', icon: 'chefHat' },
    ],
  },
  {
    items: [
      { to: '/payments', label: 'Payments', icon: 'wallet' },
      { to: '/promotions', label: 'Promotions', icon: 'percent' },
    ],
  },
  {
    label: 'Access',
    icon: 'lock',
    items: [
      { to: '/roles', label: 'Roles', icon: 'shield' },
      { to: '/user-roles', label: 'User Roles', icon: 'users' },
    ],
  },
]

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        classNames(
          'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-gold-400 text-brand-900 shadow-sm'
            : 'text-brand-100/80 hover:bg-white/10 hover:text-white',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            name={item.icon}
            className={classNames('h-[18px] w-[18px] shrink-0', isActive ? 'text-brand-800' : 'text-brand-200')}
          />
          <span className="truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

function NavGroup({ group, onNavigate }) {
  const [open, setOpen] = useState(true)
  if (!group.label) {
    return (
      <div className="space-y-1">
        {group.items.map((it) => (
          <NavItem key={it.to} item={it} onNavigate={onNavigate} />
        ))}
      </div>
    )
  }
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand-200/70 transition hover:text-white"
      >
        <span className="flex items-center gap-2">
          <Icon name={group.icon} className="h-4 w-4" />
          {group.label}
        </span>
        <Icon name="chevronDown" className={classNames('h-4 w-4 transition-transform', !open && '-rotate-90')} />
      </button>
      {open && (
        <div className="mt-1 space-y-1 border-l border-white/10 pl-2">
          {group.items.map((it) => (
            <NavItem key={it.to} item={it} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ open = false, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-brand-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={classNames(
          'fixed z-50 flex h-screen w-[264px] flex-col bg-brand-800 text-white transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Link to="/dashboard" className="flex items-center gap-3 px-5 py-5" onClick={onClose}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 font-display text-lg font-bold text-brand-900">
            R
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold">Restaurant OS</span>
            <span className="block text-[11px] uppercase tracking-widest text-brand-200/70">
              Management
            </span>
          </span>
        </Link>
        <nav className="scrollbar-warm flex-1 space-y-4 overflow-y-auto px-3 pb-6">
          {NAV.map((group, i) => (
            <NavGroup key={group.label || i} group={group} onNavigate={onClose} />
          ))}
        </nav>
      </aside>
    </>
  )
}
