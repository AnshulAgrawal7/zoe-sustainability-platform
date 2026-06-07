// Mobile-Screenshots (375px) für die Präsentation/Folie + Bericht.
// Setzt Sprache (zoe-language) und Theme (zoe-theme) vor dem Laden per localStorage,
// damit i18n/Theme robust greifen (kein brüchiges UI-Klicken).
//
// Voraussetzung: Frontend (5173) + Backend (3001 → Supabase) laufen.
// Lauf:  node scripts/mobile-screenshots.mjs
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.env.SHOT_BASE_URL || 'http://localhost:5173';
const OUT = 'docs/slides/mobile';
mkdirSync(OUT, { recursive: true });

// Auswahl: Mehrsprachigkeit (EN/EL/DE) + Kernseiten + Dark Mode → belegt Heterogenität.
const shots = [
  { path: '/', lang: 'en', theme: 'light', name: 'landing_en' },
  { path: '/', lang: 'el', theme: 'light', name: 'landing_el' },
  { path: '/', lang: 'de', theme: 'light', name: 'landing_de' },
  { path: '/projects', lang: 'en', theme: 'light', name: 'projects_en' },
  { path: '/sdg-dashboard', lang: 'en', theme: 'light', name: 'sdg_en' },
  { path: '/participate', lang: 'el', theme: 'light', name: 'participate_el' },
  { path: '/accessibility', lang: 'de', theme: 'light', name: 'accessibility_de' },
  { path: '/projects', lang: 'en', theme: 'dark', name: 'projects_en_dark' },
];

const browser = await chromium.launch();
let okCount = 0;
for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
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
    await page.waitForTimeout(700); // i18n/Animationen setzen lassen
    const file = `${OUT}/mobile-375_${s.name}.png`;
    await page.screenshot({ path: file, fullPage: false }); // Viewport = „Handy-Screen"-Look
    console.log('OK  ', file);
    okCount++;
  } catch (e) {
    console.error('FAIL', s.name, '-', e.message);
  } finally {
    await ctx.close();
  }
}
await browser.close();
console.log(`\n${okCount}/${shots.length} Screenshots in ${OUT}/`);
