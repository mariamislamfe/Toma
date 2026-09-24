import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'ar' | 'en'

const copy = {
  ar: {
    navMenu: 'المنيو',
    navBranches: 'الفروع',
    navApp: 'التطبيق',
    navOrder: 'اطلب',
    langSwitch: 'EN',
    langSwitchLabel: 'Switch to English',

    heroKicker: 'تومة · كشري مصري',
    heroTitle: ['الطبق ده', 'مستنيك.'],
    heroLead: 'سخن، مليان، وعليه صلصة ودقة وبصل محمّر بيقرمش. خلاص، مفيش داعي تفكر كتير.',
    heroFacts: (cities: string, branches: string, from: string) => [`${cities} مدن`, `${branches} فروع`, `يبدأ من ${from} ج.م`],
    heroMenuLink: 'شوف المنيو',
    heroScroll: 'انزل تحت',
    heroWord: 'كشري',
    receiptTitle: 'طبق تومة',
    receiptNo: 'طلب',
    receiptItems: ['رز', 'عدس', 'مكرونة', 'حمص', 'صلصة', 'دقة', 'بصل محمّر'],
    receiptTotal: 'الحساب',
    receiptThanks: 'بالهنا والشفا',
    motionOff: 'الحركة متوقفة على جهازك',
    motionOn: 'شغّل الحركة',
    motionToggle: 'الحركة',

    sauceKicker: 'السر في',
    sauceWord: 'الصلصة',
    sauceLine: 'حمرا، سخنة، ومش بتخلص. عايز زيادة؟ عندنا.',
    daaWord: 'والدقة',
    daaLine: 'خل وتوم. الحتة اللي بتفوقك.',
    crunchWord: 'قرمش',
    crunchLine: 'البصل المحمّر. من غيره الكشري مش كشري.',
    addExtra: 'زوّدها',

    menuKicker: 'المنيو',
    menuTitle: 'اختار طبقك',
    menuNote: 'الأسعار حسب منيو القاهرة وممكن تختلف من فرع لفرع.',
    add: 'ضيفه للأوردر',
    added: 'اتضاف ✓',
    currency: 'ج.م',
    swipeHint: 'اسحب يمين وشمال',

    meterKicker: 'مقياس الجوع',
    meterTitle: 'جعان قد إيه؟',
    meterLabel: 'حرّك وقول الحقيقة',
    meterLevels: ['جعان شوية', 'جعان', 'جعان أوي', 'هموت من الجوع', 'هاكل أي حاجة', 'خلاص. اطلب.'],
    meterPick: 'ده طبقك',
    moodTitle: 'ولا اختار على مزاجك',
    moods: [
      { q: 'عايز كشري على أصوله؟', id: 2 },
      { q: 'عايز حاجة تشبعك؟', id: 7 },
      { q: 'عايز تزودها؟', id: 55 },
      { q: 'جايب حد معاك؟', id: 67 },
    ],

    ticket: 'الأوردر',
    ticketEmpty: 'لسه مفيش حاجة. ضيف طبق من المنيو.',
    ticketTotal: 'الإجمالي التقريبي',
    ticketNo: 'رقم',
    ticketCall: 'اطلب على',
    ticketWeb: 'كمّل على موقع تومة',
    ticketHint: 'قول الطلب ده للكول سنتر أو كمّله أونلاين.',
    ticketClear: 'امسح',
    close: 'اقفل',

    branchesKicker: 'فروعنا',
    branchesTitle: 'فين أقرب تومة؟',
    branchCount: (n: number) => (n === 1 ? 'فرع واحد' : n === 2 ? 'فرعين' : `${n} فروع`),
    openMap: 'افتح الخريطة',

    appKicker: 'التطبيق',
    appTitle: 'نزّل التطبيق دلوقتي',
    appLine: 'وخلي الكشري أقرب ليك من أي وقت',
    appFrom: 'نزّل التطبيق من على:',

    finalAsk: 'طب هتطلب إيه؟',
    finalCta: 'اطلب دلوقتي',
    finalOr: 'أو اتصل',

    footContact: 'تواصل معنا',
    footHQ: 'المقر الرئيسي',
    footEmail: 'البريد الإلكتروني',
    footHotline: 'الخط الساخن',
    footPrivacy: 'سياسة الخصوصية',
    footTerms: 'الشروط والأحكام',
    footRights: '© 2025 تومة مصر. جميع الحقوق محفوظة.',
    orderNow: 'اطلب دلوقتي',
    skip: 'تخطّى للمحتوى',
  },
  en: {
    navMenu: 'Menu',
    navBranches: 'Branches',
    navApp: 'App',
    navOrder: 'Order',
    langSwitch: 'ع',
    langSwitchLabel: 'التبديل للعربي',

    heroKicker: 'TOMA · Egyptian koshary',
    heroTitle: ['This bowl', 'is waiting.'],
    heroLead: 'Hot, loaded, and finished with sauce, da’a and crispy onions. Honestly, there’s nothing left to think about.',
    heroFacts: (cities: string, branches: string, from: string) => [`${cities} cities`, `${branches} branches`, `From ${from} EGP`],
    heroMenuLink: 'See the menu',
    heroScroll: 'Scroll down',
    heroWord: 'KOSHARY',
    receiptTitle: 'The Toma bowl',
    receiptNo: 'Order',
    receiptItems: ['Rice', 'Lentils', 'Pasta', 'Chickpeas', 'Sauce', 'Da’a', 'Crispy onions'],
    receiptTotal: 'Total',
    receiptThanks: 'Enjoy your meal',
    motionOff: 'Motion is off on your device',
    motionOn: 'Turn motion on',
    motionToggle: 'Motion',

    sauceKicker: 'The secret is the',
    sauceWord: 'Sauce',
    sauceLine: 'Red, hot, and never enough. Want extra? We’ve got it.',
    daaWord: '& the Da’a',
    daaLine: 'Vinegar and garlic. The part that wakes you up.',
    crunchWord: 'Crunch',
    crunchLine: 'Crispy onions. Without them, it isn’t koshary.',
    addExtra: 'Add it',

    menuKicker: 'The menu',
    menuTitle: 'Pick your plate',
    menuNote: 'Prices from the Cairo menu and may vary by branch.',
    add: 'Add to order',
    added: 'Added ✓',
    currency: 'EGP',
    swipeHint: 'Swipe left & right',

    meterKicker: 'Hunger meter',
    meterTitle: 'How hungry are you?',
    meterLabel: 'Slide. Be honest.',
    meterLevels: ['A bit hungry', 'Hungry', 'Very hungry', 'Starving', 'I’d eat anything', 'That’s it. Order.'],
    meterPick: 'Your plate',
    moodTitle: 'Or pick by mood',
    moods: [
      { q: 'The classic?', id: 2 },
      { q: 'Something filling?', id: 7 },
      { q: 'Go all in?', id: 55 },
      { q: 'Bringing a friend?', id: 67 },
    ],

    ticket: 'Your order',
    ticketEmpty: 'Nothing yet. Add a plate from the menu.',
    ticketTotal: 'Estimated total',
    ticketNo: 'No.',
    ticketCall: 'Order on',
    ticketWeb: 'Continue on tomaegypt.com',
    ticketHint: 'Read this to the call center, or finish online.',
    ticketClear: 'Clear',
    close: 'Close',

    branchesKicker: 'Our branches',
    branchesTitle: 'Find your Toma',
    branchCount: (n: number) => `${n} branch${n === 1 ? '' : 'es'}`,
    openMap: 'Open map',

    appKicker: 'The app',
    appTitle: 'Download the app now.',
    appLine: 'And let koshary be closer to you than ever before.',
    appFrom: 'Download the app from:',

    finalAsk: 'So… what are you ordering?',
    finalCta: 'Order now',
    finalOr: 'or call',

    footContact: 'Contact us',
    footHQ: 'Headquarters',
    footEmail: 'Email',
    footHotline: 'Hotline',
    footPrivacy: 'Privacy Policy',
    footTerms: 'Terms and Conditions',
    footRights: '© 2025 Toma Egypt. All rights reserved.',
    orderNow: 'Order now',
    skip: 'Skip to content',
  },
}

export type Copy = (typeof copy)['ar']

interface Ctx {
  lang: Lang
  t: Copy
  setLang: (l: Lang) => void
  num: (n: number | string) => string
}

const I18n = createContext<Ctx | null>(null)

const arDigits = (s: string) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d])

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const q = new URLSearchParams(location.search).get('lang')
      if (q === 'en' || q === 'ar') return q
      return (localStorage.getItem('toma-lang') as Lang) || 'ar'
    } catch {
      return 'ar'
    }
  })

  useEffect(() => {
    const el = document.documentElement
    el.lang = lang
    el.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = lang === 'ar' ? 'تومة — كشري' : 'TOMA — Koshary'
    try {
      localStorage.setItem('toma-lang', lang)
    } catch {
      /* private mode */
    }
  }, [lang])

  const value = useMemo<Ctx>(
    () => ({
      lang,
      t: copy[lang] as Copy,
      setLang,
      num: (n) => (lang === 'ar' ? arDigits(String(n)) : String(n)),
    }),
    [lang],
  )
  return <I18n.Provider value={value}>{children}</I18n.Provider>
}

export function useI18n() {
  const c = useContext(I18n)
  if (!c) throw new Error('useI18n outside provider')
  return c
}
