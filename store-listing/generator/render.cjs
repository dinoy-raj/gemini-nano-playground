// Renders every store image from index.html with Playwright.
// Usage (from repo root): NODE_PATH=$(npm root -g) node store-listing/generator/render.cjs
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'fastlane/metadata/android/en-US/images');
const PAGE = 'file://' + path.join(__dirname, 'index.html');

const JOBS = [
  { mode: 'phone', dir: 'phoneScreenshots', scale: 1 },          // 1080 x 1920
  { mode: 'tab7', dir: 'sevenInchScreenshots', scale: 1 },       // 1920 x 1080
  { mode: 'tab10', dir: 'tenInchScreenshots', scale: 4 / 3 },    // 2560 x 1440
  { mode: 'desktop', dir: 'desktopScreenshots', scale: 4 / 3 },  // 2560 x 1440
  { mode: 'feature', file: 'featureGraphic.png', scale: 1 },     // 1024 x 500
];

(async () => {
  const only = process.argv[2];
  const browser = await chromium.launch();
  for (const job of JOBS) {
    if (only && job.mode !== only) continue;
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: job.scale });
    await page.goto(`${PAGE}?mode=${job.mode}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const { W, H, n } = await page.evaluate(() => window.FRAME);
    await page.setViewportSize({ width: W * n, height: H });
    await page.waitForTimeout(300);
    for (let i = 0; i < n; i++) {
      const file = job.file ? path.join(OUT, job.file) : path.join(OUT, job.dir, `${i + 1}.png`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      await page.screenshot({ path: file, clip: { x: i * W, y: 0, width: W, height: H } });
      console.log(path.relative(ROOT, file));
    }
    await page.close();
  }
  await browser.close();
})();
