// scripts/generate-icons.mjs
// Generates PWA icons (192x192 and 512x512) from an inline SVG using sharp.
// Run with: node scripts/generate-icons.mjs

import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')

await mkdir(outDir, { recursive: true })

function makeSvg(size) {
  const padding = Math.round(size * 0.15)
  const strokeWidth = Math.round(size * 0.115)
  const cx = size / 2
  const cy = size / 2
  const r = Math.round(size * 0.35)

  // Companion C letterform — matches Logo.tsx
  const startAngle = -45  // degrees (top-right open)
  const endAngle  = 45    // degrees (bottom-right open)
  const toRad = (d) => (d * Math.PI) / 180

  // Arc path: large arc from top-right gap to bottom-right gap
  const x1 = cx + r * Math.cos(toRad(startAngle))
  const y1 = cy + r * Math.sin(toRad(startAngle))
  const x2 = cx + r * Math.cos(toRad(endAngle))
  const y2 = cy + r * Math.sin(toRad(endAngle))

  // Diamond sparkles (scaled from viewBox 48)
  const scale = size / 48
  const s = (v) => Math.round(v * scale * 10) / 10

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#2E1A47"/>

  <!-- C arc -->
  <path
    d="M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}"
    stroke="white"
    stroke-width="${strokeWidth}"
    stroke-linecap="round"
    fill="none"
  />

  <!-- Diamond sparkle — lavender -->
  <path d="M ${s(30)} ${s(20)} L ${s(32)} ${s(24)} L ${s(30)} ${s(28)} L ${s(28)} ${s(24)} Z" fill="#B9A7E6"/>

  <!-- Diamond sparkle — pink -->
  <path d="M ${s(33.5)} ${s(17)} L ${s(35.5)} ${s(21.5)} L ${s(33.5)} ${s(26)} L ${s(31.5)} ${s(21.5)} Z" fill="#FF6F9F" opacity="0.9"/>

  <!-- Dot -->
  <circle cx="${s(29.5)}" cy="${s(24)}" r="${s(1.4)}" fill="#FF6F9F"/>
</svg>`.trim()
}

const sizes = [192, 512]

for (const size of sizes) {
  const svg = makeSvg(size)
  const outPath = join(outDir, `icon-${size}.png`)

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outPath)

  console.log(`✓ Generated ${outPath}`)
}

console.log('PWA icons generated successfully.')
