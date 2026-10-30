import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { clsx } from './clsx'

// Renders an animal or shelter photo and falls back to a neutral placeholder if it fails to load.
export function ImageWithFallback({ src, alt, className, fallbackClassName }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={clsx('flex flex-col items-center justify-center bg-stone-100 text-stone-400', className, fallbackClassName)} role="img" aria-label={alt || 'Image unavailable'}>
        <ImageOff className="size-6" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={clsx('object-cover', className)}
    />
  )
}
