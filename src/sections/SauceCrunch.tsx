import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { useOrder } from '../lib/order'
import { byId, srcSet } from '../data/menu'
import { onionSprites } from '../lib/onionSprites'
import { ScrollTrigger, isLite, span, useMedia } from '../lib/motion'
import './sauce.css'

/**
 * Drippy flood sheet: liquid from the top down to `level`·H, with tongues hanging below it.
 * Drawn once per resize at level 1, then slid into place with a GPU transform (no repaint per frame).
 */
function floodPath(W: number, H: number, level: number, seed: number, drips = 9) {
  if (level <= 0) return ''
  const y = level * H
  let d = `M0,-10 H${W} V${y.toFixed(1)}`
  const n = drips
  for (let i = n; i >= 0; i--) {
    const x0 = (i / n) * W
    const x1 = ((i - 1) / n) * W
    if (i === 0) break
    const k = Math.sin(i * 12.9898 + seed) * 43758.5453
    const r = k - Math.floor(k)
    const w = (x0 - x1) * (0.28 + r * 0.25)
    const cx = x1 + (x0 - x1) * (0.3 + r * 0.4)
    const len = Math.min(H * 0.22, (0.04 + r * 0.16) * H * Math.min(1, level * 2.5))
    // flat edge → tongue down → back up
    d += ` L${(cx + w / 2).toFixed(1)},${y.toFixed(1)}`
    d += ` C${(cx + w / 2).toFixed(1)},${(y + len * 0.7).toFixed(1)} ${(cx + w * 0.42).toFixed(1)},${(y + len).toFixed(1)} ${cx.toFixed(1)},${(y + len).toFixed(1)}`
    d += ` C${(cx - w * 0.42).toFixed(1)},${(y + len).toFixed(1)} ${(cx - w / 2).toFixed(1)},${(y + len * 0.7).toFixed(1)} ${(cx - w / 2).toFixed(1)},${y.toFixed(1)}`
  }
  d += ` L0,${y.toFixed(1)} Z`
  return d
}

