"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

export type CartItem = {
  key: string // productId:variantId
  productId: number
  variantId: number | null
  name: string
  brand?: string
  size?: string
  color?: string
  price: number
  image?: string | null
  qty: number
  /** Available stock at the time the item was added. Undefined = no cap (backorder). */
  maxQty?: number
}

function clampQty(qty: number, maxQty?: number) {
  if (typeof maxQty === "number" && maxQty > 0) return Math.min(qty, maxQty)
  return qty
}

type CartCtx = {
  items: CartItem[]
  count: number
  total: number
  add: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)

const STORAGE_KEY = "manada_cart_v1"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load once on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
    setLoaded(true)
  }, [])

  // Persist on change
  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, loaded])

  const add = useCallback((item: Omit<CartItem, "key" | "qty">, qty = 1) => {
    const key = `${item.productId}:${item.variantId ?? 0}`
    setItems((prev) => {
      const found = prev.find((i) => i.key === key)
      if (found) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: clampQty(i.qty + qty, i.maxQty ?? item.maxQty), maxQty: item.maxQty ?? i.maxQty } : i
        )
      }
      return [...prev, { ...item, key, qty: clampQty(qty, item.maxQty) }]
    })
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty: clampQty(qty, i.maxQty) } : i))
    )
  }, [])

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((a, i) => a + i.qty, 0)
    const total = items.reduce((a, i) => a + i.price * i.qty, 0)
    return { items, count, total, add, setQty, remove, clear }
  }, [items, add, setQty, remove, clear])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}
