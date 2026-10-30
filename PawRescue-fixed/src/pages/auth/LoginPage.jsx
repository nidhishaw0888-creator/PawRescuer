import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/FormControls'
import { useAuth, useToast } from '../../hooks/useContextHooks'
import { validateLogin } from '../../utils/validation'
import { ROLE_HOME } from '../../utils/constants'

export function LoginPage() {
  const { signIn } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from || ROLE_HOME.citizen

  const handleSubmit = async (event) => {
  event.preventDefault()

  const nextErrors = validateLogin(values)
  setErrors(nextErrors)

  // Stop only if actual validation errors exist
  if (Object.values(nextErrors).some((error) => Boolean(error))) return

  setSubmitting(true)

  try {
    const account = await signIn({
      email: values.email.trim(),
      password: values.password,
    })

    const role = String(
      account?.role || account?.accountType || ''
    ).trim().toLowerCase()

    const dashboardPath = ROLE_HOME[role]

    if (!dashboardPath) {
      throw new Error(
        'Your account role could not be identified. Please contact PawRescue support.'
      )
    }

    const firstName = String(account?.name || 'there')
      .trim()
      .split(' ')[0] || 'there'

    showToast(`Welcome back, ${firstName}`, 'success')

    navigate(dashboardPath, { replace: true })

  } catch (error) {
    setErrors({ form: error.message })
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-500">Sign in to your PawRescue account.</p>
      </div>

      {errors.form && <div className="rounded-xl border border-coral-100 bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-700">{errors.form}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input label="Email" name="email" type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} error={errors.email} placeholder="name@example.com" autoComplete="email" required />
        <div className="relative">
          <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} error={errors.password} placeholder="At least 8 characters" autoComplete="current-password" required />
          <button type="button" onClick={() => setShowPassword((open) => !open)} className="absolute right-3 top-9 text-ink-500 hover:text-ink-900" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 font-semibold text-ink-700">
            <input type="checkbox" checked={values.remember} onChange={(e) => setValues({ ...values, remember: e.target.checked })} className="size-4 rounded border-stone-300 accent-forest-600" />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-semibold text-teal-600 hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" isLoading={submitting}><LogIn className="size-4" /> Sign in</Button>
      </form>

      <p className="text-center text-sm text-ink-500">
        New to PawRescue? <Link to="/register" className="font-semibold text-teal-600 hover:underline">Create an account</Link>
      </p>
    </div>
  )
}
