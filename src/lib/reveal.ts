import { useEffect } from 'react'
import { gsap, ScrollTrigger, isLite } from './motion'

/**
 * Site-wide scroll choreography, declared in markup:
 *
 *   data-reveal="up | pop | mask | tilt | side | stagger"   — plays once as it enters
 *   data-parallax="0.15"                                     — drifts with scroll (fraction of its height)
 *
 */
const VARIANTS: Record<string, gsap.TweenVars> = {
  up: { y: 70, opacity: 0, duration: 0.9, ease: 'power3.out' },
  pop: { scale: 0.6, rotate: -8, opacity: 0, duration: 0.9, ease: 'back.out(1.8)' },
  mask: { clipPath: 'inset(0 0 100% 0)', y: 40, duration: 1, ease: 'power4.out' },
  tilt: { y: 90, rotate: 5, opacity: 0, duration: 1, ease: 'power3.out' },
  side: { x: 90, opacity: 0, duration: 0.9, ease: 'power3.out' },
}

function wire(scope: ParentNode) {
  const els = [...scope.querySelectorAll<HTMLElement>('[data-reveal]:not([data-wired])')]
  for (const el of els) {
    el.dataset.wired = ''
    const kind = el.dataset.reveal || 'up'
    const rtl = document.documentElement.dir === 'rtl'
    if (kind === 'stagger') {
      gsap.from(el.children, {
        y: 50,
        opacity: 0,
        scale: 0.92,
        duration: 0.7,
        ease: 'back.out(1.5)',
        stagger: 0.07,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
      continue
    }
    const v = { ...VARIANTS[kind] }
    if (kind === 'side' && rtl) v.x = -(v.x as number)
    gsap.from(el, {
      ...v,
      delay: Number(el.dataset.delay || 0),
      clearProps: 'transform,opacity,clipPath',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  }

  const px = isLite ? [] : [...scope.querySelectorAll<HTMLElement>('[data-parallax]:not([data-pwired])')]
  for (const el of px) {
    el.dataset.pwired = ''
    el.style.willChange = 'transform'
    const k = Number(el.dataset.parallax || 0.15)
    gsap.fromTo(
      el,
      { yPercent: k * 100 },
      {
        yPercent: -k * 100,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('section, footer') || el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }
}

/** Infinite CSS loops (steam, floats, stripes, pings) stop ticking while their section is off screen. */
function pauseOffscreen() {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
    { rootMargin: '10% 0px' },
  )
  document.querySelectorAll('main > section, .fn').forEach((s) => io.observe(s))
  return io
}

export function useReveal(key: string) {
  useEffect(() => {
    const ctx = gsap.context(() => {})
    let io: IntersectionObserver | null = null
    const run = () => {
      ctx.add(() => {
        wire(document)
        ScrollTrigger.refresh()
      })
      io?.disconnect()
      io = pauseOffscreen()
    }
    const id = requestAnimationFrame(run)
    return () => {
      cancelAnimationFrame(id)
      io?.disconnect()
      ctx.revert()
      document.querySelectorAll('[data-wired],[data-pwired]').forEach((el) => {
        el.removeAttribute('data-wired')
        el.removeAttribute('data-pwired')
      })
    }
  }, [key])
}
