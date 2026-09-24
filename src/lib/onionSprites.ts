/** Procedural crispy-onion strands — used for the crunch chapter's onion rain. */

const TAU = Math.PI * 2

export function sprite(w: number, h: number, u: number, paint: (c: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  const cv = document.createElement('canvas')
  cv.width = Math.max(2, Math.ceil(w * u))
  cv.height = Math.max(2, Math.ceil(h * u))
  const c = cv.getContext('2d')!
  c.translate(cv.width / 2, cv.height / 2)
  c.scale(u, u)
  paint(c)
  return cv
}

export function onion(u: number, k: number) {
  // a fried onion strand: thick, curled, irregular, dark at the edges, golden where it caught the oil
  return sprite(24, 24, u, (c) => {
    const len = 7 + k * 6
    const bend = (k - 0.5) * 2.4 + 0.8
    c.rotate(k * TAU)
    c.lineCap = 'round'
    const path = () => {
      c.beginPath()
      c.moveTo(-len / 2, 0)
      c.bezierCurveTo(-len / 4, -bend * 4, len / 4, bend * 3, len / 2, -bend * 2)
    }
    path()
    c.strokeStyle = '#260b02'
    c.lineWidth = 3.4
    c.stroke()
    const g = c.createLinearGradient(-len / 2, 0, len / 2, 0)
    g.addColorStop(0, '#5a1f05')
    g.addColorStop(0.35, '#a4501a')
    g.addColorStop(0.55, '#d8893a')
    g.addColorStop(0.75, '#9a4814')
    g.addColorStop(1, '#4a1804')
    path()
    c.strokeStyle = g
    c.lineWidth = 2.3
    c.stroke()
    c.translate(-0.4, -0.5)
    path()
    c.strokeStyle = 'rgba(255,215,150,.45)'
    c.lineWidth = 0.6
    c.stroke()
  })
}

/** Crispy-onion sprites for other scenes (u = pixels per unit). */
export const onionSprites = (u: number, n = 8) => Array.from({ length: n }, (_, i) => onion(u, i / (n - 1)))
