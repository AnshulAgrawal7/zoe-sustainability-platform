import { test, expect } from '@playwright/test';

const ADMIN = { email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' };

test.describe('Citizen ideas (Z3)', () => {
  test('anonymous submission appears in the admin ideas list', async ({
    page,
  }) => {
    const title = `E2E idea ${Date.now()}`;

    // 1) Submit anonymously on /participate (no login)
    await page.goto('/participate');
    await page.getByRole('button', { name: /submit an idea/i }).click();

    await page.fill('#idea-title', title);
    await page.selectOption('#idea-category', 'ENVIRONMENT');
    await page.fill('#idea-message', 'Automated end-to-end idea submission.');
    await page.locator('form button[type="submit"]').click();

    // Success confirmation (no account required)
    await expect(
      page.getByText(/submitted to the municipality/i)
    ).toBeVisible({ timeout: 10000 });

    // 2) Log in as admin, then navigate IN-APP (client-side) so the in-memory
    //    access token is kept — a hard reload would drop it.
    await page.goto('/login');
    await page.fill('#email', ADMIN.email);
    await page.fill('#password', ADMIN.password);
    await page
      .getByRole('button', { name: /sign in|log in|anmelden/i })
      .click();
    await page.waitForURL('/dashboard', { timeout: 10000 });

    await page.getByRole('button', { name: /account/i }).click();
    await page.getByRole('menuitem', { name: /admin/i }).click();
    await page.waitForURL('/admin', { timeout: 5000 });
    await page.getByRole('link', { name: /citizen ideas/i }).click();
    await page.waitForURL('/admin/ideas', { timeout: 5000 });

    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
  });
});
