import { Link } from 'react-router-dom'
import { Icon } from '../ui/Icon'

/*
  AuthShell — two-column auth layout shared by Login and Register. The left rail
  is a Ken-Burns food hero in the brand greens; the right holds the form.
*/
export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-800 lg:block">
        <div
          className="animate-kenburns absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-900/70 to-brand-800/40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-400 font-display text-xl font-bold text-brand-900">
              K
            </span>
            <span className="font-display text-xl font-bold">Khmer Kitchen</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight">
              Authentic flavors,
              <br /> made for every moment.
            </h2>
            <p className="mt-3 max-w-sm text-brand-100/80">
              Order dine-in, takeaway or delivery in a few taps — and follow it live from kitchen to table.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-canvas px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-brand-700"
            >
              <Icon name="arrowLeft" className="h-4 w-4" /> Back to restaurant
            </Link>
            <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
