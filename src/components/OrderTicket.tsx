import { useEffect, useRef } from 'react'
import { useI18n } from '../lib/i18n'
import { useOrder } from '../lib/order'
import { byId } from '../data/menu'
import { HOTLINE, ORDER_WEB } from '../data/brand'
import { lockScroll } from '../lib/motion'
import './ticket.css'

/** Thermal-receipt order summary. Frontend only: hands off to TOMA's real channels. */
export default function OrderTicket() {
  const { t, lang, num } = useI18n()
  const { lines, total, open, setOpen, add, dec, clear, ticketNo } = useOrder()
  const panel = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    lastFocus.current = document.activeElement as HTMLElement
    lockScroll(true)
    requestAnimationFrame(() => panel.current?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setOpen(false)
      if (e.key !== 'Tab' || !panel.current) return
      // keep Tab inside the dialog
      const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
      lastFocus.current?.focus?.()
    }
  }, [open, setOpen])

  const time = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`ticket-layer ${open ? 'is-open' : ''}`}>
      <div className="ticket-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
      <div
        ref={panel}
        className="ticket"
        role="dialog"
        aria-modal="true"
        aria-label={t.ticket}
        aria-hidden={!open}
        tabIndex={-1}
        {...(!open && { inert: true })}
      >
        <div className="ticket__paper">
          <header className="ticket__head">
            <img src="/brand/logo.svg" alt="" width={110} height={42} className="ticket__logo" />
            <div className="ticket__meta">
              <span>
                {t.ticketNo} <b>#{num(ticketNo)}</b>
              </span>
              <span>{time}</span>
            </div>
            <button className="ticket__close" onClick={() => setOpen(false)} aria-label={t.close}>
              ×
            </button>
          </header>
          <div className="ticket__rule" />
          {lines.length === 0 ? (
            <p className="ticket__empty">{t.ticketEmpty}</p>
          ) : (
            <ul className="ticket__lines">
              {lines.map((l) => {
                const p = byId(l.id)
                const name = lang === 'ar' ? p.ar : p.en
                return (
                  <li key={l.id}>
                    <span className="ticket__name">{name}</span>
                    <span className="ticket__qty">
                      <button onClick={() => dec(l.id)} aria-label={`− ${name}`}>−</button>
                      <b aria-live="polite">{num(l.qty)}</b>
                      <button onClick={() => add(l.id)} aria-label={`+ ${name}`}>+</button>
                    </span>
                    <span className="ticket__amt price">{num(p.price * l.qty)}</span>
                  </li>
                )
              })}
            </ul>
          )}
          <div className="ticket__rule" />
          <div className="ticket__total">
            <span>{t.ticketTotal}</span>
            <b className="price">
              {num(total)} <small>{t.currency}</small>
            </b>
          </div>
          <p className="ticket__hint">{t.ticketHint}</p>
          <div className="ticket__actions">
            <a className="cta" href={`tel:${HOTLINE}`}>
              {t.ticketCall}{' '}
              <span className="hotline">
                19<b>3</b>97
              </span>
            </a>
            <a className="cta cta--green" href={ORDER_WEB(lang)} target="_blank" rel="noopener noreferrer">
              {t.ticketWeb}
            </a>
            {lines.length > 0 && (
              <button className="ticket__clear" onClick={clear}>
                {t.ticketClear}
              </button>
            )}
          </div>
          <p className="ticket__foot">{t.menuNote}</p>
        </div>
      </div>
    </div>
  )
}
