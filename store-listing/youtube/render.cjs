// Renders the YouTube upload kit: thumbnail.jpg (1280 x 720) and an upload-ready MP4 per promo render
// (video stream copied, soundtrack re-encoded from the WAV as 48 kHz AAC, as YouTube recommends).
// Usage (from repo root, after promo-video/render.cjs): NODE_PATH=$(npm root -g) node store-listing/youtube/render.cjs
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const DIR = __dirname;
const PROMO = path.join(DIR, '../promo-video/out');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('file://' + path.join(DIR, 'thumbnail.html'), { waitUntil: 'load' });
  await page.evaluate(() => window.__ready);
  const png = path.join(DIR, 'thumbnail.png');
  await page.screenshot({ path: png });
  await browser.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-q:v', '2', path.join(DIR, 'thumbnail.jpg')]);
  fs.unlinkSync(png);
  console.log('thumbnail.jpg');

  const wav = path.join(PROMO, 'soundtrack.wav');
  if (!fs.existsSync(wav)) execFileSync('python3', [path.join(DIR, '../promo-video/music.py'), wav], { stdio: 'inherit' });
  for (const f of fs.readdirSync(PROMO).filter(f => /^nano-prompt-ground-promo.*\.mp4$/.test(f))) {
    const out = path.join(DIR, f.replace('nano-prompt-ground-promo', 'youtube-upload'));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(PROMO, f), '-i', wav, '-map', '0:v', '-map', '1:a',
      '-c:v', 'copy', '-c:a', 'aac', '-ar', '48000', '-b:a', '320k', '-shortest', '-movflags', '+faststart', out]);
    console.log(path.basename(out));
  }
})();
