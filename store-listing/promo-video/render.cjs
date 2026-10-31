// Renders index.html to an MP4: seeks the HyperFrames timeline frame by frame with Playwright
// and pipes the frames into FFmpeg, so no frame is dropped.
// Usage (from repo root): NODE_PATH=$(npm root -g) node store-listing/promo-video/render.cjs [out.mp4] [--frames 0,90,300]
const path = require('path');
const fs = require('fs');
const { spawn, execFileSync } = require('child_process');
const { chromium } = require('playwright');

const FPS = 30, W = 1920, H = 1080;
const DIR = __dirname;
const args = process.argv.slice(2);
const stills = args.includes('--frames') ? args[args.indexOf('--frames') + 1].split(',').map(Number) : null;
const OUT = path.resolve(args.find(a => a.endsWith('.mp4')) || path.join(DIR, 'out/nano-prompt-ground-promo.mp4'));

// Fonts are fetched once (Chromium can't always reach Google Fonts directly) and kept out of Git.
const FONTS = {
  'Inter-latin.woff2': ['Inter:wght@100..900', '/* latin */'],
  'JetBrainsMono-latin.woff2': ['JetBrains+Mono:wght@100..800', '/* latin */'],
};
function ensureFonts() {
  const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
  fs.mkdirSync(path.join(DIR, 'fonts'), { recursive: true });
  for (const [file, [family, subset]] of Object.entries(FONTS)) {
    const dest = path.join(DIR, 'fonts', file);
    if (fs.existsSync(dest)) continue;
    const css = execFileSync('curl', ['-sSL', '-A', ua, `https://fonts.googleapis.com/css2?family=${family}&display=block`]).toString();
    const block = subset ? css.slice(css.indexOf(subset)) : css;
    const url = block.match(/url\((https:[^)]+)\)/)[1];
    execFileSync('curl', ['-sSL', '-o', dest, url]);
    console.log('fetched', file);
  }
}

(async () => {
  ensureFonts();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(DIR, 'index.html'), { waitUntil: 'load' });
  await page.evaluate(() => window.__ready);
  const duration = await page.evaluate(() => window.__timelines.root.duration());
  const frames = stills || Array.from({ length: Math.round(duration * FPS) }, (_, i) => i);

  let ffmpeg;
  if (!stills) {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    ffmpeg = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  }
  for (const [n, f] of frames.entries()) {
    await page.evaluate(t => window.__seek(t), f / FPS);
    const png = await page.screenshot({ type: 'png' });
    if (stills) fs.writeFileSync(path.join(DIR, `out/frame-${String(f).padStart(4, '0')}.png`), png);
    else if (!ffmpeg.stdin.write(png)) await new Promise(r => ffmpeg.stdin.once('drain', r));
    if (!stills && n % 60 === 0) process.stdout.write(`\rframe ${n}/${frames.length}`);
  }
  await browser.close();
  if (ffmpeg) {
    ffmpeg.stdin.end();
    await new Promise((res, rej) => ffmpeg.on('close', c => c ? rej(new Error('ffmpeg exited ' + c)) : res()));
    console.log('\n' + path.relative(process.cwd(), OUT));
  }
})();
