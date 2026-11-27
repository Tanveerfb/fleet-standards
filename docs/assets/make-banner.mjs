// Builds the v4 Satluj README banner (layout A, river bands, decisions.md 2026-11-18) with every
// text outlined to paths: GitHub shows an SVG as an image and loads no fonts.
//
// Not run by tests or CI. To rebuild, in a scratch folder outside the repository:
//   npm install opentype.js@1.3.4, copy this file in, and put static TTFs of Sora (300, 600,
//   700) and Noto Sans Gurmukhi (500) in a fonts folder, named as below (both SIL Open Font
//   License; Google Fonts' css2 API returns static TTF links to a plain user agent). Then:
//   node make-banner.mjs <fonts dir> <version, e.g. v4.1.0> > docs/assets/satluj-banner.svg
// The banner carries the exact version (the owner, 2026-11-27), so it is rebuilt at every
// release. A later river's banner changes the name, the Gurmukhi and which band is bright.
import opentype from "opentype.js";
import { join } from "node:path";

const dir = process.argv[2];
const version = process.argv[3];
if (!dir || !/^v\d+\.\d+\.\d+$/.test(version ?? "")) {
  console.error("usage: make-banner.mjs <fonts dir> <version, e.g. v4.1.0>");
  process.exit(2);
}
const load = (f) => opentype.loadSync(join(dir, f));
const sora300 = load("sora-300.ttf");
const sora600 = load("sora-600.ttf");
const sora700 = load("sora-700.ttf");
const gur = load("gurmukhi-500.ttf");

const width = (font, text, size) => font.getAdvanceWidth(text, size, { kerning: true });
const path = (font, text, x, y, size, fill, extra = "") =>
  `<path fill="${fill}"${extra} d="${font.getPath(text, x, y, size, { kerning: true }).toPathData(1)}"/>`;

const C = { deep: "#0b2a3f", deep2: "#123f5c", r1: "#1d5f86", r2: "#3d93b8", r3: "#9fd3e3", gold: "#f2b52e", saffron: "#e9772b", rani: "#c3245e" };

// Title block
const x0 = 64;
const name = path(sora300, "fleet-standards", x0, 104, 22, C.r3);
const vW = width(sora700, version, 46);
const ver = path(sora700, version, x0, 160, 46, "#ffffff");
const dotX = x0 + vW + 14;
const sat = path(sora600, "· Satluj", dotX, 160, 30, C.gold);
const gX = dotX + width(sora600, "· Satluj", 30) + 14;
const gurm = path(gur, "ਸਤਲੁਜ", gX, 160, 22, C.gold, ' opacity=".85"');
const panelW = Math.ceil(gX + width(gur, "ਸਤਲੁਜ", 22) + 28 - 40);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 260" width="880" height="260" role="img" aria-labelledby="t">
<title id="t">fleet-standards ${version} · Satluj</title>
<defs>
<linearGradient id="water" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.deep}"/><stop offset="1" stop-color="${C.deep2}"/></linearGradient>
<pattern id="border" width="20" height="14" patternUnits="userSpaceOnUse">
<rect width="20" height="14" fill="${C.deep}"/>
<path d="M10 1 L17 7 L10 13 L3 7 Z" fill="${C.gold}"/>
<path d="M10 4.5 L13.5 7 L10 9.5 L6.5 7 Z" fill="${C.rani}"/>
<circle cx="0" cy="7" r="1.6" fill="${C.saffron}"/><circle cx="20" cy="7" r="1.6" fill="${C.saffron}"/>
</pattern>
</defs>
<rect width="880" height="260" fill="url(#water)"/>
<g fill="none" stroke-linecap="round">
<path d="M-20 70 C 160 30, 300 110, 470 70 S 760 30, 900 70" stroke="${C.r1}" stroke-width="10" opacity=".55"/>
<path d="M-20 100 C 180 60, 320 140, 500 100 S 780 60, 900 100" stroke="${C.r1}" stroke-width="10" opacity=".7"/>
<path d="M-20 160 C 200 120, 340 200, 520 160 S 800 120, 900 160" stroke="${C.r1}" stroke-width="10" opacity=".7"/>
<path d="M-20 190 C 220 150, 360 230, 540 190 S 820 150, 900 190" stroke="${C.r1}" stroke-width="10" opacity=".55"/>
<path d="M-20 130 C 190 90, 330 170, 510 130 S 790 90, 900 130" stroke="${C.r2}" stroke-width="18"/>
<path d="M-20 130 C 190 90, 330 170, 510 130 S 790 90, 900 130" stroke="${C.r3}" stroke-width="3"/>
</g>
<rect x="40" y="58" width="${panelW}" height="132" rx="10" fill="${C.deep}" opacity=".86"/>
${name}
${ver}
${sat}
${gurm}
<rect y="230" width="880" height="2" fill="${C.gold}"/>
<rect y="232" width="880" height="28" fill="url(#border)"/>
</svg>
`;
process.stdout.write(svg);
