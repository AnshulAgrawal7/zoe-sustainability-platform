import { test, expect } from '@playwright/test';

test.describe('Project map', () => {
  test('toggling to map view shows a Leaflet map with markers', async ({ page }) => {
    await page.goto('/projects');
    // Wait for the project list to load from the API.
    await page.waitForTimeout(2000);

    await page
      .getByRole('button', { name: /^map$|^karte$|^χάρτης$/i })
      .click();

    // Leaflet renders its container + one marker per located project.
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible({
      timeout: 8000,
    });
  });

  test('the OpenStreetMap attribution is present (licence requirement)', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /^map$|^karte$|^χάρτης$/i }).click();
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 8000 });
    await expect(
      page.locator('.leaflet-control-attribution')
    ).toContainText(/OpenStreetMap/i);
  });
});
