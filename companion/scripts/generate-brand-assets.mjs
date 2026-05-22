/**
 * Generates static brand assets:
 *   public/favicon.ico   — 32×32 ICO wrapping a PNG
 *   app/favicon.ico      — same file (App Router static favicon)
 *   public/og-image.png  — 1200×630 social share card
 *
 * Run with:  node scripts/generate-brand-assets.mjs
 */

import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ---------------------------------------------------------------------------
// SVG sources
// ---------------------------------------------------------------------------

const PLUM_DARK = "#2E1A47";
const PLUM = "#4B2E83";
const LAVENDER = "#7E64B5";
const ACCENT = "#FF6F9F";
const WHITE = "#FFFFFF";

/** 32×32 favicon — the C mark with sparkles */
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${PLUM_DARK}"/>
  <!-- C arc -->
  <path d="M24 10.5C22.1 7 18.7 5 15 5C9.5 5 5 9.5 5 15C5 20.5 9.5 25 15 25C18.7 25 22.1 23 24 19.5"
        stroke="${WHITE}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
  <!-- Sparkle plum -->
  <path d="M20 13L21.3 15.5L20 18L18.7 15.5Z" fill="${LAVENDER}"/>
  <!-- Sparkle pink -->
  <path d="M22 11L23.3 14L22 17L20.7 14Z" fill="${ACCENT}" opacity="0.95"/>
  <!-- Dot -->
  <circle cx="19.8" cy="15.5" r="1" fill="${ACCENT}"/>
</svg>`.trim();

/** 1200×630 Open Graph card */
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Background -->
  <defs>
    <radialGradient id="a" cx="15%" cy="10%" r="50%">
      <stop offset="0%" stop-color="#4B2E83" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${PLUM_DARK}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b" cx="90%" cy="0%" r="45%">
      <stop offset="0%" stop-color="#7E64B5" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${PLUM_DARK}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${PLUM_DARK}"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>

  <!-- Decorative arc top-left -->
  <circle cx="0" cy="0" r="280" fill="none" stroke="#7E64B5" stroke-width="1" opacity="0.18"/>
  <circle cx="0" cy="0" r="420" fill="none" stroke="#7E64B5" stroke-width="1" opacity="0.10"/>

  <!-- Logo mark — centred slightly above mid -->
  <g transform="translate(600,220)">
    <!-- C arc -->
    <path d="M55 -38C39 -58 15 -68 -10 -68C-52 -68 -86 -34 -86 8C-86 50 -52 84 -10 84C15 84 39 74 55 54"
          stroke="${WHITE}" stroke-width="14" stroke-linecap="round" fill="none"/>
    <!-- Sparkle plum -->
    <path d="M36 -12L44 8L36 28L28 8Z" fill="${LAVENDER}"/>
    <!-- Sparkle pink -->
    <path d="M52 -30L60 -6L52 18L44 -6Z" fill="${ACCENT}" opacity="0.95"/>
    <!-- Dot -->
    <circle cx="35" cy="8" r="5" fill="${ACCENT}"/>
  </g>

  <!-- Wordmark: Companion -->
  <text x="600" y="350"
        font-family="Georgia, serif" font-size="72" font-weight="bold"
        fill="${WHITE}" text-anchor="middle" letter-spacing="-2">Companion</text>

  <!-- by Danè (italic, pink) -->
  <text x="600" y="405"
        font-family="Georgia, serif" font-size="36" font-style="italic"
        fill="${ACCENT}" text-anchor="middle">by Danè</text>

  <!-- Divider line -->
  <line x1="460" y1="435" x2="740" y2="435" stroke="${LAVENDER}" stroke-width="1" opacity="0.5"/>

  <!-- Tagline -->
  <text x="600" y="476"
        font-family="Georgia, serif" font-size="26"
        fill="${WHITE}" text-anchor="middle" opacity="0.72"
        letter-spacing="0.5">Human-led coaching. AI-supported growth.</text>

  <!-- Bottom label -->
  <text x="600" y="570"
        font-family="Georgia, serif" font-size="18" letter-spacing="3"
        fill="${ACCENT}" text-anchor="middle" opacity="0.6">AI COACHING COMPANION</text>
</svg>`.trim();

// ---------------------------------------------------------------------------
// ICO builder — wraps a single PNG blob in the ICO container format
// ---------------------------------------------------------------------------
function buildIco(pngBuffer) {
  const HEADER_SIZE = 6;
  const DIR_ENTRY_SIZE = 16;
  const imageOffset = HEADER_SIZE + DIR_ENTRY_SIZE;

  const header = Buffer.alloc(HEADER_SIZE);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ICO
  header.writeUInt16LE(1, 4); // image count

  const dir = Buffer.alloc(DIR_ENTRY_SIZE);
  dir.writeUInt8(32, 0);  // width  (0 = 256; 32 is literal)
  dir.writeUInt8(32, 1);  // height
  dir.writeUInt8(0, 2);   // colour count
  dir.writeUInt8(0, 3);   // reserved
  dir.writeUInt16LE(1, 4); // colour planes
  dir.writeUInt16LE(32, 6); // bits per pixel
  dir.writeUInt32LE(pngBuffer.length, 8); // size of image data
  dir.writeUInt32LE(imageOffset, 12);     // offset to image data

  return Buffer.concat([header, dir, pngBuffer]);
}

// ---------------------------------------------------------------------------
// Render & save
// ---------------------------------------------------------------------------
function renderPng(svgString, widthPx) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: "width", value: widthPx },
    font: { loadSystemFonts: false },
  });
  return resvg.render().asPng();
}

console.log("⏳  Generating brand assets…");

const faviconPng = renderPng(faviconSvg, 32);
const ico = buildIco(faviconPng);

// Write favicon.ico to both locations
writeFileSync(join(root, "public", "favicon.ico"), ico);
mkdirSync(join(root, "app"), { recursive: true });
writeFileSync(join(root, "app", "favicon.ico"), ico);
console.log("✓   public/favicon.ico  +  app/favicon.ico");

// OG image PNG
const ogPng = renderPng(ogSvg, 1200);
writeFileSync(join(root, "public", "og-image.png"), ogPng);
console.log("✓   public/og-image.png  (1200×630)");

console.log("\n✅  Done.");
