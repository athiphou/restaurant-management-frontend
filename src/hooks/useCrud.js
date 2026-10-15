import { useCallback, useEffect, useState } from 'react'

/*
  useCrud — generic list + create/update/delete for a REST resource.
  Pass the four menuApi-style service functions; it manages rows/loading/error,
  exposes reload(), and save(values, id?) / del(id?) which refetch after a
  successful mutation. `mapRow` optionally normalises each row for the form.
*/
export function useCrud({ list, create, update, remove, mapRow }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    return list()
      .then((res) => setRows(res?.data || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [list])

  useEffect(() => {
    reload()
  }, [reload])

  const save = useCallback(
    async (values, id) => {
      setSaving(true)
      try {
        if (id != null) await update(id, values)
        else await create(values)
        await reload()
        return true
      } finally {
        setSaving(false)
      }
    },
    [create, update, reload],
  )

  const del = useCallback(
    async (id) => {
      await remove(id)
      await reload()
    },
    [remove, reload],
  )

  const toForm = useCallback(
    (row) => (mapRow && row ? mapRow(row) : row || {}),
    [mapRow],
  )

  return { rows, loading, error, saving, reload, save, del, toForm }
}
