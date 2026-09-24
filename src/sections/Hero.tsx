import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { useOrder } from '../lib/order'
import { byId, kosharyLadder } from '../data/menu'
import { HOTLINE, cities } from '../data/brand'
import { isCoarse, scrollToId, useReducedMotion } from '../lib/motion'
import { useMagnetic } from '../lib/useMagnetic'
import './hero.css'

// Facts shown under the headline — all derived from TOMA's own data.
const CITY_COUNT = cities.length
const BRANCH_COUNT = cities.reduce((n, c) => n + c.branches.length, 0)
const BOWL = byId(kosharyLadder[0])

export default function Hero() {
  const { t, lang, num } = useI18n()
  const { add } = useOrder()
  const reduced = useReducedMotion()
  const root = useRef<HTMLElement>(null)
  const cta = useRef<HTMLAnchorElement>(null)
  const [added, setAdded] = useState(false)
  useMagnetic(cta)

  // a little depth on desktop: the bowl leans toward the cursor, the word drifts away from it
  useEffect(() => {
    const el = root.current!
    if (reduced || isCoarse()) return
    let raf = 0
    const move = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', x.toFixed(3))
        el.style.setProperty('--my', y.toFixed(3))
      })
    }
    el.addEventListener('pointermove', move)
    return () => {
      el.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  const goMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToId('menu')
  }
  const facts = t.heroFacts(num(CITY_COUNT), num(BRANCH_COUNT), num(BOWL.price))
  const time = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__grid">
        {/* right (RTL) — the pitch */}
        <div className="hero__copy">
          <p className="kicker">{t.heroKicker}</p>
          <h1 id="hero-title" className="display hero__title">
            <span>{t.heroTitle[0]}</span>
            <span className="hero__title2">{t.heroTitle[1]}</span>
          </h1>
          <p className="hero__lead">{t.heroLead}</p>
          <ul className="hero__facts">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="hero__actions">
            <a ref={cta} className="cta" href="#menu" onClick={goMenu}>
              {t.orderNow}
            </a>
            <a className="hero__hot" href={`tel:${HOTLINE}`} aria-label={HOTLINE}>
              <span className="hotline">
                19<b>3</b>97
              </span>
            </a>
          </div>
        </div>

        {/* centre — the bowl */}
        <div className="hero__bowl">
          {/* the word behind the bowl */}
          <div className="hero__word display" aria-hidden="true">
            <span data-parallax="0.3">{t.heroWord}</span>
          </div>
          <div className="hero__steam" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <img
            className="hero__photo"
            src="/food/hero-bowl.webp"
            alt={lang === 'ar' ? 'طبق كشري تومة' : 'A bowl of TOMA koshary'}
            width={1000}
            height={1000}
            fetchPriority="high"
          />
          <div className="hero__shadow" aria-hidden="true" />
        </div>

        {/* left (RTL) — what's in it, on a receipt */}
        <aside className="hero__receipt" aria-label={t.receiptTitle}>
          <div className="rc">
            <header className="rc__head">
              <img src="/brand/logo.svg" alt="" width={96} height={36} />
              <div>
                <span>
                  {t.receiptNo} #{num('001')}
                </span>
                <span>{time}</span>
              </div>
            </header>
            <p className="rc__title display">{t.receiptTitle}</p>
            <ol className="rc__items">
              {t.receiptItems.map((it, i) => (
                <li key={it} style={{ ['--i' as string]: i }}>
                  <span className="rc__n">{num(i + 1)}</span>
                  <span className="rc__name">{it}</span>
                  <span className="rc__dots" aria-hidden="true" />
                  <span className="rc__tick" aria-hidden="true">
                    ✓
                  </span>
                </li>
              ))}
            </ol>
            <div className="rc__total">
              <span>{t.receiptTotal}</span>
              <b className="price">
                {num(BOWL.price)} <small>{t.currency}</small>
              </b>
            </div>
            <button
              className={`rc__add ${added ? 'is-added' : ''}`}
              onClick={() => {
                add(BOWL.id)
                setAdded(true)
                setTimeout(() => setAdded(false), 1400)
              }}
            >
              {added ? t.added : t.add}
            </button>
            <p className="rc__thanks">{t.receiptThanks}</p>
            <div className="rc__barcode" aria-hidden="true" />
          </div>
        </aside>
      </div>

      <a className="hero__scroll" href="#sauce" onClick={(e) => (e.preventDefault(), scrollToId('sauce'))}>
        <span>{t.heroScroll}</span>
        <i aria-hidden="true">↓</i>
      </a>
    </section>
  )
}
