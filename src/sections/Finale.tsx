import { useEffect, useRef } from 'react'
import { useI18n } from '../lib/i18n'
import { EMAIL, HOTLINE, HQ, LEGAL, ORDER_WEB, cities } from '../data/brand'
import { HERO_SRCSET } from '../data/menu'
import { useOrder } from '../lib/order'
import { ScrollTrigger, scrollToId } from '../lib/motion'
import { useMagnetic } from '../lib/useMagnetic'
import './finale.css'

export default function Finale() {
  const { t, lang } = useI18n()
  const { count, setOpen } = useOrder()
  const root = useRef<HTMLDivElement>(null)
  const cta = useRef<HTMLButtonElement>(null)
  useMagnetic(cta, 0.3)

  useEffect(() => {
    const el = root.current!
    const ask = el.querySelector<HTMLElement>('.fn__ask')!
    const bowl = el.querySelector<HTMLElement>('.fn__bowl')!
    // measure against the CTA stage itself (the footer below it would stretch the timeline)
    const trig = ScrollTrigger.create({
      trigger: el.querySelector('.fn__stage')!,
      start: 'top bottom',
      end: 'top 35%',
      onUpdate: (s) => {
        const f = s.progress
        ask.style.transform = `translate3d(0, ${((1 - f) * 30).toFixed(2)}%, 0) scale(${(0.9 + f * 0.1).toFixed(3)})`
        ask.style.opacity = (0.75 + f * 0.25).toFixed(3)
        bowl.style.transform = `translate3d(0, ${((1 - f) * 40).toFixed(2)}%, 0) rotate(${((1 - f) * 10).toFixed(2)}deg) scale(${(0.8 + f * 0.2).toFixed(3)})`
      },
    })
    return () => trig.kill()
  }, [])

  const legal = LEGAL(lang)

  return (
    <div ref={root} className="fn">
      <section className="fn__stage" aria-labelledby="fn-title">
        <p className="fn__ask display" id="fn-title">
          {t.finalAsk}
        </p>
        <img className="fn__bowl" src="/food/hero-bowl.webp" srcSet={HERO_SRCSET} sizes="(max-width: 760px) 84vw, 640px" alt="" width={1000} height={1000} loading="lazy" decoding="async" />
        <div className="fn__actions">
          <button
            ref={cta}
            className="cta fn__cta"
            onClick={() => (count ? setOpen(true) : scrollToId('menu'))}
          >
            {t.finalCta}
          </button>
          <a className="fn__hot" href={`tel:${HOTLINE}`}>
            <span>{t.finalOr}</span>
            <span className="hotline">
              19<b>3</b>97
            </span>
          </a>
        </div>
      </section>

      <footer className="fn__info" data-reveal="stagger">
        <img src="/brand/logo.svg" alt="TOMA تومة" width={150} height={57} className="fn__logo" />
        <div className="fn__col">
          <h2>{t.footContact}</h2>
          <dl>
            <dt>{t.footHQ}</dt>
            <dd>{lang === 'ar' ? HQ.ar : HQ.en}</dd>
            <dt>{t.footEmail}</dt>
            <dd>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </dd>
            <dt>{t.footHotline}</dt>
            <dd>
              <a href={`tel:${HOTLINE}`} className="hotline">
                {HOTLINE}
              </a>
            </dd>
          </dl>
        </div>
        <div className="fn__col">
          <h2>{t.navBranches}</h2>
          <ul>
            {cities.map((c) => (
              <li key={c.id}>{lang === 'ar' ? c.ar : c.en}</li>
            ))}
          </ul>
        </div>
        <div className="fn__col">
          <h2>TOMA</h2>
          <ul>
            <li>
              <a href={ORDER_WEB(lang)} target="_blank" rel="noopener noreferrer">
                {t.navMenu}
              </a>
            </li>
            <li>
              <a href={`https://tomaegypt.com/${lang}/about`} target="_blank" rel="noopener noreferrer">
                {lang === 'ar' ? 'عن تومة' : 'About Toma'}
              </a>
            </li>
            <li>
              <a href={legal.privacy} target="_blank" rel="noopener noreferrer">
                {t.footPrivacy}
              </a>
            </li>
            <li>
              <a href={legal.terms} target="_blank" rel="noopener noreferrer">
                {t.footTerms}
              </a>
            </li>
          </ul>
        </div>
        <p className="fn__rights">{t.footRights}</p>
      </footer>
    </div>
  )
}
