import { useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { useOrder } from '../lib/order'
import { byId, kosharyLadder } from '../data/menu'
import { useMagnetic } from '../lib/useMagnetic'
import './meter.css'

export default function CravingMeter() {
  const { t, lang, num } = useI18n()
  const { add, setOpen } = useOrder()
  const [v, setV] = useState(35)
  const [mood, setMood] = useState<number | null>(null)
  const [added, setAdded] = useState(false)
  const lastLevel = useRef(-1)
  const cta = useRef<HTMLButtonElement>(null)
  useMagnetic(cta)

  const level = Math.min(5, Math.floor(v / 20))
  const ladderIdx = Math.min(kosharyLadder.length - 1, Math.round((v / 100) * (kosharyLadder.length - 1)))
  const id = mood ?? kosharyLadder[ladderIdx]
  const p = byId(id)
  const maxed = v >= 100 && mood === null

  const onInput = (n: number) => {
    setMood(null)
    setV(n)
    const lv = Math.min(5, Math.floor(n / 20))
    if (lv !== lastLevel.current) {
      lastLevel.current = lv
      navigator.vibrate?.(8)
    }
  }

  return (
    <section
      className={`cm ${maxed ? 'is-max' : ''}`}
      style={{ ['--v' as string]: (mood ? 70 : v) / 100 }}
      aria-labelledby="cm-title"
    >
      <div className="cm__inner">
        <div className="cm__copy">
          <p className="kicker" data-reveal="side">{t.meterKicker}</p>
          <h2 id="cm-title" className="display cm__title" data-reveal="mask">
            {maxed ? t.meterLevels[5] : t.meterTitle}
          </h2>

          <label className="cm__meter" data-reveal="up">
            <span className="cm__label">{t.meterLabel}</span>
            <span className="cm__track">
              <span className="cm__fill" />
              <span className="cm__ticks" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <i key={i} />
                ))}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={v}
                onChange={(e) => onInput(+e.target.value)}
                aria-valuetext={`${num(v)}% — ${t.meterLevels[level]}`}
              />
            </span>
            <span className="cm__level display" aria-live="polite" key={level}>
              {t.meterLevels[level]}
              <b className="price">{num(v)}%</b>
            </span>
          </label>

          <p className="cm__moodt">{t.moodTitle}</p>
          <div className="cm__moods" data-reveal="stagger">
            {t.moods.map((m) => (
              <button key={m.id} className={`cm__mood ${mood === m.id ? 'is-on' : ''}`} onClick={() => setMood(m.id)} aria-pressed={mood === m.id}>
                {m.q}
              </button>
            ))}
          </div>
        </div>

        <div className="cm__plate" data-reveal="pop">
          <div className="cm__glow" aria-hidden="true" />
          <img key={id} className="cm__img" src={p.img} alt={lang === 'ar' ? p.ar : p.en} loading="lazy" />
          <div className="cm__card">
            <span className="cm__pick">{t.meterPick}</span>
            <strong className="display">{lang === 'ar' ? p.ar : p.en}</strong>
            {(lang === 'ar' ? p.descAr : p.descEn) && <small>{lang === 'ar' ? p.descAr : p.descEn}</small>}
            <div className="cm__row">
              <b className="price cm__price">
                {num(p.price)} <small>{t.currency}</small>
              </b>
              <button
                ref={cta}
                className={`cta ${added ? 'cta--green' : ''}`}
                onClick={() => {
                  add(id)
                  setAdded(true)
                  setTimeout(() => setAdded(false), 1200)
                  if (maxed) setTimeout(() => setOpen(true), 350)
                }}
              >
                {added ? t.added : maxed ? t.orderNow : t.add}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
