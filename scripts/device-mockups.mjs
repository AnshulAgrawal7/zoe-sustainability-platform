// Geräte-Mockups: Screenshot in einem abgerundeten Handy-/Tablet-Rahmen
// (Notch/Kamera, Schatten, transparenter Hintergrund) als PNG.
// Nimmt den Screenshot live auf und rahmt ihn in einem Durchgang.
//
// Voraussetzung: Frontend (5173) + Backend (3001 → Supabase) laufen.
// Lauf:  node scripts/device-mockups.mjs
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.SHOT_BASE_URL || 'http://localhost:5173';
const OUT = 'docs/slides/mockups';
mkdirSync(OUT, { recursive: true });

const DEVICES = {
  phone: { vp: { width: 375, height: 812 }, dsf: 3 },
  tablet: { vp: { width: 834, height: 1112 }, dsf: 2 },
};

// Auswahl: Handy (Mehrsprachig + Dark) und Tablet (größeres Layout) → Heterogenität.
const shots = [
  { path: '/', lang: 'en', theme: 'light', device: 'phone', name: 'landing_en' },
  { path: '/', lang: 'el', theme: 'light', device: 'phone', name: 'landing_el' },
  { path: '/projects', lang: 'en', theme: 'dark', device: 'phone', name: 'projects_dark' },
  { path: '/', lang: 'de', theme: 'light', device: 'tablet', name: 'landing_de' },
  { path: '/projects', lang: 'en', theme: 'light', device: 'tablet', name: 'projects_en' },
  { path: '/sdg-dashboard', lang: 'el', theme: 'light', device: 'tablet', name: 'sdg_el' },
];

function frameHtml(dataUri, device, wCss, hCss) {
  const isPhone = device === 'phone';
  const bezel = isPhone ? 12 : 16;
  const radius = isPhone ? 50 : 36;
  const screenRadius = isPhone ? 40 : 22;
  const notch = isPhone
    ? `<div style="position:absolute;top:${bezel + 7}px;left:50%;transform:translateX(-50%);width:36%;height:26px;background:#05060a;border-radius:18px;z-index:3;"></div>`
    : `<div style="position:absolute;top:${bezel / 2 + 3}px;left:50%;transform:translateX(-50%);width:9px;height:9px;background:#1a1c22;border-radius:50%;z-index:3;"></div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;background:transparent}
    #shot{display:inline-block;padding:70px}
    .device{position:relative;background:#05060a;padding:${bezel}px;border-radius:${radius}px;
      box-shadow:0 34px 70px rgba(0,0,0,.38), 0 10px 24px rgba(0,0,0,.28);}
    .screen{position:relative;width:${wCss}px;height:${hCss}px;border-radius:${screenRadius}px;
      overflow:hidden;background:#fff;display:block}
    .screen img{width:100%;height:100%;display:block;object-fit:fill}
  </style></head><body>
    <div id="shot"><div class="device">
      ${notch}
      <div class="screen"><img src="${dataUri}"/></div>
    </div></div>
  </body></html>`;
}

const browser = await chromium.launch();
let ok = 0;
for (const s of shots) {
  const d = DEVICES[s.device];
  const ctx = await browser.newContext({
    viewport: d.vp,
    deviceScaleFactor: d.dsf,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });
  await ctx.addInitScript(
    ([lang, theme]) => {
      localStorage.setItem('zoe-language', lang);
      localStorage.setItem('zoe-theme', theme);
    },
    [s.lang, s.theme],
  );
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + s.path, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(700);
    const buf = await page.screenshot({ fullPage: false });
    await ctx.close();

    const dataUri = 'data:image/png;base64,' + buf.toString('base64');
    const wCss = s.device === 'phone' ? 300 : 540;
    const hCss = Math.round(wCss * (d.vp.height / d.vp.width));
    const fctx = await browser.newContext({ deviceScaleFactor: 3 });
    const fpage = await fctx.newPage();
    await fpage.setContent(frameHtml(dataUri, s.device, wCss, hCss), { waitUntil: 'load' });
    const el = await fpage.$('#shot');
    const file = `${OUT}/${s.device}_${s.name}.png`;
    await el.screenshot({ path: file, omitBackground: true });
    await fctx.close();
    console.log('OK  ', file);
    ok++;
  } catch (e) {
    console.error('FAIL', s.name, '-', e.message);
    try {
      await ctx.close();
    } catch {
      /* noop */
    }
  }
}
await browser.close();
console.log(`\n${ok}/${shots.length} Geräte-Mockups in ${OUT}/`);
