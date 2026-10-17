// Renders the Play Store listing graphics: node render.mjs (needs playwright).
// The phone and tablet screens are HTML recreations of the app's Compose UI, drawn from the
// composables in ground/ui and info/ui with the app's fallback dark colour scheme.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..');
const mark = readFileSync(join(here, 'icon-mark.svg'), 'utf8').replace(/width="108" height="108"/, 'width="100%" height="100%"');

// Material 3 baseline dark scheme, the same one Theme.kt falls back to.
const c = {
  bg: '#141218', sc: '#211F26', sch: '#2B2930', schh: '#36343B', primary: '#D0BCFF', onPrimary: '#381E72',
  secondary: '#CCC2DC', onSurface: '#E6E0E9', onSurfaceVariant: '#CAC4D0', surfaceVariant: '#49454F',
};

// MaterialShapes cookies, approximated as a smooth polar wave.
function cookie(n, amp, size = 100) {
  const pts = [], r = size / 2;
  for (let i = 0; i < 240; i++) {
    const t = (i / 240) * Math.PI * 2, rr = r * (1 - amp + amp * Math.cos(n * t)) ;
    pts.push(`${(r + rr * Math.cos(t - Math.PI / 2)).toFixed(2)},${(r + rr * Math.sin(t - Math.PI / 2)).toFixed(2)}`);
  }
  return `polygon(${pts.map(p => p.split(',').map(v => v + '%').join(' ')).join(',')})`;
}
const sym = (name, size, color, fill = 1) =>
  `<span class="ms" style="font-size:${size}px;color:${color};font-variation-settings:'FILL' ${fill}">${name}</span>`;

const statusBar = `<div class="status"><span>9:41</span><span class="punch"></span><span>${sym('signal_cellular_alt', 15, c.onSurface)}${sym('wifi', 15, c.onSurface)}${sym('battery_full', 15, c.onSurface)}</span></div>`;

const response = `<p><b>Here's a quick summary:</b></p><ul>
<li>On-device models run directly on your phone's own hardware.</li>
<li>Your prompt is processed locally and never leaves the device.</li>
<li>Once the model is downloaded, answers work without an internet connection.</li></ul>
<p>That makes on-device AI fast, private and always available.</p>`;

function header() {
  return `<div class="hdr"><div class="cookie" style="clip-path:${cookie(6, .09)};background:${c.onPrimary};width:34px;height:34px">${sym('auto_awesome', 12, c.primary)}</div>
  <span style="color:${c.secondary};font-size:12px;margin-left:16px">Gemini nano-v3</span><span style="flex:1"></span>
  <div class="pill" style="background:${c.onSurfaceVariant}">${sym('bug_report', 13, c.bg)}</div></div>`;
}
function options(count, busy) {
  const t = busy ? c.onSurface : c.onSurfaceVariant;
  return `<div class="opts"><div class="cookie" style="clip-path:${cookie(4, .1)};background:${c.sch};width:58px;height:58px;color:${t}"><span style="font-size:13px">${count}</span><span style="font-size:8px;margin-top:4px">s</span></div>
  <div class="mid">${sym('gesture', 20, c.onSurfaceVariant)}</div>
  <div class="cookie" style="border-radius:50% 50% 38% 38%;background:${c.sch};width:58px;height:58px">${sym('cleaning_services', 20, c.onSurfaceVariant)}</div></div>`;
}
function sendButton(size) {
  return `<div class="cookie" style="clip-path:${cookie(9, .07)};background:${c.primary};width:${size}px;height:${size}px">${sym('auto_awesome', size * .38, c.onPrimary)}</div>`;
}
function field(text, placeholder) {
  return `<div class="field"><span style="flex:1;font-size:12px;color:${placeholder ? c.onSurfaceVariant : c.onSurface}">${text}</span>${sendButton(44)}</div>`;
}

