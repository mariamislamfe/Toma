import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vercel from './vercel.json'

// `vite preview` serves the same security headers as production (vercel.json), so CSP issues show up locally.
// upgrade-insecure-requests is dropped here only because preview runs on plain http://localhost.
const prodHeaders = vercel.headers.find((h) => h.source === '/(.*)')!.headers
const previewHeaders = Object.fromEntries(
  prodHeaders.map(({ key, value }) => [key, value.replace(/;\s*upgrade-insecure-requests/, '')]),
)

export default defineConfig({
  plugins: [react()],
  preview: { headers: previewHeaders },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: { manualChunks: { gsap: ['gsap', 'gsap/ScrollTrigger', 'lenis'] } },
    },
  },
})
