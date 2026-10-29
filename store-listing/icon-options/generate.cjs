// Builds the app icon concepts as SVG and renders PNG previews with Playwright.
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

// Linear gradient in icon coordinates; stops are colours spread evenly from start to end.
const lin = (id, x1, y1, x2, y2, ...colors) => `
    <linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">${colors
      .map((c, i) => `<stop offset="${i / (colors.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient>`;

// 4. Spark Terminal (sunset): a prompt window with a chevron and a sparkle cursor.
const win = 'M136,104H376A64,64 0 0 1 440,168V344A64,64 0 0 1 376,408H136A64,64 0 0 1 72,344V168A64,64 0 0 1 136,104Z';
const optionTerminal = svg(`
  <defs>
    ${lin('t-base', 72, 104, 440, 408, '#FF5F6D', '#FF8A4C', '#FFC371')}
    ${blob('t-pink', '#FF4FA3', 0.8)}
    <clipPath id="t-clip"><path d="${win}"/></clipPath>
  </defs>
  <path d="${win}" fill="url(#t-base)"/>
  <g clip-path="url(#t-clip)">
    <circle cx="80" cy="110" r="190" fill="url(#t-pink)"/>
    <rect x="72" y="104" width="368" height="64" fill="#FFFFFF" opacity="0.22"/>
  </g>
  <g fill="#FFFFFF" opacity="0.85"><circle cx="122" cy="136" r="11"/><circle cx="156" cy="136" r="11"/><circle cx="190" cy="136" r="11"/></g>
  <polyline points="142,226 200,276 142,326" fill="none" stroke="#FFFFFF" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${sparkle(318, 284, 66)}" fill="#FFFFFF"/>`);

// 5. Nano Seed (emerald and lime): a sprout, small model that grows.
const optionSeed = svg(`
  <defs>
    ${lin('s-left', 112, 170, 250, 330, '#D9F99D', '#4ADE80')}
    ${lin('s-right', 420, 116, 262, 300, '#6EE7B7', '#10B981', '#047857')}
    ${blob('s-sun', '#FDE047', 0.9)}
    <clipPath id="s-clip"><path d="M262,304C262,190 322,118 424,112C432,218 362,304 262,304Z"/></clipPath>
  </defs>
  <path d="M256,300V410" stroke="#0E9F6E" stroke-width="32" stroke-linecap="round"/>
  <path d="M250,334C166,334 104,272 106,166C208,164 264,230 250,334Z" fill="url(#s-left)"/>
  <path d="M262,304C262,190 322,118 424,112C432,218 362,304 262,304Z" fill="url(#s-right)"/>
  <g clip-path="url(#s-clip)"><circle cx="420" cy="110" r="150" fill="url(#s-sun)"/></g>
  <path d="${sparkle(350, 214, 44)}" fill="#FFFFFF"/>`);

// 6. Speed Gauge (amber to red): tokens per second, with a sparkle at the needle tip.
const optionGauge = svg(`
  <defs>
    ${lin('g-arc', 106, 0, 406, 0, '#FFD43B', '#FF922B', '#F03E3E')}
    ${lin('g-needle', 256, 330, 344, 226, '#FFFFFF', '#FFE8CC')}
  </defs>
  <path d="M106,330A150,150 0 0 1 406,330" fill="none" stroke="url(#g-arc)" stroke-width="72" stroke-linecap="round"/>
  <path d="M106,330A150,150 0 0 1 406,330" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="18" stroke-linecap="round" transform="translate(0 -18)"/>
  <circle cx="256" cy="330" r="46" fill="#F76707"/>
  <path d="M256,330L334,240" stroke="#F76707" stroke-width="30" stroke-linecap="round"/>
  <circle cx="256" cy="330" r="22" fill="#FFFFFF"/>
  <path d="${sparkle(344, 228, 52)}" fill="#F03E3E"/>`);

// 7. Shield Spark (teal and mint): prompts never leave your phone.
const shield = 'M256,96L398,146V250C398,340 336,394 256,420C176,394 114,340 114,250V146Z';
const optionShield = svg(`
  <defs>
    ${lin('sh-base', 114, 96, 398, 420, '#5EEAD4', '#14B8A6', '#0284C7')}
    ${blob('sh-mint', '#BBF7D0', 0.9)}
    <clipPath id="sh-clip"><path d="${shield}"/></clipPath>
  </defs>
  <path d="${shield}" fill="url(#sh-base)" stroke="url(#sh-base)" stroke-width="44" stroke-linejoin="round"/>
  <g clip-path="url(#sh-clip)"><circle cx="130" cy="110" r="190" fill="url(#sh-mint)"/></g>
  <path d="${sparkle(256, 262, 90)}" fill="#FFFFFF"/>`);

