import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as restaurantApi from '../api/restaurant'

/*
  CartContext — the customer "shop session": cart line items (with selected
  variant + add-ons + notes), the chosen branch / restaurant, and derived
  totals. Cart and branch selection persist to localStorage.

  Line model:
    { key, foodId, name, image, basePrice, variant, addons[], qty, notes, unitPrice }
*/
const CartContext = createContext(null)
const CART_KEY = 'rms.cart'
const BRANCH_KEY = 'rms.branch'

const toNumber = (v) => {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return Number.isFinite(n) ? n : 0
}

function lineUnitPrice({ basePrice = 0, variant, addons = [] }) {
  const delta = variant ? toNumber(variant.priceDelta ?? variant.price ?? 0) : 0
  const extras = addons.reduce((sum, a) => sum + toNumber(a.price ?? 0), 0)
  return round2(toNumber(basePrice) + delta + extras)
}

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

function lineKey({ foodId, variant, addons = [], notes }) {
  const v = variant?.id ?? variant?.name ?? ''
  const a = addons.map((x) => x.id ?? x.name).sort().join('+')
  return `${foodId}|${v}|${a}|${(notes || '').trim()}`
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  const [branchId, setBranchIdState] = useState(() => {
    const raw = localStorage.getItem(BRANCH_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [branches, setBranches] = useState([])
  const [restaurants, setRestaurants] = useState([])

  // Load restaurant + branch data once (shared by navbar location menu, checkout, locations page).
  useEffect(() => {
    let active = true
    restaurantApi
      .listRestaurants()
      .then((res) => active && setRestaurants(res?.data ?? []))
      .catch(() => {})
    restaurantApi
      .listRestaurantBranches()
      .then((res) => {
        if (!active) return
        const list = res?.data ?? []
        setBranches(list)
        setBranchIdState((current) => {
          if (current && list.some((b) => b.id === current)) return current
          return list[0]?.id ?? null
        })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (branchId != null) localStorage.setItem(BRANCH_KEY, JSON.stringify(branchId))
  }, [branchId])

  const addItem = useCallback((input, { variant = null, addons = [], qty = 1, notes = '' } = {}) => {
    const basePrice = toNumber(input.price ?? input.basePrice)
    const draft = {
      foodId: input.id ?? input.foodId,
      name: input.name,
      image: input.image || '',
      basePrice,
      variant,
      addons,
      notes,
      qty: Math.max(1, toNumber(qty) || 1),
    }
    draft.unitPrice = lineUnitPrice(draft)
    draft.key = lineKey(draft)

    setItems((list) => {
      const idx = list.findIndex((l) => l.key === draft.key)
      if (idx >= 0) {
        const merged = [...list]
        merged[idx] = { ...merged[idx], qty: merged[idx].qty + draft.qty }
        return merged
      }
      return [...list, draft]
    })
    return draft
  }, [])

  const removeItem = useCallback((key) => {
    setItems((list) => list.filter((l) => l.key !== key))
  }, [])

  const updateQty = useCallback((key, nextQty) => {
    setItems((list) =>
      list
        .map((l) => (l.key === key ? { ...l, qty: Math.max(0, toNumber(nextQty)) } : l))
        .filter((l) => l.qty > 0),
    )
  }, [])

  const setNotes = useCallback((key, notes) => {
    setItems((list) => list.map((l) => (l.key === key ? { ...l, notes } : l)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const setBranch = useCallback((id) => setBranchIdState(id), [])

  const { subtotal, count } = useMemo(() => {
    let sub = 0
    let cnt = 0
    for (const l of items) {
      sub += lineUnitPrice(l) * l.qty
      cnt += l.qty
    }
    return { subtotal: round2(sub), count: cnt }
  }, [items])

  const selectedBranch = useMemo(
    () => branches.find((b) => b.id === branchId) || null,
    [branches, branchId],
  )

  const restaurant = useMemo(() => restaurants[0] || null, [restaurants])

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQty,
      setNotes,
      clear,
      subtotal,
      count,
      branches,
      branchId,
      setBranch,
      selectedBranch,
      restaurants,
      restaurant,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQty,
      setNotes,
      clear,
      subtotal,
      count,
      branches,
      branchId,
      setBranch,
      selectedBranch,
      restaurants,
      restaurant,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export { lineUnitPrice }
