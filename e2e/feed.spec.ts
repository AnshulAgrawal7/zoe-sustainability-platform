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

  test('opens an entry detail page (full body) and the image lightbox', async ({
    page,
  }) => {
    await page.goto('/news');
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    // The card title is the single navigation link → detail page.
    await cards.first().getByRole('link').first().click();
    await expect(page).toHaveURL(/\/news\/(feed|project)\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: /back to the feed|zurück zum feed|πίσω στη ροή/i,
      })
    ).toBeVisible();

    // If the entry has a gallery, opening a thumbnail shows an accessible
    // dialog; ESC closes it and restores the page.
    const thumb = page
      .getByRole('button', {
        name: /open image|bild .* öffnen|άνοιγμα εικόνας/i,
      })
      .first();
    if (await thumb.count()) {
      await thumb.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
  });
});
