import { test, expect } from '@playwright/test';

test.describe('Learning resources (Z5)', () => {
  test('learn page lists resources; detail shows content and a project link', async ({
    page,
  }) => {
    await page.goto('/learn');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Open a seeded resource via its "Read more" link
    await page
      .getByRole('link', {
        name: /read more|mehr erfahren|διαβάστε περισσότερα/i,
      })
      .first()
      .click();
    await page.waitForURL(/\/learn\/.+/);

    // Detail renders the content article and a link back to the related project
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('article')).toBeVisible();
    await expect(
      page.getByRole('link', { name: /projects\/|related project/i }).first()
    ).toBeTruthy();
  });
});