// One app screen, laid out in dp like ChatScreen / InfoScreen.
function screen(state, w = 412, h = 892) {
  let body;
  if (state === 'response' || state === 'stats') {
    body = `${header()}
    <div class="box" style="border-radius:36px">
      <div class="md">${response}<div class="stats ${state === 'stats' ? 'hl' : ''}"><span>412.6 ms</span><span>|</span><span>58 tokens</span><span>|</span><span>Finish Reason: STOP</span></div></div>
      <div class="copy">${sym('copy_all', 20, c.onSurfaceVariant)}</div></div>
    ${options(0, false)}${field('Summarise why on-device AI matters in 3 points', false)}`;
  } else if (state === 'thinking') {
    body = `${header()}
    <div class="box" style="border-radius:56px;align-items:center;justify-content:center"><div class="loader" style="clip-path:${cookie(7, .12)}"></div></div>
    ${options(2, true)}${field('Write a haiku about a phone that thinks offline', false)}`;
  } else if (state === 'prompt' || state === 'share') {
    const text = state === 'share'
      ? `<span style="color:${c.onSurface}">Rewrite this in a friendly tone:<br><br>“Your order has been delayed due to unforeseen circumstances. We regret any inconvenience.”</span>`
      : `<span style="color:${c.onSurfaceVariant}">Type your prompt .....</span>`;
    body = `${options(0, false)}
    <div class="box big" style="border-radius:48px;background:${c.schh}">
      <div style="flex:1;display:flex;align-items:${state === 'share' ? 'flex-start' : 'center'};justify-content:center;padding:${state === 'share' ? '48px 28px' : '0'};font-size:20px;line-height:30px;text-align:${state === 'share' ? 'left' : 'center'}">${text}</div>
      <div class="tools"><div class="cookie" style="border-radius:28% 40% 28% 40%;background:${c.sch};width:52px;height:52px">${sym('content_paste_go', 20, c.onSurfaceVariant)}</div>
      ${sendButton(92)}
      <div class="cookie" style="clip-path:polygon(50% 0,100% 30%,100% 70%,50% 100%,0 70%,0 30%);border-radius:30%;background:${c.sch};width:52px;height:52px">${sym('cleaning_services', 20, c.onSurfaceVariant)}</div></div>
    </div>`;
  } else if (state === 'info') {
    body = `<div style="display:flex;flex-direction:column;align-items:center;padding-top:72px;gap:0">
      <div class="cookie" style="clip-path:${cookie(9, .06)};background:${c.onPrimary};width:250px;height:250px;flex-direction:column;gap:16px">
        ${sym('auto_awesome', 36, c.primary)}<div style="color:${c.primary};font-size:20px;font-weight:700;text-align:center;line-height:26px">Gemini<br>nano-v3</div></div>
      <div class="rate">${sym('auto_awesome', 16, c.primary)}<span>Leave a Review On Play Store</span>${sym('auto_awesome', 16, c.primary)}</div>
      <div style="margin-top:64px;color:#8a8a8a;font-size:12px;font-weight:500">Build by <u style="color:#fff">Dinoy Raj</u>.</div>
      <div style="margin-top:4px;color:#8a8a8a;font-size:10px">version 1.0.5</div></div>`;
  }
  return `<div class="screen" style="width:${w}px;height:${h}px">${statusBar}<div class="app ${state}">${body}</div><div class="nav"></div></div>`;
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,400..800&display=block');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Google Sans Flex',sans-serif;background:#0B0C14;overflow:hidden}
.ms{font-family:'Material Symbols Rounded';line-height:1;display:inline-block}
.stage{position:relative;overflow:hidden;background:
 radial-gradient(60% 45% at 85% 8%, rgba(122,92,255,.55), transparent 70%),
 radial-gradient(55% 40% at 5% 30%, rgba(62,139,255,.45), transparent 70%),
 radial-gradient(50% 35% at 70% 95%, rgba(255,111,177,.35), transparent 70%), #0B0C14}
.copyblock{position:absolute;color:#fff}
.eyebrow{display:inline-flex;align-items:center;gap:.5em;font-weight:600;letter-spacing:.02em;color:#C9C2FF;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:999px}
h1{font-weight:700;letter-spacing:-.02em;line-height:1.05}
h1 em{font-style:normal;background:linear-gradient(90deg,#6EA8FF,#9B7BFF 55%,#FF8CC4);-webkit-background-clip:text;color:transparent}
.sub{color:rgba(255,255,255,.72);font-weight:400}
.device{position:absolute;background:#05060A;box-shadow:0 0 0 2px rgba(255,255,255,.14),0 40px 120px rgba(80,60,200,.45)}
.device .scaler{position:absolute;transform-origin:0 0}
.screen{background:${c.bg};color:${c.onSurface};position:relative;display:flex;flex-direction:column;overflow:hidden}
.status{height:36px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;font-size:14px;font-weight:500;position:relative}
.status .ms{margin-left:4px}
.punch{position:absolute;left:50%;top:10px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#000}
.app{flex:1;display:flex;flex-direction:column;padding:16px;min-height:0}
.hdr{display:flex;align-items:center;background:${c.sc};border-radius:999px;padding:12px 16px;margin:0 8px 16px}
.cookie{display:flex;align-items:center;justify-content:center;flex:none}
.pill{border-radius:999px;padding:8px;display:flex}
.box{flex:1;min-height:0;background:${c.sc};margin:0 8px 8px;position:relative;display:flex;flex-direction:column;overflow:hidden}
.box.big{flex:1;margin:0}
.md{padding:64px 28px 0;font-size:16px;line-height:24px;letter-spacing:.2px}
.md p{margin-bottom:12px}.md ul{padding-left:22px;margin-bottom:12px}.md li{margin-bottom:8px}
.stats{display:flex;gap:8px;font-size:10px;color:${c.primary};margin-top:16px;flex-wrap:wrap}
.stats.hl{font-size:13px;gap:10px;padding:10px 14px;border-radius:14px;background:rgba(208,188,255,.12);border:1px solid rgba(208,188,255,.35);display:inline-flex}
.copy{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);background:rgba(20,18,24,.5);border-radius:36px;padding:24px;display:flex}
.opts{height:100px;flex:none;display:flex;align-items:center;gap:12px;padding:0 4px}
.opts .mid{flex:1;height:58px;border-radius:24px;background:${c.sch};display:flex;align-items:center;justify-content:center}
.field{flex:none;height:88px;border-radius:48px;background:${c.schh};border:1.5px solid ${c.onSurfaceVariant};display:flex;align-items:center;padding:0 12px 0 24px;gap:12px}
.tools{display:flex;align-items:center;justify-content:center;gap:28px;padding:28px 0 36px}
.loader{width:120px;height:120px;background:${c.primary}}
.rate{margin-top:48px;width:348px;border:1px solid ${c.surfaceVariant};border-radius:16px;padding:12px;display:flex;align-items:center;justify-content:center;gap:12px;color:${c.primary};font-size:12px;font-weight:500}
.nav{height:24px;flex:none;display:flex;align-items:center;justify-content:center}
.nav:after{content:'';width:108px;height:4px;border-radius:2px;background:${c.onSurface};opacity:.8}
`;

function deviceHtml({ x, y, w, h, radius, bezel, state, screenW = 412, rotate = 0 }) {
  const innerW = w - bezel * 2, scale = innerW / screenW, screenH = (h - bezel * 2) / scale;
  return `<div class="device" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${radius}px;transform:rotate(${rotate}deg)">
    <div style="position:absolute;left:${bezel}px;top:${bezel}px;width:${innerW}px;height:${h - bezel * 2}px;border-radius:${radius - bezel}px;overflow:hidden">
    <div class="scaler" style="transform:scale(${scale})">${screen(state, screenW, screenH)}</div></div></div>`;
}

// Screenshot copy: [eyebrow, headline, subline, app state]
const shots = [
  ['Private by design', 'Generative AI that <em>never leaves</em> your phone', 'Gemini Nano answers right on your device. Your prompts stay with you.', 'response'],
  ['On-device', 'Runs locally. <em>Works offline.</em>', 'No API keys and no cloud round trip once the model is on your phone.', 'thinking'],
  ['Playground', 'Prompt <em>anything</em>', 'Summaries, rewrites, ideas and haiku — try the model your phone already has.', 'prompt'],
  ['Share to Nano', 'Send text from <em>any app</em>', 'Share selected text straight into a prompt with the Android share sheet.', 'share'],
  ['For developers', 'See the <em>speed</em> of every answer', 'Inference time, output tokens and finish reason after each response.', 'stats'],
  ['Know your model', 'Check which <em>Nano</em> you have', 'See the Gemini Nano version running on your device at a glance.', 'info'],
];

function page(W, H, inner) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
  <div class="stage" style="width:${W}px;height:${H}px">${inner}</div></body></html>`;
}

function shotHtml(kind, [eyebrow, title, sub, state]) {
  if (kind === 'phone') { // 1080 x 1920
    const W = 1080, H = 1920, dw = 760, dh = dw * 892 / 412 + 40;
    return [W, H, page(W, H, `
      <div class="copyblock" style="left:90px;right:90px;top:120px;text-align:center">
        <div class="eyebrow" style="font-size:30px;padding:12px 26px">${eyebrow}</div>
        <h1 style="font-size:86px;margin-top:34px">${title}</h1>
        <p class="sub" style="font-size:36px;line-height:1.35;margin-top:28px">${sub}</p></div>
      ${deviceHtml({ x: (W - dw) / 2, y: 720, w: dw, h: dh, radius: 96, bezel: 20, state })}`)];
  }
  if (kind === 'tablet7') { // 1200 x 1920 is not 9:16, so 1080 x 1920 with a 7" (10:16) tablet
    const W = 1080, H = 1920, dw = 860, dh = dw * 1.6;
    return [W, H, page(W, H, `
      <div class="copyblock" style="left:80px;right:80px;top:110px;text-align:center">
        <div class="eyebrow" style="font-size:28px;padding:12px 24px">${eyebrow}</div>
        <h1 style="font-size:78px;margin-top:30px">${title}</h1>
        <p class="sub" style="font-size:34px;line-height:1.35;margin-top:24px">${sub}</p></div>
      ${deviceHtml({ x: (W - dw) / 2, y: 640, w: dw, h: dh, radius: 60, bezel: 26, state, screenW: 600 })}`)];
  }
  // tablet10: 1440 x 2560 (9:16), 10" tablet at 10:16
  const W = 1440, H = 2560, dw = 1180, dh = dw * 1.6;
  return [W, H, page(W, H, `
    <div class="copyblock" style="left:120px;right:120px;top:150px;text-align:center">
      <div class="eyebrow" style="font-size:38px;padding:16px 34px">${eyebrow}</div>
      <h1 style="font-size:108px;margin-top:40px">${title}</h1>
      <p class="sub" style="font-size:46px;line-height:1.35;margin-top:34px">${sub}</p></div>
    ${deviceHtml({ x: (W - dw) / 2, y: 860, w: dw, h: dh, radius: 76, bezel: 32, state, screenW: 800 })}`)];
}

function featureHtml() {
  const W = 1024, H = 500;
  return [W, H, page(W, H, `
    <div style="position:absolute;left:64px;top:96px;width:120px;height:120px;border-radius:30px;background:#F8F9FF;overflow:hidden">
      <div style="position:absolute;left:-22px;top:-20px;width:170px;height:170px">${mark}</div></div>
    <div class="copyblock" style="left:64px;top:244px;width:520px">
      <h1 style="font-size:56px">Nano Prompt <em>Ground</em></h1>
      <p class="sub" style="font-size:24px;line-height:1.4;margin-top:16px">Private, offline generative AI with Gemini Nano — right on your Android phone.</p></div>
    ${deviceHtml({ x: 640, y: 56, w: 300, h: 300 * 892 / 412 + 16, radius: 40, bezel: 8, state: 'response', rotate: -8 })}`)];
}

function iconHtml() {
  return [512, 512, `<!doctype html><html><head><style>*{margin:0}body{width:512px;height:512px;background:#F8F9FF;overflow:hidden}
  .m{position:absolute;left:-56px;top:-62px;width:640px;height:640px}</style></head><body><div class="m">${mark}</div></body></html>`];
}

const jobs = [
  ['icon-512.png', iconHtml()],
  ['feature-graphic-1024x500.png', featureHtml()],
  ...shots.map((s, i) => [`phone/${i + 1}-${s[3]}.png`, shotHtml('phone', s)]),
  ...shots.map((s, i) => [`tablet-7in/${i + 1}-${s[3]}.png`, shotHtml('tablet7', s)]),
  ...shots.map((s, i) => [`tablet-10in/${i + 1}-${s[3]}.png`, shotHtml('tablet10', s)]),
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
for (const [name, [w, h, html]] of jobs) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  mkdirSync(dirname(join(out, name)), { recursive: true });
  await p.screenshot({ path: join(out, name), clip: { x: 0, y: 0, width: w, height: h } });
  await p.close();
  console.log(name);
}
await browser.close();