export default function SauceCrunch() {
  const { t, lang, num } = useI18n()
  const { add } = useOrder()
  const mobile = useMedia('(max-width: 760px)')
  const root = useRef<HTMLElement>(null)
  const sauceP = useRef<SVGPathElement>(null)
  const daaP = useRef<SVGPathElement>(null)
  const onionP = useRef<SVGPathElement>(null)
  const sheets = useRef<(SVGSVGElement | null)[]>([])
  const rain = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState(0)
  const [added, setAdded] = useState<number | null>(null)

  useEffect(() => {
    const el = root.current!
    const cv = rain.current!
    const c = cv.getContext('2d')!
    let W = 0
    let H = 0
    let q = 0
    let sprites: HTMLCanvasElement[] = []
    const N = isLite ? 26 : mobile ? 50 : 110
    const drops = Array.from({ length: N }, (_, i) => ({
      x: (i * 0.618) % 1,
      o: ((i * 0.377) % 1) * 1.3,
      s: 0.6 + ((i * 0.713) % 1) * 0.9,
      r: i * 1.7,
      v: 0.7 + ((i * 0.291) % 1) * 0.6,
      k: i % 8,
    }))

    const size = () => {
      // phones fire resize when the address bar slides; only rebuild on a real size change
      const nW = el.clientWidth
      const nH = window.innerHeight
      if (W && nW === W && Math.abs(nH - H) < 160) return
      lv.fill(-1)
      W = nW
      H = nH
      const specs: [SVGPathElement, number, number][] = [
        [sauceP.current!, 1, isLite ? 5 : mobile ? 6 : 10],
        [daaP.current!, 7, isLite ? 4 : mobile ? 5 : 8],
        [onionP.current!, 3, isLite ? 5 : mobile ? 7 : 12],
      ]
      specs.forEach(([node, seed, drips], i) => {
        sheets.current[i]!.setAttribute('viewBox', `0 0 ${W} ${H * 1.25}`)
        node.setAttribute('d', floodPath(W, H, 1, seed, drips))
      })
      const dpr = Math.min(devicePixelRatio || 1, 1.75)
      cv.width = W * dpr
      cv.height = H * dpr
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      sprites = onionSprites((Math.min(W, 900) / 600) * 2.2 * dpr, 8)
      draw()
    }

    let visible = false
    let raf = 0
    const t0 = performance.now()

    const drawRain = (time: number) => {
      c.clearRect(0, 0, W, H)
      const amt = span(q, 0.62, 0.72)
      if (amt <= 0) return
      c.globalAlpha = amt
      const tt = time * 0.00006
      for (const d of drops) {
        const y = (((d.o + q * 2.2 * d.v + tt * d.v) % 1.3) - 0.15) * H
        const x = d.x * W + Math.sin(y * 0.01 + d.r) * 14
        const img = sprites[d.k]
        const rot = d.r + y * 0.004 * d.v
        const cos = Math.cos(rot) * d.s
        const sin = Math.sin(rot) * d.s
        c.setTransform(cos * (cv.width / W), sin * (cv.width / W), -sin * (cv.width / W), cos * (cv.width / W), x * (cv.width / W), y * (cv.width / W))
        c.drawImage(img, -img.width / 2, -img.height / 2)
      }
      c.setTransform(cv.width / W, 0, 0, cv.width / W, 0, 0)
      c.globalAlpha = 1
    }

    // only rewrite a flood path when its level actually moved
    const lv = [-1, -1, -1]
    const flood = (i: number, level: number) => {
      const r = Math.round(level * 1000) / 1000
      if (r === lv[i]) return
      lv[i] = r
      // sheet bottom edge sits at r·H; fully parked above the screen at 0
      const y = r <= 0 ? -1.3 * H : Math.min(0, (r - 1) * H - (1 - Math.min(1, r * 4)) * 0.25 * H)
      sheets.current[i]!.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`
    }
    const sauceScene = el.querySelector<HTMLElement>('.sc__scene--sauce')!
    let lastOp = ''
    const draw = () => {
      flood(0, 0.3 + span(q, 0.0, 0.16) * 0.8)
      flood(1, span(q, 0.36, 0.5) * 0.34)
      flood(2, span(q, 0.58, 0.72) * 1.25)
      // sauce copy fades in only once the flood has covered the screen
      const op = q < 0.34 ? span(q, 0.08, 0.16).toFixed(2) : ''
      if (op !== lastOp) {
        sauceScene.style.opacity = op
        lastOp = op
      }
      setPhase(q < 0.34 ? 0 : q < 0.58 ? 1 : 2)
      if (q > 0.6 || lv[2] > 0) drawRain(performance.now() - t0)
    }

    const loop = (time: number) => {
      drawRain(time - t0)
      raf = visible && q > 0.6 ? requestAnimationFrame(loop) : 0
    }

    size()
    window.addEventListener('resize', size)
    const trig = ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (s) => {
            q = s.progress
            draw()
            if (visible && q > 0.6 && !raf) raf = requestAnimationFrame(loop)
          },
          onToggle: (s) => {
            visible = s.isActive
            if (!visible) {
              cancelAnimationFrame(raf)
              raf = 0
            } else if (q > 0.6 && !raf) raf = requestAnimationFrame(loop)
          },
        })
    return () => {
      window.removeEventListener('resize', size)
      cancelAnimationFrame(raf)
      trig.kill()
    }
  }, [mobile])

  const extra = (id: number) => {
    const p = byId(id)
    return (
      <button
        className={`sc__add ${added === id ? 'is-added' : ''}`}
        onClick={() => {
          add(id)
          setAdded(id)
          setTimeout(() => setAdded((a) => (a === id ? null : a)), 1400)
        }}
      >
        <span>{added === id ? t.added : `${t.addExtra} — ${lang === 'ar' ? p.ar : p.en}`}</span>
        <b className="price">
          {num(p.price)} {t.currency}
        </b>
      </button>
    )
  }

  return (
    <section id="sauce" ref={root} className="sc" data-phase={phase} aria-labelledby="sc-title">
      <div className="sc__pin">
        <div className="sc__flood" aria-hidden="true">
        <svg ref={(n) => { sheets.current[0] = n }} className="sc__sheet" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sauceG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8e1409" />
              <stop offset="0.55" stopColor="#c8261b" />
              <stop offset="1" stopColor="#e2461f" />
            </linearGradient>
            <linearGradient id="daaG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f9a333" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffbf55" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="onionG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1f0a02" />
              <stop offset="0.7" stopColor="#3b1606" />
              <stop offset="1" stopColor="#5a2408" />
            </linearGradient>
          </defs>
          <path ref={sauceP} fill="url(#sauceG)" />
        </svg>
        <svg ref={(n) => { sheets.current[1] = n }} className="sc__sheet" preserveAspectRatio="none">
          <path ref={daaP} fill="url(#daaG)" />
        </svg>
        <svg ref={(n) => { sheets.current[2] = n }} className="sc__sheet" preserveAspectRatio="none">
          <path ref={onionP} fill="url(#onionG)" />
        </svg>
        </div>
        <canvas ref={rain} className="sc__rain" aria-hidden="true" />

        {/* 1 · sauce */}
        <div className="sc__scene sc__scene--sauce" {...(phase !== 0 && { inert: true, "aria-hidden": true })}>
          <p className="sc__kicker display">{t.sauceKicker}</p>
          <h2 id="sc-title" className="sc__word display">
            {t.sauceWord}
          </h2>
          <p className="sc__line">{t.sauceLine}</p>
          <img className="sc__img sc__img--pouch" src="/food/p-21.webp" srcSet={srcSet('/food/p-21.webp')} sizes="(max-width: 760px) 46vw, 22vw" decoding="async" alt={lang === 'ar' ? 'صلصة تومة' : 'TOMA tomato sauce'} loading="lazy" />
          <img className="sc__img sc__img--bowl" src="/food/p-56.webp" srcSet={srcSet('/food/p-56.webp')} sizes="(max-width: 760px) 46vw, 22vw" decoding="async" alt="" loading="lazy" />
          {extra(21)}
        </div>

        {/* 2 · da'a */}
        <div className="sc__scene sc__scene--daa" {...(phase !== 1 && { inert: true, "aria-hidden": true })}>
          <h2 className="sc__word display">{t.daaWord}</h2>
          <p className="sc__line">{t.daaLine}</p>
          <img className="sc__img sc__img--daa" src="/food/p-58.webp" srcSet={srcSet('/food/p-58.webp')} sizes="(max-width: 760px) 46vw, 22vw" decoding="async" alt={lang === 'ar' ? 'دقة تومة' : 'TOMA da’a'} loading="lazy" />
          <img className="sc__img sc__img--sachet" src="/food/p-36.webp" srcSet={srcSet('/food/p-36.webp')} sizes="(max-width: 760px) 46vw, 22vw" decoding="async" alt="" loading="lazy" />
          {extra(58)}
        </div>

        {/* 3 · crunch */}
        <div className="sc__scene sc__scene--crunch" {...(phase !== 2 && { inert: true, "aria-hidden": true })}>
          <h2 className="sc__word display sc__crunch">
            {t.crunchWord}
          </h2>
          <p className="sc__line">{t.crunchLine}</p>
          <img className="sc__img sc__img--bag" src="/food/p-20.webp" srcSet={srcSet('/food/p-20.webp')} sizes="(max-width: 760px) 46vw, 22vw" decoding="async" alt={lang === 'ar' ? 'تقلية تومة' : 'TOMA fried onions'} loading="lazy" />
          {extra(20)}
        </div>
      </div>
    </section>
  )
}
