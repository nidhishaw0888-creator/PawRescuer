import { Link } from 'react-router-dom'
import { Home, PawPrint } from 'lucide-react'
import { Button } from '../../components/common/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-forest-50 text-forest-700">
        <PawPrint className="size-8" />
      </span>
      <p className="mt-6 text-5xl font-extrabold text-forest-700">404</p>
      <h1 className="mt-2 text-2xl font-bold">This page wandered off</h1>
      <p className="mt-2 text-sm text-ink-500">The page you’re looking for doesn’t exist or may have moved. Let’s get you back to safety.</p>
      <div className="mt-6 flex gap-3">
        <Button as={Link} to="/"><Home className="size-4" /> Back home</Button>
        <Button as={Link} to="/map" variant="secondary">View rescue map</Button>
      </div>
    </div>
  )
}
