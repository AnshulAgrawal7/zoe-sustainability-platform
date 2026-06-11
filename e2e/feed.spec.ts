import { test, expect } from '@playwright/test';

test.describe("What's New feed", () => {
  test('shows merged feed items and filters by category + completed events', async ({
    page,
  }) => {
    await page.goto('/news');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Imported Facebook posts (+ project posts) render as cards.
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    // Filter to Events.
    await page
      .getByRole('button', { name: /^event$|^termin$|^εκδήλωση$/i })
      .click();
    await expect(cards.first()).toBeVisible();

    // "Completed events" toggle keeps only completed events (all imported
    // events are completed) — still shows results.
    await page
      .getByRole('button', {
        name: /completed events|abgeschlossene termine|ολοκληρωμένες εκδηλώσεις/i,
      })
      .click();
    await expect(cards.first()).toBeVisible();
  });
});
