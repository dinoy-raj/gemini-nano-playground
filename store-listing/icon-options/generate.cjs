// Builds the three app icon concepts as SVG and renders PNG previews with Playwright.
// Usage (from repo root): NODE_PATH=$(npm root -g) node store-listing/icon-options/generate.cjs
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const DIR = __dirname;

// Four-point Gemini-style sparkle centred on (cx, cy) with radius r.
function sparkle(cx, cy, r, k = 0.08) {
  const a = r * k, b = r * 0.46;
  return [
    `M${cx},${cy - r}`,
    `C${cx + a},${cy - b} ${cx + b},${cy - a} ${cx + r},${cy}`,
    `C${cx + b},${cy + a} ${cx + a},${cy + b} ${cx},${cy + r}`,
    `C${cx - a},${cy + b} ${cx - b},${cy + a} ${cx - r},${cy}`,
    `C${cx - b},${cy - a} ${cx - a},${cy - b} ${cx},${cy - r}Z`,
  ].join(' ');
}

// Soft colour blob: a radial gradient that fades to transparent.
const blob = (id, color, opacity = 1) => `
    <radialGradient id="${id}">
      <stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/>
      <stop offset="0.6" stop-color="${color}" stop-opacity="${opacity * 0.45}"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>`;

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">${body}\n</svg>\n`;

// 1. Prompt Bubble: a chunky chat bubble carrying the sparkle, the "prompt anything" idea.
const bubble = 'M152,112H360A72,72 0 0 1 432,184V296A72,72 0 0 1 360,368H214L148,414A10,10 0 0 1 132,405V362A72,72 0 0 1 80,296V184A72,72 0 0 1 152,112Z';
const optionBubble = svg(`
  <defs>
    <linearGradient id="b-base" x1="80" y1="112" x2="432" y2="414" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4C8DFF"/>
      <stop offset="0.55" stop-color="#4F6BFF"/>
      <stop offset="1" stop-color="#7B5CFF"/>
    </linearGradient>
    ${blob('b-pink', '#FF6FB5', 0.9)}
    ${blob('b-cyan', '#4FE0FF', 0.85)}
    <linearGradient id="b-top" x1="0" y1="112" x2="0" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="b-clip"><path d="${bubble}"/></clipPath>
  </defs>
  <path d="${bubble}" fill="url(#b-base)"/>
  <g clip-path="url(#b-clip)">
    <circle cx="430" cy="120" r="190" fill="url(#b-pink)"/>
    <circle cx="70" cy="420" r="200" fill="url(#b-cyan)"/>
    <rect x="80" y="112" width="352" height="90" fill="url(#b-top)"/>
  </g>
  <path d="${sparkle(256, 240, 92)}" fill="#FFFFFF"/>`);

// 2. Pocket Spark: a phone with a stacked back card and an overlapping sparkle, "AI on your phone".
const phone = 'M178,120H290A50,50 0 0 1 340,170V378A50,50 0 0 1 290,428H178A50,50 0 0 1 128,378V170A50,50 0 0 1 178,120Z';
const optionPocket = svg(`
  <g transform="translate(-14 4)">
  <defs>
    <linearGradient id="p-back" x1="100" y1="100" x2="320" y2="420" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFC94D"/>
      <stop offset="1" stop-color="#FF8A3D"/>
    </linearGradient>
    <linearGradient id="p-phone" x1="128" y1="120" x2="340" y2="428" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5AA2FF"/>
      <stop offset="1" stop-color="#2F6BFF"/>
    </linearGradient>
    ${blob('p-glow', '#FF7AD1', 0.95)}
    <linearGradient id="p-spark" x1="300" y1="70" x2="440" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#22C55E"/>
      <stop offset="0.45" stop-color="#2FB8E6"/>
      <stop offset="1" stop-color="#6D5BFF"/>
    </linearGradient>
    <clipPath id="p-clip"><path d="${phone}"/></clipPath>
  </defs>
  <g transform="rotate(-9 234 274)" opacity="0.95">
    <path d="${phone}" fill="url(#p-back)" transform="translate(-26 10)"/>
  </g>
  <path d="${phone}" fill="url(#p-phone)"/>
  <g clip-path="url(#p-clip)">
    <circle cx="340" cy="190" r="150" fill="url(#p-glow)"/>
  </g>
  <rect x="206" y="384" width="56" height="18" rx="9" fill="#FFFFFF"/>
  <path d="${sparkle(344, 184, 96)}" fill="url(#p-spark)"/>
  </g>`);

