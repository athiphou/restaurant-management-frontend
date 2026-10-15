import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as menuApi from '../api/menu'

/*
  MenuContext — loads the full menu tree (categories → foods → variants + add-ons)
  once for the customer site and shares it across Home, Menu, the header search and
  the food-detail modal, so the whole ordering flow reads from a single API call.
*/
const MenuContext = createContext(null)

export function MenuProvider({ children }) {
  const [tree, setTree] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detail, setDetail] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    return menuApi
      .getMenuTree()
      .then((res) => setTree(res?.data ?? []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const categories = useMemo(
    () =>
      [...tree]
        .filter((c) => c.is_active !== false)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [tree],
  )

  const foods = useMemo(() => categories.flatMap((c) => c.foods || []), [categories])

  const openFood = useCallback((food) => setDetail(food), [])
  const closeFood = useCallback(() => setDetail(null), [])

  const value = useMemo(
    () => ({
      tree,
      categories,
      foods,
      loading,
      error,
      refresh: load,
      detail,
      openFood,
      closeFood,
    }),
    [tree, categories, foods, loading, error, load, detail, openFood, closeFood],
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within MenuProvider')
  return ctx
}
