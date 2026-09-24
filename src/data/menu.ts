// Source of truth: TOMA public API (app.tomaegypt.com/api/homeSlider, x-city: 1 / Cairo).
// Prices are EGP as listed for Cairo and may differ by branch — the UI says so.
// Images are background-removed copies of TOMA's own product photography (see /public/food).

export type CategoryId = 'koshary' | 'offers' | 'tagines' | 'sweets' | 'drinks' | 'extras'

export interface Product {
  id: number
  category: CategoryId
  ar: string
  en: string
  price: number
  img: string
  /** Contents, only where TOMA publishes them (offers). */
  descAr?: string
  descEn?: string
}

export interface Category {
  id: CategoryId
  ar: string
  en: string
}

export const categories: Category[] = [
  { id: 'koshary', ar: 'كشري', en: 'Koshary' },
  { id: 'offers', ar: 'عروض تومة', en: 'Toma Deals' },
  { id: 'tagines', ar: 'طواجن', en: 'Casseroles' },
  { id: 'sweets', ar: 'حلو', en: 'Dessert' },
  { id: 'drinks', ar: 'مشروبات', en: 'Drinks' },
  { id: 'extras', ar: 'مقبلات و إضافات', en: 'Sides & Extras' },
]

const f = (id: number) => `/food/p-${id}.webp`

export const products: Product[] = [
  { id: 2, category: 'koshary', ar: 'تومة', en: 'Toma', price: 25, img: f(2) },
  { id: 38, category: 'koshary', ar: 'تومة اسبيشال', en: 'Toma Special', price: 35, img: f(38) },
  { id: 3, category: 'koshary', ar: 'تومة بلاس', en: 'Toma Plus', price: 40, img: f(3) },
  { id: 4, category: 'koshary', ar: 'تومة تريبل', en: 'Toma Triple', price: 45, img: f(4) },
  { id: 5, category: 'koshary', ar: 'تومة كواترو', en: 'Toma Quattro', price: 60, img: f(5) },
  { id: 7, category: 'koshary', ar: 'تومة جراند', en: 'Toma Grand', price: 65, img: f(7) },
  { id: 55, category: 'koshary', ar: 'فتة كشري', en: 'Koshary Fatta', price: 55, img: f(55) },

  { id: 65, category: 'offers', ar: 'توفير 1', en: 'Tawfeer 1', price: 45, img: f(65), descAr: 'كشري بلاس + بيج كولا صغير', descEn: 'Koshary Plus + small Big Cola' },
  { id: 66, category: 'offers', ar: 'توفير 2', en: 'Tawfeer 2', price: 50, img: f(66), descAr: 'كشري بلاس + أرز باللبن', descEn: 'Koshary Plus + rice pudding' },
  { id: 67, category: 'offers', ar: 'دويتو', en: 'Duetto', price: 100, img: f(67), descAr: '2 كشري بلاس + 2 عيش تومة + 2 بيج كولا صغير', descEn: '2 Koshary Plus + 2 Toma bread + 2 small Big Cola' },
  { id: 68, category: 'offers', ar: 'دويتو بلاس', en: 'Duetto Plus', price: 115, img: f(68), descAr: '2 كشري بلاس + 2 عيش تومة + 2 أرز باللبن', descEn: '2 Koshary Plus + 2 Toma bread + 2 rice pudding' },

  { id: 8, category: 'tagines', ar: 'كازروله ميت', en: 'Meat Casserole', price: 55, img: f(8) },
  { id: 10, category: 'tagines', ar: 'كازروله تشيكن', en: 'Chicken Casserole', price: 60, img: f(10) },
  { id: 27, category: 'tagines', ar: 'كازروله سجق', en: 'Sausage Casserole', price: 55, img: f(27) },

  { id: 22, category: 'sweets', ar: 'رز بلبن', en: 'Rice Pudding', price: 20, img: f(22) },
  { id: 25, category: 'sweets', ar: 'كريم كراميل', en: 'Crème Caramel', price: 20, img: f(25) },

  { id: 12, category: 'drinks', ar: 'مياه معدنية صغيرة', en: 'Small Water', price: 8, img: f(12) },
  { id: 15, category: 'drinks', ar: 'سلاش', en: 'Slush', price: 20, img: f(15) },
  { id: 29, category: 'drinks', ar: 'V Cola', en: 'V Cola', price: 20, img: f(29) },
  { id: 59, category: 'drinks', ar: 'بيج كولا توما صغير', en: 'Small Big Cola', price: 10, img: f(59) },

  { id: 18, category: 'extras', ar: 'عيش تومة', en: 'Toma Bread', price: 10, img: f(18) },
  { id: 20, category: 'extras', ar: 'تقلية', en: 'Fried Onions', price: 10, img: f(20) },
  { id: 21, category: 'extras', ar: 'صلصة وسط', en: 'Tomato Sauce (M)', price: 10, img: f(21) },
  { id: 35, category: 'extras', ar: 'شطة ظرف تومة', en: 'Chili Oil Sachet', price: 2, img: f(35) },
  { id: 36, category: 'extras', ar: 'دقة ظرف تومة', en: 'Da’a Sachet', price: 2, img: f(36) },
  { id: 37, category: 'extras', ar: 'تومية', en: 'Toumeya', price: 3, img: '' },
  { id: 40, category: 'extras', ar: 'حمص', en: 'Chickpeas', price: 10, img: f(40) },
  { id: 41, category: 'extras', ar: 'عدس', en: 'Lentils', price: 10, img: '' },
  { id: 56, category: 'extras', ar: 'صلصة فتة وسط', en: 'Fatta Sauce (M)', price: 10, img: f(56) },
  { id: 58, category: 'extras', ar: 'دقة تومة', en: 'Toma Da’a', price: 7, img: f(58) },
]

export const byId = (id: number) => products.find((p) => p.id === id)!
export const inCategory = (c: CategoryId) => products.filter((p) => p.category === c)

/** Koshary ladder used by the craving meter — ordered by TOMA's own price/size. */
export const kosharyLadder = [2, 38, 3, 4, 5, 7]
