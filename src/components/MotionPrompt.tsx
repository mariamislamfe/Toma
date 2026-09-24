import { useState } from 'react'
import { useI18n } from '../lib/i18n'
import { getMotionPref, osPrefersReduced, setMotionPref, useReducedMotion } from '../lib/motion'
import './motion-prompt.css'

/**
 * When the OS asks for reduced motion the site is fully still. Say so once, and let the
 * visitor opt in — the choice is remembered and can be undone from the nav.
 */
export default function MotionPrompt() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const [closed, setClosed] = useState(false)
  if (closed || !reduced || getMotionPref() !== 'auto' || !osPrefersReduced()) return null
  return (
    <div className="mp" role="status">
      <span>{t.motionOff}</span>
      <button className="mp__on" onClick={() => setMotionPref('on')}>
        {t.motionOn}
      </button>
      <button className="mp__x" onClick={() => setClosed(true)} aria-label={t.close}>
        ×
      </button>
    </div>
  )
}
