import { useEffect, type RefObject } from 'react'
import { isCoarse } from './motion'

/** Subtle pull toward the cursor on fine pointers. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.28) {
  useEffect(() => {
    const el = ref.current
    if (!el || isCoarse()) return
    let raf = 0
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => (el.style.translate = `${x}px ${y}px`))
    }
    const leave = () => {
      cancelAnimationFrame(raf)
      el.style.transition = 'translate .5s cubic-bezier(.34,1.56,.64,1)'
      el.style.translate = '0 0'
      setTimeout(() => (el.style.transition = ''), 500)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref, strength])
}
