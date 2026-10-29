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

// Options 13 to 22 follow Google's 2025 icon language closely: hue shifts inside one shape
// (Gmail, the G), coloured glows where parts meet (Meet, Keep, Drive), lighter layers and
// folds (Docs, Calendar, Tasks), tilted stacks (Slides) and two-part forms (Voice, Meet).
const soft = (id, sd) =>
  `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

// 13. Nano N (Gmail M): one chunky stroke whose colour flows blue to violet to pink to orange.
const nStroke = 'M140,392V136L372,376V120';
const optionMonogram = svg(`
  <defs>
    ${soft('n-soft', 34)}
    <mask id="n-mask"><path d="${nStroke}" fill="none" stroke="#FFFFFF" stroke-width="80" stroke-linecap="round" stroke-linejoin="round"/></mask>
  </defs>
  <g mask="url(#n-mask)">
    <rect width="512" height="512" fill="#8B5CF6"/>
    <g filter="url(#n-soft)">
      <circle cx="130" cy="330" r="130" fill="#2F7BFF"/>
      <circle cx="140" cy="130" r="70" fill="#7CC4FF"/>
      <circle cx="250" cy="250" r="70" fill="#8B5CF6"/>
      <circle cx="372" cy="140" r="90" fill="#FFB020"/>
      <circle cx="372" cy="360" r="110" fill="#FF4D8D"/>
    </g>
  </g>`);

// 14. Quad Spark (the G): a big sparkle whose four arms each carry a Google colour, blended at the core.
const optionQuad = svg(`
  <defs>
    ${soft('q-soft', 30)}
    <clipPath id="q-clip"><path d="${sparkle(256, 256, 176, 0.1)}"/></clipPath>
  </defs>
  <g clip-path="url(#q-clip)">
    <g filter="url(#q-soft)">
      <path d="M0,0H512L256,256Z" fill="#FF4747"/>
      <path d="M512,0V512L256,256Z" fill="#2F7BFF"/>
      <path d="M512,512H0L256,256Z" fill="#12B76A"/>
      <path d="M0,512V0L256,256Z" fill="#FFC21A"/>
    </g>
  </g>`);

// 15. Nano Tile (Calendar): a pinched tile with a lighter top band and a big white N.
const tile = 'M150,104H362C394,104 412,124 410,156L400,256L410,356C412,388 394,408 362,408H150C118,408 100,388 102,356L112,256L102,156C100,124 118,104 150,104Z';
const optionTile = svg(`
  <defs>
    ${lin('ti-base', 0, 104, 0, 408, '#5B95FF', '#2F6BFF')}
    ${lin('ti-band', 102, 0, 410, 0, '#C9D6FF', '#B4A8FF', '#9BC0FF')}
    ${blob('ti-pink', '#F7A8FF', 0.7)}
    <clipPath id="ti-clip"><path d="${tile}"/></clipPath>
  </defs>
  <path d="${tile}" fill="url(#ti-base)"/>
  <g clip-path="url(#ti-clip)">
    <rect x="96" y="96" width="320" height="76" fill="url(#ti-band)"/>
    <rect x="96" y="160" width="320" height="16" fill="#2F6BFF" opacity="0.18"/>
    <circle cx="400" cy="420" r="150" fill="url(#ti-pink)"/>
  </g>
  <path d="M196,350V222L316,346V218" fill="none" stroke="#FFFFFF" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>`);

// 16. Answer Quarter (Voice): a speech bubble with a quarter circle laid over its corner.
const optionQuarter = svg(`
  <defs>
    ${lin('qu-bubble', 90, 196, 310, 420, '#9F7AEA', '#6D4AFF')}
    ${lin('qu-quarter', 290, 80, 440, 250, '#FFD166', '#FF8A3D', '#FF5C8A')}
  </defs>
  <path d="M150,196H252A58,58 0 0 1 310,254V340A58,58 0 0 1 252,398H170L120,430A8,8 0 0 1 108,423V392A58,58 0 0 1 92,354V254A58,58 0 0 1 150,196Z" fill="url(#qu-bubble)"/>
  <path d="M282,82A160,160 0 0 1 442,242H306A24,24 0 0 1 282,218Z" fill="url(#qu-quarter)" opacity="0.94"/>
  <g fill="#FFFFFF"><circle cx="160" cy="300" r="15"/><circle cx="204" cy="300" r="15"/><circle cx="248" cy="300" r="15"/></g>`);

// 17. Prompt Field (Meet): an input box with a send wedge, and a pink glow where they meet.
const field = 'M116,150H296A44,44 0 0 1 340,194V318A44,44 0 0 1 296,362H116A44,44 0 0 1 72,318V194A44,44 0 0 1 116,150Z';
const optionField = svg(`
  <defs>
    ${lin('fi-base', 72, 150, 340, 362, '#FFE14D', '#FFC400')}
    ${lin('fi-wedge', 354, 180, 446, 330, '#FFB300', '#FF8F00')}
    ${blob('fi-pink', '#FF8FC8', 0.95)}
    <clipPath id="fi-clip"><path d="${field}"/></clipPath>
  </defs>
  <path d="M356,232L424,186C434,180 446,186 446,198V314C446,326 434,332 424,326L356,280Z" fill="url(#fi-wedge)" stroke="url(#fi-wedge)" stroke-width="12" stroke-linejoin="round"/>
  <path d="${field}" fill="url(#fi-base)"/>
  <g clip-path="url(#fi-clip)"><circle cx="350" cy="256" r="120" fill="url(#fi-pink)"/></g>
  <rect x="110" y="292" width="104" height="30" rx="15" fill="#FFFFFF"/>
  <rect x="226" y="292" width="10" height="30" rx="5" fill="#FFFFFF" opacity="0.8"/>`);

// 18. Prompt Doc (Docs): a page with a lighter folded corner and short lines low on the left.
const doc = 'M164,92H312L392,172V376A44,44 0 0 1 348,420H164A44,44 0 0 1 120,376V136A44,44 0 0 1 164,92Z';
const optionDoc = svg(`
  <defs>
    ${lin('d-base', 0, 92, 0, 420, '#16C47F', '#0EA968')}
    ${blob('d-glow', '#8FE3FF', 0.95)}
    ${lin('d-fold', 312, 92, 392, 172, '#C8F7DC', '#7EE2B0')}
    <clipPath id="d-clip"><path d="${doc}"/></clipPath>
  </defs>
  <path d="${doc}" fill="url(#d-base)"/>
  <g clip-path="url(#d-clip)"><circle cx="120" cy="430" r="170" fill="url(#d-glow)"/></g>
  <path d="M312,92V140A32,32 0 0 0 344,172H392Z" fill="url(#d-fold)" stroke="url(#d-fold)" stroke-width="10" stroke-linejoin="round"/>
  <path d="${sparkle(200, 250, 40)}" fill="#FFFFFF"/>
  <rect x="164" y="316" width="118" height="24" rx="12" fill="#FFFFFF"/>
  <rect x="164" y="356" width="76" height="24" rx="12" fill="#FFFFFF"/>`);

// 19. Typing Stack (Slides): a tilted back card under a straight front card, with typing dots.
const slide = 'M144,170H368A40,40 0 0 1 408,210V326A40,40 0 0 1 368,366H144A40,40 0 0 1 104,326V210A40,40 0 0 1 144,170Z';
const optionStack = svg(`
  <defs>
    ${lin('sl-back', 0, 150, 0, 380, '#7DD3FC', '#FF9EC7')}
    ${lin('sl-front', 104, 170, 408, 366, '#38BDF8', '#2563EB')}
    ${lin('sl-top', 0, 170, 0, 230, 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0)')}
  </defs>
  <path d="${slide}" fill="url(#sl-back)" transform="rotate(-8 256 268) translate(0 -36)"/>
  <path d="${slide}" fill="url(#sl-front)"/>
  <path d="${slide}" fill="url(#sl-top)"/>
  <g fill="#FFFFFF"><circle cx="196" cy="268" r="20"/><circle cx="256" cy="268" r="20" opacity="0.85"/><circle cx="316" cy="268" r="20" opacity="0.65"/></g>`);

// 20. Idea Spark (Keep): a bulb with a pink glow at its neck and a sparkle for the filament.
const optionBulb = svg(`
  <defs>
    ${lin('bu-glass', 0, 96, 0, 360, '#FFE45C', '#FFC61A')}
    ${lin('bu-base', 0, 330, 0, 432, '#FFA41B', '#FF7A00')}
    ${blob('bu-pink', '#FF8FB8', 1)}
    <clipPath id="bu-clip"><circle cx="256" cy="226" r="134"/></clipPath>
  </defs>
  <rect x="200" y="300" width="112" height="132" rx="56" fill="url(#bu-base)"/>
  <circle cx="256" cy="226" r="134" fill="url(#bu-glass)"/>
  <g clip-path="url(#bu-clip)"><circle cx="256" cy="350" r="120" fill="url(#bu-pink)"/></g>
  <path d="${sparkle(256, 300, 44)}" fill="#FFFFFF"/>`);

// 21. Send Badge (Tasks): a disc on a lighter layer that peeks out below, with a send arrow.
const optionBadge = svg(`
  <defs>
    ${lin('ba-under', 0, 140, 0, 440, '#FFD0C2', '#FFB199')}
    ${lin('ba-disc', 110, 96, 402, 392, '#FF7A59', '#F0384A')}
    ${blob('ba-glow', '#FFC46B', 0.8)}
    <clipPath id="ba-clip"><circle cx="256" cy="244" r="148"/></clipPath>
  </defs>
  <circle cx="256" cy="286" r="148" fill="url(#ba-under)"/>
  <circle cx="256" cy="244" r="148" fill="url(#ba-disc)"/>
  <g clip-path="url(#ba-clip)"><circle cx="150" cy="120" r="150" fill="url(#ba-glow)"/></g>
  <path d="M256,318V178M190,240L256,174L322,240" fill="none" stroke="#FFFFFF" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>`);

// 22. Play Prism (Drive): a play triangle built from one thick band whose colours blend at the corners.
const prism = 'M168,128L168,384L390,256Z';
const optionPrism = svg(`
  <defs>
    ${soft('pr-soft', 30)}
    <mask id="pr-mask"><path d="${prism}" fill="none" stroke="#FFFFFF" stroke-width="84" stroke-linejoin="round"/></mask>
  </defs>
  <g mask="url(#pr-mask)">
    <rect width="512" height="512" fill="#2F7BFF"/>
    <g filter="url(#pr-soft)">
      <circle cx="160" cy="120" r="120" fill="#12B76A"/>
      <circle cx="160" cy="400" r="130" fill="#2F7BFF"/>
      <circle cx="410" cy="256" r="120" fill="#FFC21A"/>
      <circle cx="290" cy="340" r="60" fill="#E879F9"/>
    </g>
  </g>`);

// Options 23 to 42 are AI, ML and "nano" metaphors drawn in the same gradient language.

// 23. Neural Net (cyan to blue): a tiny three-layer network whose output node is a sparkle.
const nnIn = [[128, 160], [128, 256], [128, 352]], nnMid = [[256, 208], [256, 304]], nnOut = [384, 256];
const nnEdges = [...nnIn.flatMap((a) => nnMid.map((b) => [a, b])), ...nnMid.map((a) => [a, nnOut])];
const optionNeural = svg(`
  <defs>
    ${lin('nn-edge', 128, 0, 384, 0, '#A5F3FC', '#93C5FD', '#C4B5FD')}
    ${lin('nn-in', 0, 120, 0, 390, '#67E8F9', '#06B6D4')}
    ${lin('nn-mid', 0, 170, 0, 340, '#60A5FA', '#2563EB')}
    ${lin('nn-out', 336, 208, 432, 304, '#A78BFA', '#7C3AED')}
  </defs>
  <g stroke="url(#nn-edge)" stroke-width="16" stroke-linecap="round">${nnEdges
    .map(([[x1, y1], [x2, y2]]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`).join('')}</g>
  ${nnIn.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="34" fill="url(#nn-in)"/>`).join('')}
  ${nnMid.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="38" fill="url(#nn-mid)"/>`).join('')}
  <circle cx="${nnOut[0]}" cy="${nnOut[1]}" r="54" fill="url(#nn-out)"/>
  <path d="${sparkle(nnOut[0], nnOut[1], 30)}" fill="#FFFFFF"/>`);

// 24. Brain Spark (rose and coral): two bumpy lobes with a sparkle of insight.
const lobe = [[196, 182, 76], [158, 268, 76], [204, 340, 70], [226, 254, 64]];
const optionBrain = svg(`
  <defs>
    ${lin('br-l', 90, 110, 250, 410, '#FDA4AF', '#F43F5E')}
    ${lin('br-r', 262, 110, 422, 410, '#FDBA74', '#FB7185')}
  </defs>
  <g fill="url(#br-l)">${lobe.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
  <g fill="url(#br-r)">${lobe.map(([x, y, r]) => `<circle cx="${524 - x}" cy="${y}" r="${r}"/>`).join('')}</g>
  <path d="M156,250C176,230 206,236 214,256M338,196C320,214 320,240 340,256" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="14" stroke-linecap="round"/>
  <path d="${sparkle(344, 292, 46)}" fill="#FFFFFF"/>`);

// 25. Nano Atom (violet, cyan and pink): nano-scale orbits around a glowing core.
const optionAtom = svg(`
  <defs>
    ${lin('at-core', 216, 216, 296, 296, '#FDBA74', '#F472B6')}
  </defs>
  <g fill="none" stroke-width="22" opacity="0.92">
    <ellipse cx="256" cy="256" rx="186" ry="70" stroke="#22D3EE"/>
    <ellipse cx="256" cy="256" rx="186" ry="70" stroke="#A78BFA" transform="rotate(60 256 256)"/>
    <ellipse cx="256" cy="256" rx="186" ry="70" stroke="#F472B6" transform="rotate(120 256 256)"/>
  </g>
  <circle cx="256" cy="256" r="50" fill="url(#at-core)"/>
  <path d="${sparkle(256, 256, 28)}" fill="#FFFFFF"/>`);

// 26. Token Blocks (Google colours): a prompt broken into tokens, the next token is a sparkle.
const tokens = [
  [96, 146, 124, '#4285F4'], [234, 146, 92, '#EA4335'], [340, 146, 76, '#FBBC04'],
  [96, 228, 84, '#34A853'], [194, 228, 160, '#A142F4'],
  [96, 310, 150, '#4285F4'],
];
const optionTokens = svg(`
  <defs>${lin('tk-sheen', 0, 140, 0, 370, 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)')}</defs>
  ${tokens.map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="58" rx="29" fill="${c}"/>`).join('')}
  <path d="${sparkle(324, 339, 58)}" fill="#FBBC04"/>`);

// 27. Attention Grid (violet heatmap): a 3x3 attention map with the strongest cell lit.
const heat = ['#DDD6FE', '#A78BFA', '#EDE9FE', '#8B5CF6', '#5B21B6', '#A78BFA', '#EDE9FE', '#C4B5FD', '#7C3AED'];
const optionAttention = svg(`
  ${heat.map((c, i) => `<rect x="${104 + (i % 3) * 106}" y="${104 + Math.floor(i / 3) * 106}" width="92" height="92" rx="26" fill="${c}"/>`).join('')}
  <path d="${sparkle(256, 256, 34)}" fill="#FFFFFF"/>`);

// 28. Model Layers (teal): stacked layers of a model, the top one carrying the sparkle.
const plate = (cy) => `M256,${cy - 66}L392,${cy}L256,${cy + 66}L120,${cy}Z`;
const optionLayers = svg(`
  <defs>
    ${lin('ly-1', 120, 0, 392, 0, '#0F766E', '#115E59')}
    ${lin('ly-2', 120, 0, 392, 0, '#14B8A6', '#0D9488')}
    ${lin('ly-3', 120, 0, 392, 0, '#99F6E4', '#2DD4BF')}
  </defs>
  <path d="${plate(338)}" fill="url(#ly-1)" stroke="url(#ly-1)" stroke-width="32" stroke-linejoin="round"/>
  <path d="${plate(256)}" fill="url(#ly-2)" stroke="url(#ly-2)" stroke-width="32" stroke-linejoin="round"/>
  <path d="${plate(174)}" fill="url(#ly-3)" stroke="url(#ly-3)" stroke-width="32" stroke-linejoin="round"/>
  <path d="${sparkle(256, 174, 38)}" fill="#FFFFFF"/>`);

// 29. Nano Dot (orange to pink): a tiny core with ripples, small model with a big reach.
const optionDot = svg(`
  <defs>${lin('dt', 120, 120, 392, 392, '#FFB347', '#FF5E8A')}</defs>
  <circle cx="256" cy="256" r="176" fill="none" stroke="url(#dt)" stroke-width="18" opacity="0.3"/>
  <circle cx="256" cy="256" r="124" fill="none" stroke="url(#dt)" stroke-width="22" opacity="0.6"/>
  <circle cx="256" cy="256" r="66" fill="url(#dt)"/>
  <path d="${sparkle(256, 256, 30)}" fill="#FFFFFF"/>
  <path d="${sparkle(380, 130, 30)}" fill="#FF7A6B"/>`);

// 30. Loss Curve (navy and lime): a training curve settling into a sparkle.
const optionLoss = svg(`
  <defs>
    ${lin('ls-tile', 96, 96, 416, 416, '#1E293B', '#0B1220')}
    ${lin('ls-curve', 140, 0, 350, 0, '#38BDF8', '#A3E635')}
  </defs>
  <rect x="96" y="96" width="320" height="320" rx="84" fill="url(#ls-tile)"/>
  <path d="M146,154V354H366" fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M170,150C200,270 250,312 328,318" fill="none" stroke="url(#ls-curve)" stroke-width="28" stroke-linecap="round"/>
  <path d="${sparkle(336, 316, 40)}" fill="#D9F99D"/>`);

// 31. Embedding Space (periwinkle): clusters of points in vector space.
const dots = [
  [180, 196, 22, '#3B82F6'], [216, 168, 16, '#3B82F6'], [206, 226, 14, '#60A5FA'],
  [322, 196, 20, '#EC4899'], [350, 236, 16, '#F472B6'], [300, 230, 13, '#EC4899'],
  [236, 326, 22, '#10B981'], [280, 352, 16, '#34D399'], [214, 362, 12, '#10B981'],
];
const optionEmbed = svg(`
  <defs>${lin('em-disc', 90, 90, 422, 422, '#EEF2FF', '#A5B4FC')}</defs>
  <circle cx="256" cy="256" r="172" fill="url(#em-disc)"/>
  ${dots.map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')}
  <path d="${sparkle(352, 330, 34)}" fill="#6366F1"/>`);

// 32. Friendly Bot (sky blue): a robot head with a sparkle antenna.
const optionBot = svg(`
  <defs>
    ${lin('bo-head', 112, 160, 400, 400, '#7DB8FF', '#2563EB')}
    ${lin('bo-tip', 220, 60, 292, 132, '#FFE58A', '#FFB020')}
  </defs>
  <path d="M256,170V112" stroke="#2563EB" stroke-width="18" stroke-linecap="round"/>
  <rect x="80" y="246" width="40" height="84" rx="20" fill="#93C5FD"/>
  <rect x="392" y="246" width="40" height="84" rx="20" fill="#93C5FD"/>
  <rect x="108" y="160" width="296" height="246" rx="84" fill="url(#bo-head)"/>
  <rect x="148" y="214" width="216" height="140" rx="58" fill="#0B1B3F"/>
  <rect x="192" y="252" width="36" height="58" rx="18" fill="#67E8F9"/>
  <rect x="284" y="252" width="36" height="58" rx="18" fill="#67E8F9"/>
  <path d="${sparkle(256, 100, 42)}" fill="url(#bo-tip)"/>`);

// 33. Magic Wand (deep purple and gold): a wand casting sparkles.
const optionWand = svg(`
  <defs>
    ${lin('wa-stick', 140, 390, 320, 210, '#4C1D95', '#8B5CF6')}
    ${lin('wa-gold', 300, 100, 420, 240, '#FEF08A', '#F59E0B')}
  </defs>
  <path d="M146,388L304,230" stroke="url(#wa-stick)" stroke-width="46" stroke-linecap="round"/>
  <path d="M276,258L304,230" stroke="#FFFFFF" stroke-width="46" stroke-linecap="round" opacity="0.9"/>
  <path d="${sparkle(352, 178, 74)}" fill="url(#wa-gold)"/>
  <path d="${sparkle(186, 160, 30)}" fill="#C4B5FD"/>
  <path d="${sparkle(410, 320, 26)}" fill="#FBBF24"/>`);

// 34. Vision Eye (aqua to indigo): multimodal sight, with a sparkle pupil.
const optionEye = svg(`
  <defs>
    ${lin('ey-base', 80, 160, 432, 352, '#2DD4BF', '#3B82F6', '#6366F1')}
    ${lin('ey-pupil', 210, 210, 302, 302, '#A78BFA', '#4F46E5')}
  </defs>
  <path d="M78,256C150,140 362,140 434,256C362,372 150,372 78,256Z" fill="url(#ey-base)" stroke="url(#ey-base)" stroke-width="20" stroke-linejoin="round"/>
  <circle cx="256" cy="256" r="80" fill="#FFFFFF"/>
  <path d="${sparkle(256, 256, 60)}" fill="url(#ey-pupil)"/>`);

// 35. Voice Wave (pink to orange): speech in and out, with a small sparkle.
const bars = [[124, 110], [190, 210], [256, 290], [322, 190], [388, 120]];
const optionWave = svg(`
  <defs>${lin('wv', 0, 100, 0, 412, '#FF7AB6', '#FF6A3D', '#FFB23D')}</defs>
  ${bars.map(([x, h]) => `<rect x="${x - 25}" y="${256 - h / 2}" width="50" height="${h}" rx="25" fill="url(#wv)"/>`).join('')}
  <path d="${sparkle(400, 120, 34)}" fill="#FF6A3D"/>`);

// 36. Nano Hex (amber honeycomb): a nanotech cell with a sparkle core.
const hex = (r) => [0, 1, 2, 3, 4, 5].map((k) => {
  const a = (Math.PI / 3) * k - Math.PI / 2;
  return `${(256 + r * Math.cos(a)).toFixed(1)},${(256 + r * Math.sin(a)).toFixed(1)}`;
}).join(' ');
const optionHex = svg(`
  <defs>
    ${lin('hx', 100, 90, 412, 422, '#FDE047', '#F59E0B', '#EA580C')}
    ${blob('hx-glow', '#FFF7AE', 0.9)}
    <clipPath id="hx-clip"><polygon points="${hex(158)}"/></clipPath>
  </defs>
  <polygon points="${hex(158)}" fill="url(#hx)" stroke="url(#hx)" stroke-width="40" stroke-linejoin="round"/>
  <g clip-path="url(#hx-clip)"><circle cx="200" cy="150" r="170" fill="url(#hx-glow)"/></g>
  <polygon points="${hex(92)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.85" stroke-width="20" stroke-linejoin="round"/>
  <path d="${sparkle(256, 256, 44)}" fill="#FFFFFF"/>`);

// 37. Molecule (green, teal and blue): bonded atoms, nano-scale building blocks.
const atoms = [[262, 172, 82, 'mo-a'], [166, 330, 66, 'mo-b'], [348, 336, 56, 'mo-c']];
const optionMolecule = svg(`
  <defs>
    ${lin('mo-a', 180, 90, 344, 254, '#5EEAD4', '#0D9488')}
    ${lin('mo-b', 100, 264, 232, 396, '#86EFAC', '#16A34A')}
    ${lin('mo-c', 292, 280, 404, 392, '#93C5FD', '#2563EB')}
    ${blob('mo-hi', '#FFFFFF', 0.6)}
  </defs>
  <path d="M262,172L166,330M262,172L348,336M166,330L348,336" stroke="#CBD5E1" stroke-width="28" stroke-linecap="round"/>
  ${atoms.map(([x, y, r, g]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${g})"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.6}" fill="url(#mo-hi)"/>`).join('')}
  <path d="${sparkle(262, 172, 36)}" fill="#FFFFFF"/>`);

// 38. Crystal Gem (ice cyan to violet): a faceted gem, compressed intelligence.
const facets = [
  ['96,214 178,134 218,214', '#A5F3FC'], ['178,134 334,134 294,214 218,214', '#E0F2FE'], ['334,134 416,214 294,214', '#C4B5FD'],
  ['96,214 218,214 256,410', '#22D3EE'], ['218,214 294,214 256,410', '#60A5FA'], ['294,214 416,214 256,410', '#8B5CF6'],
];
const optionGem = svg(`
  <g stroke-linejoin="round" stroke-width="10">${facets.map(([pts, c]) => `<polygon points="${pts}" fill="${c}" stroke="${c}"/>`).join('')}</g>
  <path d="${sparkle(244, 172, 26)}" fill="#FFFFFF"/>`);

// 39. Bolt Chip (midnight and yellow): fast on-device inference.
const optionBolt = svg(`
  <defs>
    ${lin('bc-chip', 120, 120, 392, 392, '#3B4BC8', '#1E1B4B')}
    ${lin('bc-bolt', 180, 130, 330, 380, '#FFF3A3', '#FFC21A')}
  </defs>
  <g fill="#A5B4FC">${[188, 238, 288].map((p) => `
    <rect x="${p}" y="84" width="36" height="52" rx="18"/><rect x="${p}" y="376" width="36" height="52" rx="18"/>
    <rect x="84" y="${p}" width="52" height="36" rx="18"/><rect x="376" y="${p}" width="52" height="36" rx="18"/>`).join('')}
  </g>
  <rect x="120" y="120" width="272" height="272" rx="56" fill="url(#bc-chip)"/>
  <path d="M278,144L184,276H250L232,368L330,232H264Z" fill="url(#bc-bolt)" stroke="url(#bc-bolt)" stroke-width="14" stroke-linejoin="round"/>`);

// 40. Learning Loop (blue to orange): an infinity loop, the model keeps learning.
const optionLoop = svg(`
  <defs>${lin('lp', 96, 0, 416, 0, '#3B82F6', '#A855F7', '#EC4899', '#F97316')}</defs>
  <path d="M256,256C212,190 112,180 112,256C112,332 212,322 256,256C300,190 400,180 400,256C400,332 300,322 256,256Z" fill="none" stroke="url(#lp)" stroke-width="58" stroke-linejoin="round"/>
  <path d="${sparkle(400, 150, 32)}" fill="#F97316"/>`);

// 41. Decision Tree (forest to lime): branching nodes, one leaf lit as the answer.
const tree = { root: [256, 136, 42], mid: [[172, 252, 36], [340, 252, 36]], leaf: [[120, 370, 30], [222, 370, 30], [300, 370, 30], [392, 370, 30]] };
const optionTree = svg(`
  <defs>
    ${lin('tr-root', 210, 90, 300, 180, '#22C55E', '#15803D')}
    ${lin('tr-mid', 0, 210, 0, 290, '#4ADE80', '#16A34A')}
    ${lin('tr-leaf', 0, 336, 0, 400, '#D9F99D', '#84CC16')}
  </defs>
  <path d="M256,136L172,252M256,136L340,252M172,252L120,370M172,252L222,370M340,252L300,370M340,252L392,370" stroke="#BBF7D0" stroke-width="16" stroke-linecap="round"/>
  <circle cx="${tree.root[0]}" cy="${tree.root[1]}" r="${tree.root[2]}" fill="url(#tr-root)"/>
  ${tree.mid.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#tr-mid)"/>`).join('')}
  ${tree.leaf.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#tr-leaf)"/>`).join('')}
  <circle cx="392" cy="370" r="40" fill="#16A34A"/>
  <path d="${sparkle(392, 370, 24)}" fill="#FFFFFF"/>`);

// 42. Spark Orb (indigo, cyan and coral): a glowing assistant orb.
const optionOrb = svg(`
  <defs>
    ${soft('ob-soft', 36)}
    ${lin('ob-base', 86, 86, 426, 426, '#6366F1', '#8B5CF6', '#EC4899')}
    <clipPath id="ob-clip"><circle cx="256" cy="256" r="170"/></clipPath>
  </defs>
  <circle cx="256" cy="256" r="170" fill="url(#ob-base)"/>
  <g clip-path="url(#ob-clip)">
    <g filter="url(#ob-soft)">
      <circle cx="160" cy="170" r="110" fill="#22D3EE"/>
      <circle cx="360" cy="370" r="120" fill="#FB923C"/>
    </g>
    <ellipse cx="200" cy="150" rx="90" ry="44" fill="#FFFFFF" opacity="0.35" transform="rotate(-30 200 150)"/>
  </g>
  <path d="${sparkle(256, 256, 72)}" fill="#FFFFFF"/>`);

// Options 43 to 62 are classy LLM and generative AI marks: few elements, premium palettes.

// A rounded square tile filled with gradient `id`, for the options that sit on a tile.
const tileRect = (id) => `<rect x="96" y="96" width="320" height="320" rx="88" fill="url(#${id})"/>`;
const gold = (id) => lin(id, 140, 110, 380, 400, '#FBEBB5', '#E2B65C', '#B9852F');

// 43. Gilded Bubble (navy and gold): a chat bubble with a gold rim and a gold sparkle.
const optionGildedBubble = svg(`
  <defs>${lin('gb-navy', 80, 112, 432, 414, '#22355E', '#0E1A33')}${gold('gb-gold')}</defs>
  <path d="${bubble}" fill="url(#gb-navy)" stroke="url(#gb-gold)" stroke-width="18" stroke-linejoin="round"/>
  <path d="${sparkle(256, 240, 74)}" fill="url(#gb-gold)"/>`);

// 44. ai Mark (ivory, ink and gold): a lowercase "ai" whose dot is a sparkle.
const optionAiMark = svg(`
  <defs>${lin('am-tile', 96, 96, 416, 416, '#FFFBF2', '#EFE4CF')}${gold('am-gold')}</defs>
  ${tileRect('am-tile')}
  <g fill="none" stroke="#1C2333" stroke-width="34" stroke-linecap="round">
    <circle cx="210" cy="302" r="58"/><path d="M268,246V360M338,252V360"/>
  </g>
  <path d="${sparkle(338, 178, 42)}" fill="url(#am-gold)"/>`);

// 45. Quill (plum and lilac): a feather writing, text being generated.
const optionQuill = svg(`
  <defs>${lin('qu-feather', 380, 100, 160, 380, '#F3E8FF', '#C4B5FD', '#8B5CF6')}${lin('qu-ink', 0, 300, 0, 430, '#6D28D9', '#3B1E54')}</defs>
  <path d="M384,100C300,110 206,186 176,298L158,372L232,342C334,300 392,208 384,100Z" fill="url(#qu-feather)"/>
  <path d="M372,116C306,186 232,270 160,378" fill="none" stroke="#5B21B6" stroke-opacity="0.45" stroke-width="10" stroke-linecap="round"/>
  <path d="M160,378L132,416" stroke="url(#qu-ink)" stroke-width="16" stroke-linecap="round"/>
  <path d="M190,416H380" stroke="#C4B5FD" stroke-width="14" stroke-linecap="round" opacity="0.7"/>
  <path d="${sparkle(352, 340, 36)}" fill="#8B5CF6"/>`);

// 46. Text Cursor (sapphire and pearl): an I-beam with a sparkle being typed.
const optionCursor = svg(`
  <defs>${lin('tc-tile', 96, 96, 416, 416, '#2747A8', '#0F1E4D')}${lin('tc-pearl', 260, 170, 380, 300, '#FFFFFF', '#BFD0FF')}</defs>
  ${tileRect('tc-tile')}
  <path d="M210,160V352M180,156H240M180,356H240" stroke="#E6ECFF" stroke-width="24" stroke-linecap="round"/>
  <path d="${sparkle(316, 240, 64)}" fill="url(#tc-pearl)"/>`);

// 47. Rose Lines (charcoal and rose gold): lines of an answer resolving into a sparkle.
const optionRoseLines = svg(`
  <defs>${lin('rl-tile', 96, 96, 416, 416, '#34343A', '#121215')}${lin('rl-rose', 140, 0, 380, 0, '#F9D3C2', '#D98C7A')}</defs>
  ${tileRect('rl-tile')}
  <rect x="146" y="170" width="190" height="28" rx="14" fill="url(#rl-rose)"/>
  <rect x="146" y="228" width="150" height="28" rx="14" fill="url(#rl-rose)" opacity="0.8"/>
  <rect x="146" y="286" width="96" height="28" rx="14" fill="url(#rl-rose)" opacity="0.6"/>
  <path d="${sparkle(318, 318, 50)}" fill="url(#rl-rose)"/>`);

// 48. Open Book (emerald and gold): a language model's knowledge, with a sparkle rising.
const optionBook = svg(`
  <defs>${lin('bk-tile', 96, 96, 416, 416, '#16714A', '#06331F')}${gold('bk-gold')}</defs>
  ${tileRect('bk-tile')}
  <path d="M256,226C222,202 176,196 138,204V362C176,354 222,360 256,384Z" fill="#FBF3DE"/>
  <path d="M256,226C290,202 336,196 374,204V362C336,354 290,360 256,384Z" fill="#EAD9B4"/>
  <path d="${sparkle(256, 160, 42)}" fill="url(#bk-gold)"/>`);

// 49. Quote (burgundy and blush): a pair of quotation marks, language itself.
const comma = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="50"/><path d="M${cx + 50},${cy}C${cx + 50},${cy + 84} ${cx - 6},${cy + 124} ${cx - 44},${cy + 132}C${cx - 18},${cy + 104} ${cx - 2},${cy + 78} ${cx},${cy + 50}Z"/>`;
const optionQuote = svg(`
  <defs>${lin('qt-tile', 96, 96, 416, 416, '#7A1C38', '#3A0A18')}${lin('qt-blush', 140, 160, 370, 370, '#FFE4EC', '#F4A7BC')}</defs>
  ${tileRect('qt-tile')}
  <g fill="url(#qt-blush)">${comma(200, 214)}${comma(316, 214)}</g>`);

// 50. Spark Ring (champagne gold): a slim ring crossed by a long sparkle.
const optionSparkRing = svg(`
  <defs>${gold('sr-gold')}</defs>
  <circle cx="256" cy="256" r="146" fill="none" stroke="url(#sr-gold)" stroke-width="18"/>
  <path d="${sparkle(256, 256, 196, 0.06)}" fill="url(#sr-gold)"/>`);

// 51. Braces (graphite and mint): code braces holding a sparkle, the model as a function.
const brace = 'M204,150C172,150 166,170 166,200V228C166,248 156,256 138,256C156,256 166,264 166,284V312C166,342 172,362 204,362';
const optionBraces = svg(`
  <defs>${lin('bc2-tile', 96, 96, 416, 416, '#27313D', '#0E1319')}${lin('bc2-mint', 210, 200, 300, 310, '#D1FAE5', '#5EEAD4')}</defs>
  ${tileRect('bc2-tile')}
  <g fill="none" stroke="#E2E8F0" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">
    <path d="${brace}"/><path d="${brace}" transform="translate(512 0) scale(-1 1)"/>
  </g>
  <path d="${sparkle(256, 256, 54)}" fill="url(#bc2-mint)"/>`);

// 52. Next Token (periwinkle to violet): two typed dots, and the next one is generated.
const optionNextToken = svg(`
  <defs>${lin('nt', 290, 180, 440, 330, '#93A5FF', '#6D4AFF')}</defs>
  <circle cx="132" cy="256" r="34" fill="#93A5FF" opacity="0.45"/>
  <circle cx="226" cy="256" r="34" fill="#93A5FF" opacity="0.75"/>
  <path d="${sparkle(354, 256, 84)}" fill="url(#nt)"/>`);

// 53. Aa (cream, ink and gold): the type specimen mark, the model speaks your language.
const optionAa = svg(`
  <defs>${lin('aa-tile', 96, 96, 416, 416, '#FFFBF2', '#EFE4CF')}${gold('aa-gold')}</defs>
  ${tileRect('aa-tile')}
  <g fill="none" stroke="#1C2333" stroke-width="30" stroke-linecap="round" stroke-linejoin="round">
    <path d="M140,358L198,168L256,358M160,296H236"/>
    <circle cx="322" cy="314" r="44"/><path d="M366,270V358"/>
  </g>
  <path d="${sparkle(344, 182, 38)}" fill="url(#aa-gold)"/>`);

// 54. Ink Drop (deep teal and pearl): a drop of ink that becomes a sparkle.
const optionInk = svg(`
  <defs>${lin('ik', 132, 96, 380, 434, '#5EEAD4', '#0F766E', '#0B3B3A')}</defs>
  <path d="M256,92C256,92 382,228 382,310A126,126 0 0 1 130,310C130,228 256,92 256,92Z" fill="url(#ik)"/>
  <ellipse cx="190" cy="300" rx="22" ry="44" fill="#FFFFFF" opacity="0.28" transform="rotate(18 190 300)"/>
  <path d="${sparkle(270, 320, 56)}" fill="#F1FFFC"/>`);

// 55. Dialogue Glass (lilac and violet): two overlapping bubbles, one of frosted glass.
const optionDialogue = svg(`
  <defs>${lin('dg-back', 196, 104, 424, 300, '#A78BFA', '#6D28D9')}${lin('dg-front', 92, 210, 334, 420, '#F5F3FF', '#DDD6FE')}${lin('dg-spark', 170, 260, 260, 360, '#A78BFA', '#6D28D9')}</defs>
  <path d="M256,104H366A58,58 0 0 1 424,162V230A58,58 0 0 1 400,277V312L370,288H256A58,58 0 0 1 198,230V162A58,58 0 0 1 256,104Z" fill="url(#dg-back)"/>
  <path d="M154,210H272A62,62 0 0 1 334,272V340A62,62 0 0 1 272,402H170L124,428V390A62,62 0 0 1 92,340V272A62,62 0 0 1 154,210Z" fill="url(#dg-front)" opacity="0.88"/>
  <path d="${sparkle(212, 306, 46)}" fill="url(#dg-spark)"/>`);

// 56. Linked Rings (sapphire and rose): two interlocked rings, prompt and response.
const optionLinked = svg(`
  <defs>
    ${lin('lk-a', 96, 146, 316, 366, '#6E9BFF', '#1E40AF')}${lin('lk-b', 196, 146, 416, 366, '#FBC2D0', '#E0607E')}${gold('lk-gold')}
    <clipPath id="lk-top"><rect x="222" y="120" width="68" height="76"/></clipPath>
  </defs>
  <g fill="none" stroke-width="32">
    <circle cx="206" cy="256" r="108" stroke="url(#lk-a)"/>
    <circle cx="306" cy="256" r="108" stroke="url(#lk-b)"/>
    <circle cx="206" cy="256" r="108" stroke="url(#lk-a)" clip-path="url(#lk-top)"/>
  </g>
  <path d="${sparkle(256, 256, 34)}" fill="url(#lk-gold)"/>`);

// 57. Noir (black and gold): the luxury tile, a single gold sparkle.
const optionNoir = svg(`
  <defs>
    ${lin('nr-tile', 96, 96, 416, 416, '#2E2E33', '#0B0B0D')}${gold('nr-gold')}
    ${lin('nr-sheen', 0, 96, 0, 230, 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0)')}
  </defs>
  ${tileRect('nr-tile')}
  <rect x="96" y="96" width="320" height="320" rx="88" fill="url(#nr-sheen)"/>
  <rect x="110" y="110" width="292" height="292" rx="76" fill="none" stroke="url(#nr-gold)" stroke-opacity="0.4" stroke-width="4"/>
  <path d="${sparkle(256, 256, 106)}" fill="url(#nr-gold)"/>`);

// 58. Prism (navy and spectrum): a prompt goes in as light and comes out as colour.
const optionPrismLight = svg(`
  <defs>${lin('pl-tile', 96, 96, 416, 416, '#22355E', '#0B1426')}${lin('pl-glass', 160, 150, 350, 330, '#F1F5FF', '#A9B8F5')}</defs>
  ${tileRect('pl-tile')}
  <path d="M128,282L222,256" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round"/>
  <g stroke-width="14" stroke-linecap="round">
    <path d="M300,248L386,206" stroke="#F9A8D4"/><path d="M300,256L390,250" stroke="#FCD34D"/><path d="M300,264L386,296" stroke="#67E8F9"/>
  </g>
  <path d="M256,156L340,322H172Z" fill="url(#pl-glass)" stroke="url(#pl-glass)" stroke-width="20" stroke-linejoin="round" opacity="0.95"/>`);

// 59. Prompt Seal (emerald and gold): a round seal with a prompt chevron and a sparkle.
const optionSeal = svg(`
  <defs>${lin('se-disc', 86, 86, 426, 426, '#1C8A5A', '#063A24')}${gold('se-gold')}</defs>
  <circle cx="256" cy="256" r="168" fill="url(#se-disc)"/>
  <circle cx="256" cy="256" r="142" fill="none" stroke="url(#se-gold)" stroke-opacity="0.6" stroke-width="6"/>
  <path d="M190,206L248,256L190,306" fill="none" stroke="url(#se-gold)" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${sparkle(318, 296, 42)}" fill="url(#se-gold)"/>`);

// 60. Origami Spark (rose and peach): a folded paper sparkle, each arm two-toned.
const oriTips = [[256, 66], [446, 256], [256, 446], [66, 256]];
const oriInner = [[300, 212], [300, 300], [212, 300], [212, 212]];
const oriShades = [['#FAD4C0', '#E8907E'], ['#F7C1AE', '#D9776B'], ['#FAD4C0', '#E8907E'], ['#F7C1AE', '#D9776B']];
const optionOrigami = svg(`
  ${oriTips.map(([tx, ty], i) => {
    const [ax, ay] = oriInner[(i + 3) % 4], [bx, by] = oriInner[i];
    return `<polygon points="256,256 ${ax},${ay} ${tx},${ty}" fill="${oriShades[i][0]}"/><polygon points="256,256 ${tx},${ty} ${bx},${by}" fill="${oriShades[i][1]}"/>`;
  }).join('')}`);

// 61. Comet (plum and gold): a sparkle streaking in, generation in motion.
const optionComet = svg(`
  <defs>
    ${gold('cm-gold')}
    <linearGradient id="cm-tail" x1="330" y1="190" x2="120" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#C084FC"/><stop offset="1" stop-color="#7C3AED" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M300,152L368,220L124,404Z" fill="url(#cm-tail)"/>
  <path d="${sparkle(334, 186, 80)}" fill="url(#cm-gold)"/>`);

// 62. Constellation (midnight and silver): a few stars joined into a thought.
const stars = [[168, 330, 20], [226, 222, 26], [334, 178, 46], [352, 318, 22], [252, 360, 16]];
const optionConstellation = svg(`
  <defs>${lin('cn-tile', 96, 96, 416, 416, '#1D2B55', '#0A1028')}${gold('cn-gold')}</defs>
  ${tileRect('cn-tile')}
  <path d="M168,330L226,222L334,178L352,318L252,360Z" fill="none" stroke="#C7D2FE" stroke-opacity="0.45" stroke-width="6" stroke-linejoin="round"/>
  ${stars.map(([x, y, r], i) => `<path d="${sparkle(x, y, r)}" fill="${i === 2 ? 'url(#cn-gold)' : '#E6ECFF'}"/>`).join('')}`);

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
  { file: 'option-13-nano-n', name: 'Nano N', svg: optionMonogram },
  { file: 'option-14-quad-spark', name: 'Quad Spark', svg: optionQuad },
  { file: 'option-15-nano-tile', name: 'Nano Tile', svg: optionTile },
  { file: 'option-16-answer-quarter', name: 'Answer Quarter', svg: optionQuarter },
  { file: 'option-17-prompt-field', name: 'Prompt Field', svg: optionField },
  { file: 'option-18-prompt-doc', name: 'Prompt Doc', svg: optionDoc },
  { file: 'option-19-typing-stack', name: 'Typing Stack', svg: optionStack },
  { file: 'option-20-idea-spark', name: 'Idea Spark', svg: optionBulb },
  { file: 'option-21-send-badge', name: 'Send Badge', svg: optionBadge },
  { file: 'option-22-play-prism', name: 'Play Prism', svg: optionPrism },
  { file: 'option-23-neural-net', name: 'Neural Net', svg: optionNeural },
  { file: 'option-24-brain-spark', name: 'Brain Spark', svg: optionBrain },
  { file: 'option-25-nano-atom', name: 'Nano Atom', svg: optionAtom },
  { file: 'option-26-token-blocks', name: 'Token Blocks', svg: optionTokens },
  { file: 'option-27-attention-grid', name: 'Attention Grid', svg: optionAttention },
  { file: 'option-28-model-layers', name: 'Model Layers', svg: optionLayers },
  { file: 'option-29-nano-dot', name: 'Nano Dot', svg: optionDot },
  { file: 'option-30-loss-curve', name: 'Loss Curve', svg: optionLoss },
  { file: 'option-31-embedding-space', name: 'Embedding Space', svg: optionEmbed },
  { file: 'option-32-friendly-bot', name: 'Friendly Bot', svg: optionBot },
  { file: 'option-33-magic-wand', name: 'Magic Wand', svg: optionWand },
  { file: 'option-34-vision-eye', name: 'Vision Eye', svg: optionEye },
  { file: 'option-35-voice-wave', name: 'Voice Wave', svg: optionWave },
  { file: 'option-36-nano-hex', name: 'Nano Hex', svg: optionHex },
  { file: 'option-37-molecule', name: 'Molecule', svg: optionMolecule },
  { file: 'option-38-crystal-gem', name: 'Crystal Gem', svg: optionGem },
  { file: 'option-39-bolt-chip', name: 'Bolt Chip', svg: optionBolt },
  { file: 'option-40-learning-loop', name: 'Learning Loop', svg: optionLoop },
  { file: 'option-41-decision-tree', name: 'Decision Tree', svg: optionTree },
  { file: 'option-42-spark-orb', name: 'Spark Orb', svg: optionOrb },
  { file: 'option-43-gilded-bubble', name: 'Gilded Bubble', svg: optionGildedBubble },
  { file: 'option-44-ai-mark', name: 'ai Mark', svg: optionAiMark },
  { file: 'option-45-quill', name: 'Quill', svg: optionQuill },
  { file: 'option-46-text-cursor', name: 'Text Cursor', svg: optionCursor },
  { file: 'option-47-rose-lines', name: 'Rose Lines', svg: optionRoseLines },
  { file: 'option-48-open-book', name: 'Open Book', svg: optionBook },
  { file: 'option-49-quote', name: 'Quote', svg: optionQuote },
  { file: 'option-50-spark-ring', name: 'Spark Ring', svg: optionSparkRing },
  { file: 'option-51-braces', name: 'Braces', svg: optionBraces },
  { file: 'option-52-next-token', name: 'Next Token', svg: optionNextToken },
  { file: 'option-53-aa', name: 'Aa', svg: optionAa },
  { file: 'option-54-ink-drop', name: 'Ink Drop', svg: optionInk },
  { file: 'option-55-dialogue-glass', name: 'Dialogue Glass', svg: optionDialogue },
  { file: 'option-56-linked-rings', name: 'Linked Rings', svg: optionLinked },
  { file: 'option-57-noir', name: 'Noir', svg: optionNoir },
  { file: 'option-58-prism', name: 'Prism', svg: optionPrismLight },
  { file: 'option-59-prompt-seal', name: 'Prompt Seal', svg: optionSeal },
  { file: 'option-60-origami-spark', name: 'Origami Spark', svg: optionOrigami },
  { file: 'option-61-comet', name: 'Comet', svg: optionComet },
  { file: 'option-62-constellation', name: 'Constellation', svg: optionConstellation },
];

const sheet = (list) => `<!doctype html><html><head><style>
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
${['light', 'dark'].map((t) => `<div class="row ${t}">${list.map((o) => `
  <div class="cell">
    <img class="big" src="${o.file}.svg">
    <div class="launch"><div class="circle"><img src="${o.file}.svg"></div><div class="squircle"><img src="${o.file}.svg"></div></div>
    ${t === 'light' ? `<div class="label">${OPTIONS.indexOf(o) + 1}. ${o.name}</div>` : ''}
  </div>`).join('')}</div>`).join('')}
</body></html>`;

(async () => {
  for (const o of OPTIONS) fs.writeFileSync(path.join(DIR, `${o.file}.svg`), o.svg);
  const sheets = { preview: OPTIONS, 'preview-google-style': OPTIONS.slice(12, 22), 'preview-ai-ml': OPTIONS.slice(22, 42), 'preview-classy-genai': OPTIONS.slice(42) };
  for (const [name, list] of Object.entries(sheets)) fs.writeFileSync(path.join(DIR, `${name}.html`), sheet(list));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  for (const o of OPTIONS) {
    await page.goto('file://' + path.join(DIR, `${o.file}.svg`));
    await page.screenshot({ path: path.join(DIR, `${o.file}.png`), omitBackground: true });
  }
  await page.setViewportSize({ width: 1300, height: 400 });
  for (const name of Object.keys(sheets)) {
    await page.goto('file://' + path.join(DIR, `${name}.html`));
    await page.screenshot({ path: path.join(DIR, `${name}.png`), fullPage: true });
  }
  await browser.close();
})();
