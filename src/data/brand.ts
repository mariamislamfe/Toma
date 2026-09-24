// Facts as published on tomaegypt.com (footer / contact / cityBranches API).

export const HOTLINE = '19397'
export const EMAIL = 'info@tromo.com' // exactly as listed on tomaegypt.com — confirm with TOMA
export const HQ = {
  ar: '12 شارع طلعت حرب، وسط البلد، القاهرة',
  en: '12 Talaat Harb St, Downtown, Cairo',
}

/** Existing ordering channels only: the hotline and TOMA's current web menu/checkout. */
export const ORDER_WEB = (lang: 'ar' | 'en') => `https://tomaegypt.com/${lang}/products`
export const LEGAL = (lang: 'ar' | 'en') => ({
  privacy: `https://tomaegypt.com/${lang}/privacy-policy`,
  terms: `https://tomaegypt.com/${lang}/terms-and-conditions`,
})

/**
 * The current site shows App Store / Google Play badges without links.
 * Drop the real store URLs here and the badges become links automatically.
 */
export const APP_LINKS: { ios: string | null; android: string | null } = {
  ios: null,
  android: null,
}

export interface Branch {
  id: number
  ar: string
  en: string
  lat: number
  lng: number
}

export interface City {
  id: number
  ar: string
  en: string
  branches: Branch[]
}

export const cities: City[] = [
  { id: 1, ar: 'القاهرة', en: 'Cairo', branches: [
    { id: 27, ar: 'تومة القاهرة', en: 'Toma Cairo', lat: 30.0542818, lng: 31.2428224 },
  ] },
  { id: 2, ar: 'طنطا', en: 'Tanta', branches: [
    { id: 21, ar: 'تومة البحر', en: 'Toma Elbahr', lat: 30.799884184516, lng: 30.997061133385 },
    { id: 22, ar: 'تومة الحلو', en: 'Toma Elhelw', lat: 30.797884367441, lng: 31.004061698914 },
  ] },
  { id: 3, ar: 'المحلة', en: 'El Mahalla', branches: [
    { id: 23, ar: 'تومة المحلة 1', en: 'Toma Mahalla 1', lat: 30.975484200907, lng: 31.169720292091 },
    { id: 24, ar: 'تومة المحلة 2', en: 'Toma Mahalla 2', lat: 30.966243588231, lng: 31.164425611496 },
    { id: 25, ar: 'تومة المحلة 3', en: 'Toma Mahalla 3', lat: 30.979669549931, lng: 31.176291704178 },
  ] },
  { id: 4, ar: 'المنصورة', en: 'Mansoura', branches: [
    { id: 28, ar: 'تومة المنصورة 1', en: 'Toma Mansoura 1', lat: 31.0456701, lng: 31.3569381 },
    { id: 29, ar: 'تومة المنصورة 2', en: 'Toma Mansoura 2', lat: 31.04927, lng: 31.397008 },
  ] },
  { id: 5, ar: 'الزقازيق', en: 'Zagazig', branches: [
    { id: 26, ar: 'تومة الزقازيق', en: 'Toma Zagazig', lat: 30.589713457247, lng: 31.493087410927 },
  ] },
]

export const mapsUrl = (b: Branch) => `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`
