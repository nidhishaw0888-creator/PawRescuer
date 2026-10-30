import { Card } from '../common/Card'

export function AccountSummary({ fields }) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Profile details</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className={field.wide ? 'sm:col-span-2' : undefined}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{field.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-ink-900">{field.value || 'Not provided'}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
