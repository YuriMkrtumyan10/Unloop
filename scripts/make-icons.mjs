// Renders the app icons (PNG) from the logo mark with the preinstalled Chromium.
// Usage: node scripts/make-icons.mjs
import { chromium } from "playwright";

const mark = (size, pad) => `<!doctype html><html><body style="margin:0;background:#131210;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center">
<svg width="${size * (1 - pad * 2)}" viewBox="0 0 132 72" fill="none">
<path d="M8 36c0-15 12-27 27-27s27 12 27 27-12 27-27 27c-9 0-14-4-18-9" stroke="#3A3631" stroke-width="10" stroke-linecap="round"/>
<path d="M17 54C30 70 70 60 88 36s18-22 36-26" stroke="#C8F03C" stroke-width="10" stroke-linecap="round"/>
<circle cx="124" cy="10" r="7" fill="#C8F03C"/></svg></body></html>`;

const icons = [
  ["public/icons/icon-192.png", 192, 0.12],
  ["public/icons/icon-512.png", 512, 0.12],
  ["public/icons/icon-maskable-512.png", 512, 0.22],
  ["src/app/apple-icon.png", 180, 0.14],
  ["src/app/icon.png", 64, 0.06],
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
for (const [file, size, pad] of icons) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(mark(size, pad));
  await page.screenshot({ path: file });
  await page.close();
}
await browser.close();
