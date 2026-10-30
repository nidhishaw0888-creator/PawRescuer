import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Card } from '../../components/common/Card'
import { Input, Textarea } from '../../components/common/FormControls'
import { Button } from '../../components/common/Button'
import { useToast } from '../../hooks/useContextHooks'

export function ContactPage() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Enter your name.'
    if (!form.email.trim()) nextErrors.email = 'Enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) nextErrors.message = 'Add a message of at least 10 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSending(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setSending(false)
    setForm({ name: '', email: '', message: '' })
    showToast('Your message has been sent. We will get back to you soon.', 'success')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="Contact" title="Get in touch" subtitle="Use this form for questions, feedback, or partnership interest." />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Contact details</h2>
          <ul className="space-y-3 text-sm text-ink-700">
            <li className="flex items-center gap-2"><Mail className="size-4 text-teal-600" /> hello@pawrescue.example</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-teal-600" /> (555) 010-0000</li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-teal-600" /> Bengaluru, India</li>
          </ul>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Send a message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input label="Your name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} required />
            <Textarea label="Message" name="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} error={errors.message} required />
            <Button type="submit" isLoading={sending} className="self-start"><Send className="size-4" /> Send message</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
