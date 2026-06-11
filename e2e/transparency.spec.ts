import { test, expect } from '@playwright/test';

test.describe('Documented impact (Z1)', () => {
  test('transparency page shows a real, sourced impact figure', async ({
    page,
  }) => {
    await page.goto('/transparency');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // A seeded, documented figure (LED luminaires upgraded) is rendered.
    await expect(page.getByText('4,866').first()).toBeVisible({
      timeout: 10000,
    });
  });
});
