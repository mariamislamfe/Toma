import { useEffect, useRef } from 'react'
import { useI18n } from '../lib/i18n'
import { APP_LINKS } from '../data/brand'
import { byId, categories } from '../data/menu'
import { ScrollTrigger } from '../lib/motion'
import './app.css'

const SCREEN = [2, 3, 7, 67, 8, 55, 22, 15]

function Badge({ href, src, alt }: { href: string | null; src: string; alt: string }) {
  const img = <img src={src} alt={alt} width={160} height={48} loading="lazy" />
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ap__badge">
      {img}
    </a>
  ) : (
    <span className="ap__badge">{img}</span>
  )
}

export default function AppPhone() {
  const { t, lang, num } = useI18n()
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current!
    const phone = el.querySelector<HTMLElement>('.ap__phone')!
    const screen = el.querySelector<HTMLElement>('.ap__scroll')!
    const fa = el.querySelector<HTMLElement>('.ap__float--a')!
    const fb = el.querySelector<HTMLElement>('.ap__float--b')!
    const trig = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom bottom',
      onUpdate: (s) => {
        const a = s.progress
        const k = Math.min(1, a * 2.6)
        phone.style.transform = `translate3d(0, ${((1 - k) * 60).toFixed(2)}vh, 0) rotate(${((1 - k) * -18).toFixed(2)}deg)`
        screen.style.transform = `translate3d(0, ${(-Math.max(0, a - 0.38) * 90).toFixed(2)}%, 0)`
        fa.style.transform = `translate3d(0, ${((0.6 - a) * 60).toFixed(2)}%, 0) rotate(14deg)`
        fb.style.transform = `translate3d(0, ${((a - 0.5) * 80).toFixed(2)}%, 0) rotate(-12deg)`
      },
    })
    return () => trig.kill()
  }, [])

  return (
    <section id="app" ref={root} className="ap" aria-labelledby="ap-title">
      <div className="ap__pin">
        <div className="ap__copy">
          <p className="kicker" data-reveal="side">{t.appKicker}</p>
          <h2 id="ap-title" className="display ap__title" data-reveal="mask">
            {t.appTitle}
          </h2>
          <p className="ap__line display" data-reveal="up">{t.appLine}</p>
          <p className="ap__from">{t.appFrom}</p>
          <div className="ap__badges" data-reveal="stagger">
            <Badge href={APP_LINKS.ios} src="/brand/apple-2.svg" alt="App Store" />
            <Badge href={APP_LINKS.android} src="/brand/google-2.svg" alt="Google Play" />
          </div>
        </div>

        <div className="ap__phone" aria-hidden="true">
          <div className="ap__frame">
            <div className="ap__notch" />
            <div className="ap__screen">
              <div className="ap__scroll">
                <div className="ap__bar">
                  <img src="/brand/logo.svg" alt="" width={150} height={57} />
                  <span className="ap__city">{lang === 'ar' ? 'القاهرة' : 'Cairo'} ▾</span>
                </div>
                <div className="ap__promo">
                  <img src="/food/p-67-sm.webp" alt="" width={480} height={369} loading="lazy" decoding="async" />
                </div>
                <div className="ap__chips">
                  {categories.slice(0, 4).map((c, i) => (
                    <span key={c.id} className={i === 0 ? 'is-on' : ''}>
                      {lang === 'ar' ? c.ar : c.en}
                    </span>
                  ))}
                </div>
                <div className="ap__grid">
                  {SCREEN.map((id) => {
                    const p = byId(id)
                    return (
                      <div key={id} className="ap__card">
                        <img src={p.img.replace('.webp', '-sm.webp')} alt="" width={480} height={480} loading="lazy" decoding="async" />
                        <b>{lang === 'ar' ? p.ar : p.en}</b>
                        <span className="price">
                          {num(p.price)} {t.currency}
                        </span>
                        <i>+</i>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="ap__tab">
                <span className="is-on" />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
          <img className="ap__float ap__float--a" src="/food/p-29-sm.webp" alt="" width={194} height={480} loading="lazy" decoding="async" />
          <img className="ap__float ap__float--b" src="/food/p-35-sm.webp" alt="" width={302} height={480} loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  )
}
