import { useCallback, useEffect, useState } from 'react'

// Loads async data with explicit loading, error, and reload states for every page or panel that calls a service.
export function useAsyncData(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    setState((current) => ({ ...current, loading: true, error: null }))
    loader()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error })
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version])

  const reload = useCallback(() => setVersion((current) => current + 1), [])

  return { ...state, reload }
}
