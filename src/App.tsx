import { useEffect } from 'react'
import { I18nProvider, useI18n } from './lib/i18n'
import { OrderProvider } from './lib/order'
import { destroyScroll, initScroll, ScrollTrigger, useReducedMotion } from './lib/motion'
import { useReveal } from './lib/reveal'
import Marquee from './components/Marquee'
import MotionPrompt from './components/MotionPrompt'
import Nav from './components/Nav'
import OrderTicket from './components/OrderTicket'
import Hero from './sections/Hero'
import SauceCrunch from './sections/SauceCrunch'
import MenuBoard from './sections/MenuBoard'
import CravingMeter from './sections/CravingMeter'
import Branches from './sections/Branches'
import AppPhone from './sections/AppPhone'
import Finale from './sections/Finale'

function Page() {
  const { lang } = useI18n()
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    initScroll()
    return destroyScroll
  }, [reduced])
  useReveal(`${lang}-${reduced}`)
  // Layout changes with direction and font metrics; re-measure pins.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang, reduced])

  return (
    <>
      <a className="skip" href="#menu">
        {lang === 'ar' ? 'تخطّى للمنيو' : 'Skip to menu'}
      </a>
      <Nav />
      <main key={`${lang}-${reduced}`}>
        <Hero />
        <Marquee />
        <SauceCrunch />
        <MenuBoard />
        <CravingMeter />
        <Marquee tone="plum" reverse />
        <Branches />
        <AppPhone />
        <Finale />
      </main>
      <OrderTicket />
      <MotionPrompt />
    </>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <OrderProvider>
        <Page />
      </OrderProvider>
    </I18nProvider>
  )
}
