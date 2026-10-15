import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth, hasAdminRole } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { Icon } from '../../components/ui/Icon'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AuthShell } from '../../components/auth/AuthShell'

export default function LoginPage() {
  const { login, user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res = await login({ email: form.email, password: form.password })
      toast.success('Welcome back', 'You are signed in.')
      const from = location.state?.from
      navigate(from || (hasAdminRole(res?.user || user) ? '/dashboard' : '/account'))
    } catch (err) {
      const message = err instanceof ApiError ? err.data?.message || err.message : 'Login failed'
      const fieldErrors = err instanceof ApiError ? err.data?.errors : null
      setErrors(fieldErrors || {})
      toast.error('Could not sign in', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to order faster, save addresses and track your meals."
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          icon="mail"
          placeholder="you@example.com"
          value={form.email}
          onChange={set('email')}
          error={first(errors.email)}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="lock" className="h-4 w-4" />
            </span>
            <input
              type={showPw ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-11 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
              aria-label="Toggle password visibility"
            >
              <Icon name={showPw ? 'eyeOff' : 'eye'} className="h-4 w-4" />
            </button>
          </div>
          {first(errors.password) && <p className="mt-1 text-xs text-rose-600">{first(errors.password)}</p>}
        </div>
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}

const first = (v) => (Array.isArray(v) ? v[0] : v)

