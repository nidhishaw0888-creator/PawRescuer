import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'

const PRIVACY = [
  'PawRescue stores reports so responders can act on them. Personal contact details are shared only with verified responders assigned to a case.',
  'Do not include another person\u2019s personal information in a public report description.',
  'Backend access is governed by role-based permissions so citizens, volunteers, organizations, and admins each see only what their role requires.',
]

const TERMS = [
  'PawRescue is not a substitute for local emergency or animal control services.',
  'Filing a report does not guarantee a response. Volunteers and organizations act at their own discretion.',
  'Misuse, including false reports or abusive content, may result in account suspension.',
]

export function LegalPage({ kind }) {
  const isPrivacy = kind === 'privacy'
  const items = isPrivacy ? PRIVACY : TERMS
  const location = useLocation()
  const navigate = useNavigate()
  const fromRegister = location.state?.from === 'register'

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {fromRegister && (
        <Button variant="ghost" size="sm" onClick={() => navigate('/register')} className="mb-4">
          <ArrowLeft className="size-4" /> Back to Sign Up
        </Button>
      )}
      <PageHeader eyebrow={isPrivacy ? 'Privacy' : 'Terms'} title={isPrivacy ? 'Privacy notice' : 'Terms of use'} />
      <Card className="mt-8 flex flex-col gap-3">
        {items.map((item, index) => (
          <p key={index} className="text-sm text-ink-700">{item}</p>
        ))}
      </Card>
      {fromRegister && (
        <p className="mt-6 text-sm text-ink-500">
          <Link to="/register" className="font-semibold text-teal-600 hover:underline">Back to Sign Up</Link>
        </p>
      )}
    </div>
  )
}
