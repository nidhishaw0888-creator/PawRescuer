import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/FormControls'
import { Card } from '../../components/common/Card'
import { useAuth, useToast } from '../../hooks/useContextHooks'
import * as authService from '../../services/authService'
import { validateRegistration, passwordStrength } from '../../utils/validation'
import { ACCOUNT_TYPES, ANIMAL_TYPES, ROLE_HOME } from '../../utils/constants'
import { clsx } from '../../components/common/clsx'

const STRENGTH_COLORS = ['bg-stone-200', 'bg-coral-500', 'bg-amber-500', 'bg-teal-500', 'bg-teal-600', 'bg-forest-600']

export function RegisterPage() {
  const { setSessionUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    accountType: 'citizen',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    organizationName: '',
    orgDescription: '',
    address: '',
    skills: '',
    supportedAnimals: [],
    serviceArea: '',
    availability: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  const strength = passwordStrength(values.password)

  const setField = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((current) => ({ ...current, [field]: value }))
  }

  const toggleAnimal = (animal) => {
    setValues((current) => ({
      ...current,
      supportedAnimals: current.supportedAnimals.includes(animal)
        ? current.supportedAnimals.filter((item) => item !== animal)
        : [...current.supportedAnimals, animal],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateRegistration(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSubmitting(true)
    try {
      // The register endpoint creates the account and sets the session cookie.
      // Do not issue a second login request; use the returned account in context.
      const account = await authService.register(values)
      setSessionUser(account)
      setSuccess({ name: account.name, role: account.role })
      showToast('Your account is ready. You are now signed in.', 'success')
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-forest-50 text-forest-700"><UserPlus className="size-7" /></span>
        <h1 className="text-xl font-bold">Account ready</h1>
        <p className="text-sm text-ink-500">Welcome, {success.name}. Your account has been created and you are signed in.</p>
        <div className="flex gap-2">
          <Button onClick={() => navigate(ROLE_HOME[success.role])}>Open my dashboard</Button>
          <Button as={Link} to="/" variant="secondary">Back home</Button>
        </div>
      </Card>
    )
  }

  const isVolunteer = values.accountType === 'volunteer'
  const isOrganization = values.accountType === 'organization'

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Create an account</h1>
        <p className="mt-1 text-sm text-ink-500">Choose a role to get started with PawRescue.</p>
      </div>

      {errors.form && <div className="rounded-xl border border-coral-100 bg-coral-50 px-4 py-3 text-sm font-semibold text-coral-700">{errors.form}</div>}

      <Card>
        <fieldset>
          <legend className="text-sm font-bold">Account type</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={setField('accountType')}
                value={type.value}
                className={clsx('flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors', values.accountType === type.value ? 'border-forest-500 bg-forest-50' : 'border-stone-200 hover:bg-stone-50')}
                aria-pressed={values.accountType === type.value}
              >
                <span className="font-bold text-forest-700">{type.label}</span>
                <span className="text-xs text-ink-500">{type.description}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </Card>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Card className="flex flex-col gap-4">
          {!isOrganization && <Input label="Full name" name="name" value={values.name} onChange={setField('name')} error={errors.name} required />}
          {isOrganization && <Input label="Organization name" name="organizationName" value={values.organizationName} onChange={setField('organizationName')} error={errors.organizationName} required />}
          {isOrganization && <Input label="Contact person name" name="contactName" value={values.name} onChange={setField('name')} error={errors.name} required />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email" name="email" type="email" value={values.email} onChange={setField('email')} error={errors.email} required />
            <Input label="Phone" name="phone" type="tel" value={values.phone} onChange={setField('phone')} error={errors.phone} hint="Optional for citizens" />
          </div>
          {isOrganization && (
            <>
              <Input label="Address" name="address" value={values.address} onChange={setField('address')} error={errors.address} required />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="orgDescription" className="text-sm font-semibold text-ink-900">Organization description <span className="text-coral-600">*</span></label>
                <textarea
                  id="orgDescription"
                  name="orgDescription"
                  value={values.orgDescription}
                  onChange={setField('orgDescription')}
                  rows={3}
                  className={clsx('w-full rounded-xl border bg-white px-4 py-2.5 text-sm focus:outline focus:outline-2 focus:outline-teal-500', errors.orgDescription ? 'border-coral-500' : 'border-stone-300')}
                />
                {errors.orgDescription && <p className="text-xs font-medium text-coral-700">{errors.orgDescription}</p>}
              </div>
            </>
          )}
          {(isVolunteer || isOrganization) && (
            <>
              <Input label={isVolunteer ? 'Skills (comma separated)' : 'Organization skills (comma separated)'} name="skills" value={values.skills} onChange={setField('skills')} error={errors.skills} hint="e.g. First aid, Transport, Fostering" required />
              <div>
                <p className="text-sm font-semibold text-ink-900">Supported animal types <span className="text-coral-600">*</span></p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ANIMAL_TYPES.map((animal) => (
                    <button
                      key={animal}
                      type="button"
                      onClick={() => toggleAnimal(animal)}
                      className={clsx('rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors', values.supportedAnimals.includes(animal) ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-stone-300 text-ink-700 hover:bg-stone-50')}
                      aria-pressed={values.supportedAnimals.includes(animal)}
                    >
                      {animal}
                    </button>
                  ))}
                </div>
                {errors.supportedAnimals && <p className="mt-1 text-xs font-medium text-coral-700">{errors.supportedAnimals}</p>}
              </div>
              <Input label="Service area" name="serviceArea" value={values.serviceArea} onChange={setField('serviceArea')} error={errors.serviceArea} required />
              {isVolunteer && <Input label="Availability" name="availability" value={values.availability} onChange={setField('availability')} error={errors.availability} hint="e.g. Weekends, weekday evenings" required />}
            </>
          )}
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="relative">
            <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={values.password} onChange={setField('password')} error={errors.password} required />
            <button type="button" onClick={() => setShowPassword((open) => !open)} className="absolute right-3 top-9 text-ink-500 hover:text-ink-900" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {values.password && (
            <div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} className={clsx('h-1.5 flex-1 rounded-full', index < strength.score ? STRENGTH_COLORS[strength.score] : 'bg-stone-200')} />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-ink-500">Password strength: {strength.label}</p>
            </div>
          )}
          <Input label="Confirm password" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={values.confirmPassword} onChange={setField('confirmPassword')} error={errors.confirmPassword} required />
          <label className="flex items-start gap-2 text-sm font-semibold text-ink-700">
            <input type="checkbox" checked={values.acceptTerms} onChange={setField('acceptTerms')} className="mt-0.5 size-4 rounded border-stone-300 accent-forest-600" />
            I accept the <Link to="/terms" state={{ from: 'register' }} className="text-teal-600 hover:underline">Terms of Use</Link>.
          </label>
          {errors.acceptTerms && <p className="text-xs font-medium text-coral-700">{errors.acceptTerms}</p>}
        </Card>

        <Button type="submit" size="lg" isLoading={submitting}><UserPlus className="size-4" /> Create account</Button>
        <p className="text-center text-sm text-ink-500">Already have an account? <Link to="/login" className="font-semibold text-teal-600 hover:underline">Sign in</Link></p>
      </form>

    </div>
  )
}