// 8. Lab Flask (magenta to violet): a playground to experiment in.
const flask = 'M218,104H294V206L398,372C414,400 396,428 364,428H148C116,428 98,400 114,372L218,206Z';
const optionFlask = svg(`
  <defs>
    ${lin('f-glass', 114, 104, 398, 428, '#FCE7F3', '#F5D0FE')}
    ${lin('f-liquid', 110, 280, 400, 428, '#F472B6', '#D946EF', '#8B5CF6')}
    <clipPath id="f-clip"><path d="${flask}"/></clipPath>
  </defs>
  <path d="${flask}" fill="url(#f-glass)" stroke="url(#f-glass)" stroke-width="28" stroke-linejoin="round"/>
  <g clip-path="url(#f-clip)">
    <path d="M90,292C160,270 220,316 290,292S380,272 420,286V440H90Z" fill="url(#f-liquid)"/>
  </g>
  <rect x="192" y="76" width="128" height="40" rx="20" fill="#EC4899"/>
  <path d="${sparkle(250, 362, 48)}" fill="#FFFFFF"/>
  <circle cx="320" cy="338" r="13" fill="#FFFFFF" opacity="0.85"/>
  <circle cx="186" cy="396" r="9" fill="#FFFFFF" opacity="0.75"/>`);

// 9. Prompt Cards (rose and coral): a stack of prompts, like the Slides layering.
const card = 'M168,140H344A48,48 0 0 1 392,188V352A48,48 0 0 1 344,400H168A48,48 0 0 1 120,352V188A48,48 0 0 1 168,140Z';
const optionCards = svg(`
  <defs>
    ${lin('k-front', 120, 140, 392, 400, '#FF6B81', '#E11D48')}
    ${blob('k-peach', '#FFD6A5', 0.9)}
    <clipPath id="k-clip"><path d="${card}"/></clipPath>
  </defs>
  <path d="${card}" fill="#FFC2B4" transform="rotate(12 256 270) translate(26 -40)"/>
  <path d="${card}" fill="#FF8FA3" transform="rotate(5 256 270) translate(12 -20)"/>
  <path d="${card}" fill="url(#k-front)"/>
  <g clip-path="url(#k-clip)"><circle cx="400" cy="140" r="170" fill="url(#k-peach)"/></g>
  <rect x="160" y="300" width="150" height="24" rx="12" fill="#FFFFFF"/>
  <rect x="160" y="342" width="96" height="24" rx="12" fill="#FFFFFF" opacity="0.8"/>
  <path d="${sparkle(330, 222, 52)}" fill="#FFFFFF"/>`);

// 10. Night Orbit (indigo and gold): a planet with a sparkle moon, the model in your own world.
const optionOrbit = svg(`
  <defs>
    ${lin('o-planet', 140, 120, 372, 392, '#6366F1', '#3730A3', '#1E1B4B')}
    ${blob('o-glow', '#A5B4FC', 0.8)}
    ${lin('o-ring', 50, 0, 462, 0, '#FDE68A', '#F59E0B', '#FDE68A')}
    ${lin('o-moon', 340, 80, 430, 190, '#FEF3C7', '#FBBF24')}
    <clipPath id="o-back"><rect x="0" y="0" width="512" height="256"/></clipPath>
    <clipPath id="o-front"><rect x="0" y="256" width="512" height="256"/></clipPath>
    <clipPath id="o-clip"><circle cx="256" cy="268" r="132"/></clipPath>
  </defs>
  <g transform="rotate(-18 256 268) translate(0 12)">
    <ellipse cx="256" cy="256" rx="214" ry="62" fill="none" stroke="url(#o-ring)" stroke-width="20" clip-path="url(#o-back)"/>
  </g>
  <circle cx="256" cy="268" r="132" fill="url(#o-planet)"/>
  <g clip-path="url(#o-clip)"><circle cx="190" cy="190" r="150" fill="url(#o-glow)"/></g>
  <g transform="rotate(-18 256 268) translate(0 12)">
    <ellipse cx="256" cy="256" rx="214" ry="62" fill="none" stroke="url(#o-ring)" stroke-width="20" clip-path="url(#o-front)"/>
  </g>
  <path d="${sparkle(384, 128, 54)}" fill="url(#o-moon)"/>
  <path d="${sparkle(120, 400, 24)}" fill="#FBBF24"/>`);

