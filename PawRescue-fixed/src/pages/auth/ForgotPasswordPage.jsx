import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck, MailQuestion } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/FormControls'
import { Card } from '../../components/common/Card'
import { useToast } from '../../hooks/useContextHooks'
import { validateEmail } from '../../utils/validation'
import * as authService from '../../services/authService'

export function ForgotPasswordPage() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const message = validateEmail(email)
    setError(message)
    if (message) return
    setSending(true)
    try {
      await authService.requestPasswordReset(email)
      setSent(true)
      showToast('If an account exists for that email, a reset link has been sent.', 'success')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <Card className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-forest-50 text-forest-700"><MailCheck className="size-7" /></span>
        <h1 className="text-xl font-bold">Check your inbox</h1>
        <p className="text-sm text-ink-500">If an account exists for {email}, a reset link has been sent to that email address.</p>
        <Button as={Link} to="/login">Back to sign in</Button>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Reset your password</h1>
        <p className="mt-1 text-sm text-ink-500">Enter your email and we’ll send you a link to reset your password.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} placeholder="name@example.com" required />
        <Button type="submit" isLoading={sending}><MailQuestion className="size-4" /> Send reset link</Button>
      </form>
      <p className="text-center text-sm text-ink-500">Remembered it? <Link to="/login" className="font-semibold text-teal-600 hover:underline">Back to sign in</Link></p>
    </div>
  )
}
