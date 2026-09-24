import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { byId } from '../data/menu'

export interface Line {
  id: number
  qty: number
}

interface Ctx {
  lines: Line[]
  count: number
  total: number
  open: boolean
  /** Ticket number is cosmetic (receipt feel) — stable per session. */
  ticketNo: number
  pulse: number
  add: (id: number) => void
  dec: (id: number) => void
  clear: () => void
  setOpen: (v: boolean) => void
}

const OrderCtx = createContext<Ctx | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const [open, setOpen] = useState(false)
  const [pulse, setPulse] = useState(0)
  const [ticketNo] = useState(() => 100 + Math.floor(Math.random() * 900))

  const add = useCallback((id: number) => {
    setLines((ls) => {
      const hit = ls.find((l) => l.id === id)
      return hit ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { id, qty: 1 }]
    })
    setPulse((p) => p + 1)
  }, [])

  const dec = useCallback((id: number) => {
    setLines((ls) => ls.flatMap((l) => (l.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : [])))
  }, [])

  const value = useMemo<Ctx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0)
    const total = lines.reduce((s, l) => s + l.qty * byId(l.id).price, 0)
    return { lines, count, total, open, ticketNo, pulse, add, dec, clear: () => setLines([]), setOpen }
  }, [lines, open, ticketNo, pulse, add, dec])

  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>
}

export function useOrder() {
  const c = useContext(OrderCtx)
  if (!c) throw new Error('useOrder outside provider')
  return c
}
