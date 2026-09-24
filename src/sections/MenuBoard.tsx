import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { useOrder } from '../lib/order'
import { categories, inCategory, byId, srcSet, type CategoryId, type Product } from '../data/menu'
import { gsap } from '../lib/motion'
import { useMagnetic } from '../lib/useMagnetic'
import './menu.css'

function Dish({ p, state, alt }: { p: Product; state: 'in' | 'out'; alt: string }) {
  if (!p.img)
    return (
      <div className={`mb__dish mb__dish--type is-${state}`} aria-hidden={state === 'out'}>
        <span className="display">{alt}</span>
      </div>
    )
  return (
    <img
      className={`mb__dish ${p.category === 'offers' ? 'mb__dish--banner' : ''} is-${state}`}
      src={p.img}
      srcSet={srcSet(p.img)}
      sizes="(max-width: 960px) 80vw, 42vw"
      loading="lazy"
      decoding="async"
      alt={state === 'in' ? alt : ''}
      aria-hidden={state === 'out'}
      draggable={false}
    />
  )
}

export default function MenuBoard() {
  const { t, lang, num } = useI18n()
  const { add } = useOrder()
  const [cat, setCat] = useState<CategoryId>('koshary')
  const [cur, setCur] = useState(2)
  const [prev, setPrev] = useState<number | null>(null)
  const [dir, setDir] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const root = useRef<HTMLElement>(null)
  const addBtn = useRef<HTMLButtonElement>(null)
  const touch = useRef<number | null>(null)
  useMagnetic(addBtn, 0.2)

  const list = inCategory(cat)
  const p = byId(cur)
  const name = (x: Product) => (lang === 'ar' ? x.ar : x.en)

  const pick = (id: number) => {
    if (id === cur) return
    const a = list.findIndex((x) => x.id === cur)
    const b = list.findIndex((x) => x.id === id)
    setDir(b >= a ? 1 : -1)
    setPrev(cur)
    setCur(id)
  }
  const pickCat = (c: CategoryId) => {
    if (c === cat) return
    setCat(c)
    setPrev(cur)
    setDir(1)
    setCur(inCategory(c)[0].id)
  }
  const step = (d: number) => {
    const i = list.findIndex((x) => x.id === cur)
    const n = list[(i + d + list.length) % list.length]
    setDir(d)
    setPrev(cur)
    setCur(n.id)
  }

  useEffect(() => {
    if (prev === null) return
    const id = setTimeout(() => setPrev(null), 700)
    return () => clearTimeout(id)
  }, [prev, cur])

  // entrance: the board slides up like a sheet of paper over the previous chapter
  useEffect(() => {
    const el = root.current!
    const ctx = gsap.context(() => {
      gsap.from('.mb__board', {
        yPercent: 18,
        rotate: -2,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: 0.6 },
      })
      gsap.from('.mb__stage', {
        y: 120,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 20%', scrub: 0.6 },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const doAdd = () => {
    add(cur)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <section id="menu" ref={root} className="mb" aria-labelledby="mb-title" data-cat={cat}>
      <div className="mb__head">
        <p className="kicker" data-reveal="side">{t.menuKicker}</p>
        <h2 id="mb-title" className="display mb__title" data-reveal="mask">
          {t.menuTitle}
        </h2>
      </div>

      <div className="mb__grid">
        {/* the price board */}
        <div className="mb__board">
          <div className="mb__cats" role="group" aria-label={t.menuKicker}>
            {categories.map((c) => (
              <button
                key={c.id}
                aria-pressed={cat === c.id}
                className={`mb__cat ${cat === c.id ? 'is-on' : ''}`}
                onClick={() => pickCat(c.id)}
              >
                <span className="display">{lang === 'ar' ? c.ar : c.en}</span>
                <small>{num(inCategory(c.id).length)}</small>
              </button>
            ))}
          </div>
          <ul className="mb__list" key={cat} aria-label={lang === 'ar' ? categories.find((c) => c.id === cat)!.ar : categories.find((c) => c.id === cat)!.en}>
            {list.map((x) => (
              <li key={x.id}>
                <button
                  className={`mb__row ${x.id === cur ? 'is-on' : ''}`}
                  onClick={() => pick(x.id)}
                  onMouseEnter={() => !matchMedia('(pointer: coarse)').matches && pick(x.id)}
                  aria-pressed={x.id === cur}
                >
                  <span className="mb__rowname">{name(x)}</span>
                  <span className="mb__dots" aria-hidden="true" />
                  <span className="mb__rowprice price">{num(x.price)}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mb__note">{t.menuNote}</p>
        </div>

        {/* the dish */}
        <div
          className="mb__stage"
          data-dir={dir}
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label={name(p)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') step(lang === 'ar' ? 1 : -1)
            if (e.key === 'ArrowRight') step(lang === 'ar' ? -1 : 1)
          }}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return
            const dx = e.changedTouches[0].clientX - touch.current
            touch.current = null
            if (Math.abs(dx) > 40) step((dx < 0 ? 1 : -1) * (lang === 'ar' ? -1 : 1))
          }}
        >
          <div className="mb__ghost display" aria-hidden="true" key={`g${cur}`}>
            {name(p)}
          </div>
          <div className="mb__plate">
            {prev !== null && <Dish key={`o${prev}`} p={byId(prev)} state="out" alt={name(byId(prev))} />}
            <Dish key={`i${cur}`} p={p} state="in" alt={name(p)} />
          </div>
          <div className="mb__sticker" key={`s${cur}`}>
            <b className="price">{num(p.price)}</b>
            <small>{t.currency}</small>
          </div>
          <div className="mb__info">
            <h3 className="display mb__name" key={`n${cur}`} aria-live="polite">
              {name(p)}
            </h3>
            {(lang === 'ar' ? p.descAr : p.descEn) && <p className="mb__desc">{lang === 'ar' ? p.descAr : p.descEn}</p>}
            <div className="mb__actions">
              <button ref={addBtn} className={`cta ${justAdded ? 'cta--green' : ''}`} onClick={doAdd}>
                {justAdded ? t.added : t.add}
              </button>
              <div className="mb__arrows">
                <button onClick={() => step(-1)} aria-label={lang === 'ar' ? 'السابق' : 'Previous'}>
                  {lang === 'ar' ? '→' : '←'}
                </button>
                <button onClick={() => step(1)} aria-label={lang === 'ar' ? 'التالي' : 'Next'}>
                  {lang === 'ar' ? '←' : '→'}
                </button>
              </div>
            </div>
            <p className="mb__swipe">{t.swipeHint}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
