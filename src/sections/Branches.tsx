import { useMemo, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { cities, mapsUrl } from '../data/brand'
import './branches.css'

// Schematic projection of the Nile Delta. Branch pins use TOMA's real coordinates.
const B = { w: 30.25, e: 31.95, n: 31.6, s: 29.9 }
const VW = 1000
const VH = 1000
const X = (lng: number) => ((lng - B.w) / (B.e - B.w)) * VW
const Y = (lat: number) => ((B.n - lat) / (B.n - B.s)) * VH
const line = (pts: [number, number][]) =>
  pts.map(([lat, lng], i) => `${i ? 'L' : 'M'}${X(lng).toFixed(1)},${Y(lat).toFixed(1)}`).join(' ')

const NILE = line([[29.9, 31.26], [30.05, 31.23], [30.19, 31.13]])
const ROSETTA = line([[30.19, 31.13], [30.4, 30.98], [30.62, 30.9], [30.83, 30.81], [31.05, 30.6], [31.25, 30.48], [31.42, 30.4]])
const DAMIETTA = line([[30.19, 31.13], [30.46, 31.18], [30.71, 31.24], [30.96, 31.23], [31.04, 31.38], [31.2, 31.55], [31.33, 31.72], [31.45, 31.82]])
const COAST = line([[31.35, 30.25], [31.47, 30.38], [31.55, 30.7], [31.58, 31.05], [31.56, 31.4], [31.48, 31.75], [31.4, 31.95]])

export default function Branches() {
  const { t, lang, num } = useI18n()
  const [cid, setCid] = useState(1)
  const city = cities.find((c) => c.id === cid)!
  const hq = cities[0].branches[0]

  const c = useMemo(() => {
    const n = city.branches.length
    const lat = city.branches.reduce((s, b) => s + b.lat, 0) / n
    const lng = city.branches.reduce((s, b) => s + b.lng, 0) / n
    return { x: X(lng), y: Y(lat) }
  }, [city])

  // Gentle zoom toward the selected city
  const z = 1.12
  const tx = VW / 2 - c.x * z
  const ty = VH / 2 - c.y * z

  const route = `M${X(hq.lng)},${Y(hq.lat)} Q${(X(hq.lng) + c.x) / 2 + 120},${(Y(hq.lat) + c.y) / 2} ${c.x},${c.y}`

  return (
    <section id="branches" className="br" aria-labelledby="br-title">
      <div className="br__bgword display" aria-hidden="true" data-parallax="0.25">
        <span key={cid}>{lang === 'ar' ? city.ar : city.en}</span>
      </div>
      <div className="br__inner">
        <div className="br__copy">
          <p className="kicker" data-reveal="side">{t.branchesKicker}</p>
          <h2 id="br-title" className="display br__title" data-reveal="mask">
            {t.branchesTitle}
          </h2>
          <div className="br__cities" data-reveal="stagger" role="group" aria-label={t.branchesKicker}>
            {cities.map((x) => (
              <button
                key={x.id}
                aria-pressed={x.id === cid}
                className={`br__city ${x.id === cid ? 'is-on' : ''}`}
                onClick={() => setCid(x.id)}
              >
                <span className="display">{lang === 'ar' ? x.ar : x.en}</span>
                <small>{t.branchCount(x.branches.length).replace(/\d+/, (d) => num(d))}</small>
              </button>
            ))}
          </div>
          <ul className="br__list" key={cid} aria-live="polite">
            {city.branches.map((b, i) => (
              <li key={b.id} style={{ animationDelay: `${i * 80}ms` }}>
                <span className="br__pin" aria-hidden="true" />
                <strong>{lang === 'ar' ? b.ar : b.en}</strong>
                <a href={mapsUrl(b)} target="_blank" rel="noopener noreferrer" className="br__map">
                  {t.openMap} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="br__mapwrap" aria-hidden="true" data-reveal="pop">
          <svg viewBox={`0 0 ${VW} ${VH}`} className="br__svg">
            <g className="br__zoom" style={{ transform: `translate(${tx}px, ${ty}px) scale(${z})` }}>
              <path d={COAST} className="br__coast" />
              <path d={NILE} className="br__nile" />
              <path d={ROSETTA} className="br__nile" />
              <path d={DAMIETTA} className="br__nile" />
              {cid !== 1 && <path key={`r${cid}`} d={route} className="br__route" pathLength={1} />}
              {cities.map((x) =>
                x.branches.map((b) => (
                  <g
                    key={b.id}
                    className={`br__dot ${x.id === cid ? 'is-on' : ''}`}
                    transform={`translate(${X(b.lng)},${Y(b.lat)})`}
                  >
                    <circle r={x.id === cid ? 16 : 9} className="br__halo" />
                    <circle r={x.id === cid ? 7 : 5} />
                  </g>
                )),
              )}
              {cities.map((x) => {
                const lat = x.branches[0].lat
                const lng = x.branches[0].lng
                return (
                  <text
                    key={x.id}
                    x={X(lng) + 22}
                    y={Y(lat) + 6}
                    className={`br__label ${x.id === cid ? 'is-on' : ''}`}
                    textAnchor="start"
                  >
                    {lang === 'ar' ? x.ar : x.en}
                  </text>
                )
              })}
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
