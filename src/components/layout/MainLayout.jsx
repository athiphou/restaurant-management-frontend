import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

/*
  MainLayout — admin console shell: fixed brand-green sidebar + sticky top bar +
  scrollable content area. Collapses the sidebar to an off-canvas drawer on small
  screens (spec §36 responsive dashboard).
*/
export function MainLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-[264px]">
        <Navbar onMenuClick={() => setOpen(true)} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
