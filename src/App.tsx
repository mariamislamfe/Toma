import { useEffect } from 'react'
import { I18nProvider, useI18n } from './lib/i18n'
import { OrderProvider } from './lib/order'
import { destroyScroll, initScroll, ScrollTrigger } from './lib/motion'
import { useReveal } from './lib/reveal'
import Marquee from './components/Marquee'
import Nav from './components/Nav'
import OrderTicket from './components/OrderTicket'
import Hero from './sections/Hero'
import SauceCrunch from './sections/SauceCrunch'
import MenuBoard from './sections/MenuBoard'
import CravingMeter from './sections/CravingMeter'
import Branches from './sections/Branches'
import AppPhone from './sections/AppPhone'
import Finale from './sections/Finale'
import SafeSection from './components/SafeSection'

function Page() {
  const { lang } = useI18n()
  useEffect(() => {
    initScroll()
    return destroyScroll
  }, [])
  useReveal(lang)
  // Layout changes with direction and font metrics; re-measure pins.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [lang])

  return (
    <>
      <a className="skip" href="#menu">
        {lang === 'ar' ? 'تخطّى للمنيو' : 'Skip to menu'}
      </a>
      <Nav />
      <main key={lang}>
        <SafeSection><Hero /></SafeSection>
        <Marquee />
        <SafeSection><SauceCrunch /></SafeSection>
        <SafeSection><MenuBoard /></SafeSection>
        <SafeSection><CravingMeter /></SafeSection>
        <Marquee tone="plum" reverse />
        <SafeSection><Branches /></SafeSection>
        <SafeSection><AppPhone /></SafeSection>
      </main>
      <SafeSection key={`f-${lang}`}><Finale /></SafeSection>
      <OrderTicket />
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
