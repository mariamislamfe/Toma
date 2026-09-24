import { useEffect, useRef } from 'react'
import { useI18n } from '../lib/i18n'
import { isCoarse, scrollState, useReducedMotion } from '../lib/motion'
import './marquee.css'

/** A tilted street-sign ticker between chapters. Speeds up with scroll velocity and follows its direction. */
export default function Marquee({ tone = 'orange', reverse = false }: { tone?: 'orange' | 'plum'; reverse?: boolean }) {
  const { lang, num } = useI18n()
  const reduced = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)

  const words =
    lang === 'ar'
      ? ['كشري', 'رز', 'عدس', 'مكرونة', 'حمص', 'صلصة', 'دقة', 'بصل محمّر', `اطلب ${num(19397)}`]
      : ['Koshary', 'Rice', 'Lentils', 'Pasta', 'Chickpeas', 'Sauce', 'Da’a', 'Crispy onions', 'Order 19397']

  const cssLoop = !reduced && isCoarse()

  useEffect(() => {
    if (reduced || cssLoop) return
    const el = track.current!
    let x = 0
    let raf = 0
    let vel = 0
    let lastY = scrollState.y
    let dir = reverse ? 1 : -1
    let visible = false
    let halfW = el.scrollWidth / 2
    const half = () => halfW
    const measure = () => (halfW = el.scrollWidth / 2)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    const loop = () => {
      const y = scrollState.y
      const dy = y - lastY
      lastY = y
      if (dy !== 0) dir = (dy > 0 ? -1 : 1) * (reverse ? -1 : 1)
      vel += (Math.min(40, Math.abs(dy)) * 0.5 - vel) * 0.1
      x += dir * (1.1 + vel)
      const h = half()
      if (x <= -h) x += h
      if (x > 0) x -= h
      el.style.transform = `translate3d(${x}px,0,0)`
      raf = visible ? requestAnimationFrame(loop) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) {
        lastY = scrollState.y
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(root.current!)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [reduced, reverse, cssLoop])

  const row = (k: string) =>
    words.map((w, i) => (
      <span key={`${k}${i}`} className="mq__item display">
        {w}
        <i aria-hidden="true">✦</i>
      </span>
    ))

  return (
    <div ref={root} className={`mq mq--${tone} ${reverse ? 'mq--rev' : ''} ${cssLoop ? 'mq--css' : ''}`} aria-hidden="true">
      {/* LTR track so the loop math is the same in both languages */}
      <div ref={track} className="mq__track" dir="ltr">
        <div className="mq__run" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {row('a')}
        </div>
        <div className="mq__run" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {row('b')}
        </div>
      </div>
    </div>
  )
}
