import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { ApiError } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AuthShell } from '../../components/auth/AuthShell'

export default function RegisterPage() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created', 'Welcome to the kitchen!')
      navigate('/')
    } catch (err) {
      const fieldErrors = err instanceof ApiError ? err.data?.errors : null
      setErrors(fieldErrors || {})
      toast.error('Could not register', (fieldErrors ? 'Please fix the errors below.' : err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Save addresses, reorder favourites and track every meal.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Full name" name="name" icon="user" placeholder="Sokha Dara" autoComplete="name" value={form.name} onChange={set('name')} error={first(errors.name)} />
        <Input label="Email" name="email" type="email" icon="mail" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={set('email')} error={first(errors.email)} />
        <Input label="Phone" name="phone" type="tel" icon="phone" placeholder="+855 12 345 678" autoComplete="tel" value={form.phone} onChange={set('phone')} error={first(errors.phone)} />
        <Input label="Password" name="password" type="password" icon="lock" placeholder="At least 8 characters" autoComplete="new-password" value={form.password} onChange={set('password')} error={first(errors.password)} />
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

const first = (v) => (Array.isArray(v) ? v[0] : v)