// 11. Graphite Pebble (charcoal and lime): a quiet monochrome tile with an electric sparkle.
const pebble = 'M206,96H306C376,96 416,136 416,206V306C416,376 376,416 306,416H206C136,416 96,376 96,306V206C96,136 136,96 206,96Z';
const optionPebble = svg(`
  <defs>
    ${lin('pb-base', 96, 96, 416, 416, '#525B6B', '#262B35', '#111318')}
    ${lin('pb-sheen', 0, 96, 0, 220, 'rgba(255,255,255,0.28)', 'rgba(255,255,255,0)')}
    ${lin('pb-spark', 180, 160, 340, 360, '#ECFCCB', '#A3E635', '#4ADE80')}
    ${blob('pb-glow', '#A3E635', 0.45)}
    <clipPath id="pb-clip"><path d="${pebble}"/></clipPath>
  </defs>
  <path d="${pebble}" fill="url(#pb-base)"/>
  <path d="${pebble}" fill="url(#pb-sheen)"/>
  <g clip-path="url(#pb-clip)"><circle cx="256" cy="256" r="170" fill="url(#pb-glow)"/></g>
  <path d="${sparkle(256, 256, 100)}" fill="url(#pb-spark)"/>`);

// 12. Stream Lines (ocean): an answer streaming in, with the sparkle as the cursor.
const optionStream = svg(`
  <defs>
    ${lin('st-1', 106, 0, 406, 0, '#67E8F9', '#3B82F6')}
    ${lin('st-2', 106, 0, 336, 0, '#22D3EE', '#2563EB')}
    ${lin('st-3', 106, 0, 246, 0, '#06B6D4', '#1D4ED8')}
    ${lin('st-spark', 260, 270, 380, 400, '#2DD4BF', '#0891B2')}
  </defs>
  <rect x="106" y="146" width="300" height="56" rx="28" fill="url(#st-1)"/>
  <rect x="106" y="228" width="230" height="56" rx="28" fill="url(#st-2)"/>
  <rect x="106" y="310" width="140" height="56" rx="28" fill="url(#st-3)"/>
  <path d="${sparkle(320, 338, 62)}" fill="url(#st-spark)"/>`);

const OPTIONS = [
  { file: 'option-1-prompt-bubble', name: 'Prompt Bubble', svg: optionBubble },
  { file: 'option-2-pocket-spark', name: 'Pocket Spark', svg: optionPocket },
  { file: 'option-3-nano-chip', name: 'Nano Chip', svg: optionChip },
  { file: 'option-4-spark-terminal', name: 'Spark Terminal', svg: optionTerminal },
  { file: 'option-5-nano-seed', name: 'Nano Seed', svg: optionSeed },
  { file: 'option-6-speed-gauge', name: 'Speed Gauge', svg: optionGauge },
  { file: 'option-7-shield-spark', name: 'Shield Spark', svg: optionShield },
  { file: 'option-8-lab-flask', name: 'Lab Flask', svg: optionFlask },
  { file: 'option-9-prompt-cards', name: 'Prompt Cards', svg: optionCards },
  { file: 'option-10-night-orbit', name: 'Night Orbit', svg: optionOrbit },
  { file: 'option-11-graphite-pebble', name: 'Graphite Pebble', svg: optionPebble },
  { file: 'option-12-stream-lines', name: 'Stream Lines', svg: optionStream },
];

const sheet = () => `<!doctype html><html><head><style>
  body { margin: 0; font-family: 'Google Sans', Roboto, Arial, sans-serif; }
  .row { display: grid; grid-template-columns: repeat(4, 220px); justify-content: center; gap: 56px 70px; padding: 64px 60px; }
  .light { background: #FFFFFF; color: #1F1F1F; }
  .dark { background: #000000; color: #E3E3E3; }
  .cell { display: flex; flex-direction: column; align-items: center; gap: 28px; }
  .cell img.big { width: 170px; height: 170px; }
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
    ${t === 'light' ? `<div class="label">${OPTIONS.indexOf(o) + 1}. ${o.name}</div>` : ''}
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
  await page.setViewportSize({ width: 1300, height: 400 });
  await page.goto('file://' + path.join(DIR, 'preview.html'));
  await page.screenshot({ path: path.join(DIR, 'preview.png'), fullPage: true });
  await browser.close();
})();