// 3. Nano Chip: an on-device chip with a multicolour sparkle cut-out, "Gemini Nano runs locally".
const chip = 'M168,120H344A48,48 0 0 1 392,168V344A48,48 0 0 1 344,392H168A48,48 0 0 1 120,344V168A48,48 0 0 1 168,120Z';
const pins = [176, 236, 296].map((p) => `
  <rect x="${p}" y="78" width="40" height="58" rx="20"/>
  <rect x="${p}" y="376" width="40" height="58" rx="20"/>
  <rect x="78" y="${p}" width="58" height="40" rx="20"/>
  <rect x="376" y="${p}" width="58" height="40" rx="20"/>`).join('');
const optionChip = svg(`
  <defs>
    <linearGradient id="c-pins" x1="78" y1="78" x2="434" y2="434" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#B9C6FF"/>
      <stop offset="1" stop-color="#8E9BFF"/>
    </linearGradient>
    <linearGradient id="c-base" x1="120" y1="120" x2="392" y2="392" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3F7BFF"/>
      <stop offset="1" stop-color="#5B4BF0"/>
    </linearGradient>
    <linearGradient id="c-top" x1="0" y1="120" x2="0" y2="230" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    ${blob('c-red', '#FF4D6D')}
    ${blob('c-yellow', '#FFC93C')}
    ${blob('c-green', '#22C55E')}
    ${blob('c-blue', '#3B82FF')}
    <clipPath id="c-spark"><path d="${sparkle(256, 256, 104, 0.1)}"/></clipPath>
  </defs>
  <g fill="url(#c-pins)">${pins}
  </g>
  <path d="${chip}" fill="url(#c-base)"/>
  <path d="${chip}" fill="url(#c-top)"/>
  <path d="${sparkle(256, 256, 104, 0.1)}" fill="#FFFFFF"/>
  <g clip-path="url(#c-spark)">
    <circle cx="256" cy="192" r="120" fill="url(#c-blue)"/>
    <circle cx="320" cy="256" r="120" fill="url(#c-red)"/>
    <circle cx="256" cy="320" r="120" fill="url(#c-yellow)"/>
    <circle cx="192" cy="256" r="120" fill="url(#c-green)"/>
  </g>`);

const OPTIONS = [
  { file: 'option-1-prompt-bubble', name: 'Prompt Bubble', svg: optionBubble },
  { file: 'option-2-pocket-spark', name: 'Pocket Spark', svg: optionPocket },
  { file: 'option-3-nano-chip', name: 'Nano Chip', svg: optionChip },
];

const sheet = () => `<!doctype html><html><head><style>
  body { margin: 0; font-family: 'Google Sans', Roboto, Arial, sans-serif; }
  .row { display: flex; justify-content: center; gap: 120px; padding: 70px 80px 40px; }
  .light { background: #FFFFFF; color: #1F1F1F; }
  .dark { background: #000000; color: #E3E3E3; }
  .cell { display: flex; flex-direction: column; align-items: center; gap: 28px; }
  .cell img.big { width: 200px; height: 200px; }
  .launch { display: flex; gap: 22px; align-items: center; }
  .launch div { width: 72px; height: 72px; display: grid; place-items: center; overflow: hidden; }
  .launch img { width: 72px; height: 72px; transform: scale(1.12); }
  .light .launch div { background: #F8F9FF; }
  .dark .launch div { background: #1B1C22; }
  .circle { border-radius: 50%; } .squircle { border-radius: 30%; }
  .label { font-size: 22px; font-weight: 500; }
</style></head><body>
${['light', 'dark'].map((t) => `<div class="row ${t}">${OPTIONS.map((o) => `
  <div class="cell">
    <img class="big" src="${o.file}.svg">
    <div class="launch"><div class="circle"><img src="${o.file}.svg"></div><div class="squircle"><img src="${o.file}.svg"></div></div>
    ${t === 'light' ? `<div class="label">${o.name}</div>` : ''}
  </div>`).join('')}</div>`).join('')}
</body></html>`;

(async () => {
  for (const o of OPTIONS) fs.writeFileSync(path.join(DIR, `${o.file}.svg`), o.svg);
  fs.writeFileSync(path.join(DIR, 'preview.html'), sheet());

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  for (const o of OPTIONS) {
    await page.goto('file://' + path.join(DIR, `${o.file}.svg`));
    await page.screenshot({ path: path.join(DIR, `${o.file}.png`), omitBackground: true });
  }
  await page.setViewportSize({ width: 1240, height: 400 });
  await page.goto('file://' + path.join(DIR, 'preview.html'));
  await page.screenshot({ path: path.join(DIR, 'preview.png'), fullPage: true });
  await browser.close();
})();
