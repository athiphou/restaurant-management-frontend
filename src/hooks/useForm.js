import { useCallback, useState } from 'react'

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setValues((prev) => ({ ...prev, [name]: value }))
    },
    [],
  )

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const reset = useCallback(() => setValues(initialValues), [initialValues])

  return { values, errors, setErrors, setValue, handleChange, reset }
}
