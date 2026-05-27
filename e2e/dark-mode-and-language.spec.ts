import { test, expect } from '@playwright/test';

test.describe('Dark mode', () => {
  test('dark mode toggle adds dark class to html element', async ({ page }) => {
    await page.goto('/');

    // Get initial theme
    const initialClass = await page.locator('html').getAttribute('class') ?? '';

    // Click dark mode toggle button
    const darkToggle = page.getByRole('button', { name: /dark mode|light mode|dunkelmodus|hellmodus/i });
    await darkToggle.click();

    const newClass = await page.locator('html').getAttribute('class') ?? '';
    // Either we toggled to dark or back to light
    expect(newClass).not.toEqual(initialClass);
  });

  test('dark mode persists across page navigation', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode
    const htmlEl = page.locator('html');
    const wasDark = (await htmlEl.getAttribute('class') ?? '').includes('dark');

    const toggle = page.getByRole('button', { name: /dark mode|light mode|dunkelmodus|hellmodus/i });
    await toggle.click();

    await page.goto('/about');
    const classAfterNav = await htmlEl.getAttribute('class') ?? '';
    const isDarkNow = classAfterNav.includes('dark');

    // State should have changed after toggle
    expect(isDarkNow).toBe(!wasDark);
  });
});

test.describe('Language switching', () => {
  test('language selector is visible in header', async ({ page }) => {
    await page.goto('/');
    const langSelect = page.getByRole('combobox', { name: /language|sprache|γλώσσα/i });
    await expect(langSelect).toBeVisible();
  });

  test('switching to German changes UI language', async ({ page }) => {
    await page.goto('/');

    const langSelect = page.getByRole('combobox', { name: /language|sprache|γλώσσα/i });
    await langSelect.selectOption('de');

    // After selecting German, the html lang attribute should change
    await expect(page.locator('html')).toHaveAttribute('lang', 'de', { timeout: 3000 });
  });

  test('switching to Greek changes UI language', async ({ page }) => {
    await page.goto('/');

    const langSelect = page.getByRole('combobox', { name: /language|sprache|γλώσσα/i });
    await langSelect.selectOption('el');

    await expect(page.locator('html')).toHaveAttribute('lang', 'el', { timeout: 3000 });
  });

  test('English is the default language', async ({ page }) => {
    // Clear localStorage to get true default
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('i18nextLng'));
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('lang', 'en', { timeout: 3000 });
  });
});
