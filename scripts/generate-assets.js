/**
 * Renders the Guter GeDANKE brand mark into all app image assets
 * (icon, splash, Android adaptive icons, favicon) using @resvg/resvg-js.
 *
 * Run: node scripts/generate-assets.js
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'images');

const SAGE = '#A8B8A1';
const SAGE_DEEP = '#8CA083';
const LAVENDER = '#CFC4E6';
const LAVENDER_DEEP = '#A99BC9';
const CREAM = '#FAF8F3';
const GOLD = '#D8C38A';

/** The logo mark on a 120×120 canvas (mirrors src/components/Logo.tsx). */
function mark({ monochrome = null } = {}) {
  const c = (color) => (monochrome ? monochrome : color);
  const phoneFill = monochrome ? 'none' : '#FFFFFF';
  return `
    <rect x="34" y="20" width="52" height="86" rx="13" fill="${phoneFill}" stroke="${c(SAGE_DEEP)}" stroke-width="4"/>
    <line x1="52" y1="30" x2="68" y2="30" stroke="${c(SAGE_DEEP)}" stroke-width="3.5" stroke-linecap="round" opacity="0.55"/>
    <line x1="52" y1="97" x2="68" y2="97" stroke="${c(SAGE_DEEP)}" stroke-width="3.5" stroke-linecap="round" opacity="0.55"/>
    <path d="M46 44 h28 a9 9 0 0 1 9 9 v10 a9 9 0 0 1 -9 9 h-15 l-8 8 v-8 h-5 a9 9 0 0 1 -9 -9 v-10 a9 9 0 0 1 9 -9 z" fill="${c(LAVENDER)}"/>
    <path d="M60 66 c-1.2 -1.1 -7 -4.6 -7 -9 a4.1 4.1 0 0 1 7 -2.9 a4.1 4.1 0 0 1 7 2.9 c0 4.4 -5.8 7.9 -7 9 z" fill="${monochrome ? 'none' : GOLD}" stroke="${monochrome ? monochrome : 'none'}" stroke-width="${monochrome ? 2 : 0}"/>
    <path d="M86 62 C 98 54, 102 42, 100 28" stroke="${c(SAGE)}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M99 41 C 106 39, 110 33, 110 26 C 103 28, 99 34, 99 41 z" fill="${c(SAGE)}"/>
    <path d="M96 52 C 90 48, 88 42, 89 36 C 95 39, 97 46, 96 52 z" fill="${c(SAGE)}"/>
    <path d="M100 28 C 104 24, 105 19, 104 14 C 99 17, 98 23, 100 28 z" fill="${c(SAGE_DEEP)}"/>
    <path d="M34 84 C 26 82, 21 76, 20 68" stroke="${c(SAGE)}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M22 74 C 16 73, 12 69, 11 63 C 17 64, 21 68, 22 74 z" fill="${c(SAGE)}"/>
    <path d="M20 68 C 21 62, 19 57, 15 53 C 13 59, 15 65, 20 68 z" fill="${c(SAGE_DEEP)}"/>
    <circle cx="30" cy="38" r="2.4" fill="${c(GOLD)}" opacity="0.9"/>
    <circle cx="24" cy="47" r="1.7" fill="${c(LAVENDER_DEEP)}" opacity="0.8"/>
    <circle cx="92" cy="90" r="2.2" fill="${c(LAVENDER_DEEP)}" opacity="0.8"/>
  `;
}

/** Wrap the mark, scaled into a square canvas. scale < 1 shrinks toward center. */
function svgCanvas(size, { background = null, scale = 1, monochrome = null, wash = false } = {}) {
  const s = (size / 120) * scale;
  const offset = (size - 120 * s) / 2;
  const washSvg = wash
    ? `
      <radialGradient id="wl" cx="20%" cy="15%" r="60%">
        <stop offset="0%" stop-color="${LAVENDER}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${LAVENDER}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="ws" cx="85%" cy="45%" r="60%">
        <stop offset="0%" stop-color="${SAGE}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${SAGE}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="wg" cx="25%" cy="90%" r="60%">
        <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
      </radialGradient>
    `
    : '';
  const washRects = wash
    ? `<rect width="${size}" height="${size}" fill="url(#wl)"/>
       <rect width="${size}" height="${size}" fill="url(#ws)"/>
       <rect width="${size}" height="${size}" fill="url(#wg)"/>`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>${washSvg}</defs>
  ${background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : ''}
  ${washRects}
  <g transform="translate(${offset} ${offset}) scale(${s})">${mark({ monochrome })}</g>
</svg>`;
}

function render(svg, size, file, { flatten = false } = {}) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  let png = resvg.render().asPng();
  if (flatten) {
    // App Store Connect rejects app icons with an alpha channel —
    // re-encode as opaque RGB (the icon has a full-bleed background).
    const { PNG } = require('pngjs');
    const decoded = PNG.sync.read(png);
    png = PNG.sync.write(decoded, { colorType: 2 });
  }
  fs.writeFileSync(path.join(OUT, file), png);
  console.log(`✓ ${file} (${size}×${size}${flatten ? ', no alpha' : ''})`);
}

fs.mkdirSync(OUT, { recursive: true });

// App icon: full-bleed warm cream with a soft watercolor wash.
render(svgCanvas(1024, { background: CREAM, wash: true, scale: 0.78 }), 1024, 'icon.png', {
  flatten: true,
});

// Splash logo: transparent, generous padding around the mark.
render(svgCanvas(512, { scale: 0.94 }), 512, 'splash-icon.png');

// Android adaptive foreground: mark inside the ~66% safe zone.
render(svgCanvas(1024, { scale: 0.52 }), 1024, 'android-icon-foreground.png');

// Android monochrome (themed icons): single-color silhouette.
render(svgCanvas(1024, { scale: 0.52, monochrome: '#FFFFFF' }), 1024, 'android-icon-monochrome.png');

// Android notification icon: white silhouette on transparency.
render(svgCanvas(96, { scale: 0.95, monochrome: '#FFFFFF' }), 96, 'notification-icon.png');

// Web favicon.
render(svgCanvas(96, { background: CREAM, scale: 0.9 }), 96, 'favicon.png');

console.log('All brand assets generated.');
