import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MenuProvider } from '../../context/MenuContext'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { CartDrawer } from './CartDrawer'
import { FoodDetailModal } from './FoodDetailModal'

/*
  PublicLayout — chrome for the customer website: menu provider, sticky header,
  page outlet, footer, plus the global cart drawer and food-detail modal. Scrolls
  to top on navigation.
*/
export function PublicLayout() {
  const [cartOpen, setCartOpen] = useState(false)
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, search])

  return (
    <MenuProvider>
      <div className="flex min-h-screen flex-col bg-canvas">
        <SiteHeader onOpenCart={() => setCartOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <FoodDetailModal />
    </MenuProvider>
  )
}
