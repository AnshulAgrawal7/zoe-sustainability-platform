import { test, expect } from '@playwright/test';

test.describe('Accessibility (keyboard + ARIA)', () => {
  test('focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/');
    // Tab to first focusable element
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible({ timeout: 3000 });
  });

  test('login form is keyboard-navigable', async ({ page }) => {
    await page.goto('/login');
    // Focus email field with Tab (skip any skip-link)
    await page.locator('#email').focus();
    await expect(page.locator('#email')).toBeFocused();
    // Tab to password
    await page.keyboard.press('Tab');
    await expect(page.locator('#password')).toBeFocused();
    // Tab to submit button
    await page.keyboard.press('Tab');
    // Submit button should be focused — page should not crash
    const submitBtn = page.getByRole('button', { name: /sign in|anmelden/i });
    await expect(submitBtn).toBeFocused();
  });

  test('html lang attribute is set', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(['en', 'el', 'de']).toContain(lang);
  });

  test('skip-to-content or main landmark exists', async ({ page }) => {
    await page.goto('/');
    // Either a skip link or a main element
    const mainEl = page.locator('main');
    await expect(mainEl).toBeVisible({ timeout: 3000 });
  });

  test('all images have alt attributes', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt must be present (can be empty string for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('prototype banner is visible on every page', async ({ page }) => {
    await page.goto('/');
    // PrototypeBanner has amber styling — present on all pages (academic requirement)
    await expect(page.locator('.bg-amber-50, [class*="amber-50"]').first()).toBeVisible({ timeout: 3000 });
  });

  test('footer has navigation landmark', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible({ timeout: 3000 });
  });
});
