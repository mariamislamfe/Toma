import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { useOrder } from '../lib/order'
import { scrollState, scrollToId } from '../lib/motion'
import { useMagnetic } from '../lib/useMagnetic'
import './nav.css'

export default function Nav() {
  const { t, lang, setLang, num } = useI18n()
  const { count, setOpen, pulse } = useOrder()
  // initial value comes from the cached scroll position (no layout read during the first render)
  const [compact, setCompact] = useState(() => scrollState.y > 60)
  const orderRef = useRef<HTMLButtonElement>(null)
  useMagnetic(orderRef, 0.2)

  useEffect(() => {
    const on = () => setCompact(window.scrollY > 60)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <header className={`nav ${compact ? 'is-compact' : ''}`}>
      <div className="nav__bar">
        <a href="#top" className="nav__logo" onClick={go('top')} aria-label="TOMA">
          <img src="/brand/logo.svg" alt="TOMA تومة" width={150} height={57} />
        </a>
        <nav className="nav__links" aria-label={lang === 'ar' ? 'الرئيسية' : 'Main'}>
          <a href="#menu" onClick={go('menu')}>{t.navMenu}</a>
          <a href="#branches" onClick={go('branches')}>{t.navBranches}</a>
          <a href="#app" onClick={go('app')}>{t.navApp}</a>
        </nav>
        <div className="nav__end">
          <button
            className="nav__lang"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            aria-label={t.langSwitchLabel}
            lang={lang === 'ar' ? 'en' : 'ar'}
          >
            {t.langSwitch}
          </button>
          <button
            ref={orderRef}
            className="nav__order"
            onClick={() => (count ? setOpen(true) : scrollToId('menu'))}
            aria-label={count ? `${t.ticket} (${count})` : t.navOrder}
          >
            <span className={`nav__bump ${pulse ? 'is-on' : ''}`} key={pulse}>
              <span>{t.navOrder}</span>
              {count > 0 && <b className="nav__count">{num(count)}</b>}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
