# TOMA — koshary web experience

Frontend-only concept redesign of [tomaegypt.com](https://tomaegypt.com/ar), Arabic-first (RTL) with an English toggle.
No backend: ordering hands off to TOMA's existing channels (hotline **19397** and the current web menu).

## Run

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build → dist/
npm run preview    # serve dist/ with the same security headers as production
npm run lint       # ESLint (typescript-eslint + react-hooks)
```

Deploy: Vercel picks up `vercel.json` (Vite preset, `dist/`, headers, caching). Any static host works if it serves the same headers.

## Stack

React 19 · TypeScript (strict) · Vite 7 · GSAP ScrollTrigger · Lenis (smooth wheel scroll, desktop only). No UI framework, no runtime API calls.

## Structure

```
src/
  App.tsx              page composition; each chapter wrapped in SafeSection (error boundary)
  data/menu.ts         products, categories, prices, image helpers   ← source of truth
  data/brand.ts        hotline, HQ, e-mail, cities/branches, app links ← source of truth
  lib/i18n.tsx         AR/EN copy + language context (?lang=en|ar, remembered in localStorage)
  lib/order.tsx        client-side order list (in memory only)
  lib/motion.ts        GSAP/Lenis setup, scroll cache, device tier (isLite), scroll lock
  lib/reveal.ts        declarative scroll reveals: data-reveal="up|pop|mask|tilt|side|stagger", data-parallax
  components/          Nav, OrderTicket (dialog), Marquee, SafeSection
  sections/            Hero, SauceCrunch, MenuBoard, CravingMeter, Branches, AppPhone, Finale (+ CSS each)
public/
  food/                product photos (background removed, WebP, 900px + 480px "-sm")
  brand/               logo + store badges from tomaegypt.com
  fonts/               self-hosted Cairo, Lalezar, Aref Ruqaa (Arabic + Latin subsets, OFL)
```

## Data

Menu, prices, cities and branch coordinates were taken from TOMA's public app API
(`app.tomaegypt.com/api/homeSlider`, `/cityBranches`, city 1 = Cairo). Prices are Cairo's and the UI says they
may vary by branch. To update, edit `src/data/*.ts` — nothing else holds content.

To confirm with TOMA: the e-mail on their site is `info@tromo.com` (looks like a typo); the App Store /
Google Play badges on their site have no links — set them in `APP_LINKS` and the badges become links.

## Security

- Static site, no user data leaves the browser, no cookies, no forms, no `dangerouslySetInnerHTML`, no `eval`.
- Headers (`vercel.json`): strict CSP (`script-src 'self'`, no third-party origins at all), `frame-ancestors 'none'` /
  `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP. `style-src` allows inline styles
  because GSAP/React animate via style attributes.
- External links use `rel="noopener noreferrer"`. `localStorage` values and URL params are validated before use.
- `npm audit`: 0 vulnerabilities.

## Performance

- Animations use transform/opacity only; scroll-linked work is compositor-friendly (flood sheets slide, never repaint).
- Looping CSS animations pause while their section is off screen; rAF loops stop when not visible.
- Touch devices keep native momentum scroll; the marquee runs as a pure CSS animation there.
- Weaker devices (≤4 cores or ≤3 GB) get lighter particle counts and no parallax (`isLite`).
- Responsive images (`srcset`), lazy loading below the fold, preloaded hero image and fonts.

## Accessibility

axe-core: 0 violations (AR/EN, desktop/mobile). Keyboard-operable throughout, visible focus, skip link,
modal order dialog with focus trap + Esc + focus return + scroll lock, `lang`/`dir` switch with the language.

Animations always run, regardless of the OS "reduce motion" setting — a deliberate product decision for this concept.
