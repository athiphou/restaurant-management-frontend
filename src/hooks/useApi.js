import { useEffect, useState } from 'react'

export function useApi(serviceFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    serviceFn()
      .then((res) => active && setData(res?.data ?? res))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error }
}
