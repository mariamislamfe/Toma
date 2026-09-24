import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/** Scroll position cached from the scroll event, so rAF loops never force a style/layout flush by reading it. */
export const scrollState = { y: typeof window !== 'undefined' ? window.scrollY : 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => (scrollState.y = window.scrollY), { passive: true })
}

export const isCoarse = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches

/**
 * Weaker devices (few cores or little memory) get the same design with cheaper effects:
 * lighter particle counts, no parallax on the giant words, simpler flood edges.
 */
export const isLite = (() => {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency || 8
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  return cores <= 4 || mem <= 3
})()
if (typeof document !== 'undefined' && isLite) document.documentElement.classList.add('lite')

// ─── smooth scroll ───
let lenis: Lenis | null = null
const tick = (t: number) => lenis?.raf(t * 1000)

/** Smooth scroll on fine pointers only; native (momentum) scroll on touch. */
export function initScroll() {
  // touch devices keep their native momentum scroll — faster, and what thumbs expect
  if (lenis || isCoarse()) return
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
}

export function destroyScroll() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  lenis.destroy()
  lenis = null
}

/** Freeze the page behind a modal (smooth scroll and native scroll). */
export function lockScroll(on: boolean) {
  document.documentElement.style.overflow = on ? 'hidden' : ''
  if (on) lenis?.stop()
  else lenis?.start()
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function useMedia(q: string) {
  const [v, setV] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setV(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [q])
  return v
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
/** Map v from [a,b] to [0,1], clamped. */
export const span = (v: number, a: number, b: number) => clamp((v - a) / (b - a))
