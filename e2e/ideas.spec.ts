import { test, expect, type Page } from '@playwright/test';

const ADMIN = { email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' };

// Submit an idea on /participate (anonymously). Pass an email to fill the
// optional email field, or omit it for a fully anonymous submission.
async function submitIdea(
  page: Page,
  title: string,
  category: string,
  email?: string
) {
  await page.goto('/participate');
  await page.getByRole('button', { name: /submit an idea/i }).click();
  await page.fill('#idea-title', title);
  await page.selectOption('#idea-category', category);
  await page.fill('#idea-message', 'Automated end-to-end idea submission.');
  if (email) await page.fill('#idea-email', email);
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByText(/submitted to the municipality/i)).toBeVisible({
    timeout: 10000,
  });
}

// Log in as admin and open /admin/ideas via in-app navigation (a hard reload
// would drop the in-memory access token).
async function gotoAdminIdeas(page: Page) {
  await page.goto('/login');
  await page.fill('#email', ADMIN.email);
  await page.fill('#password', ADMIN.password);
  await page.getByRole('button', { name: /sign in|log in|anmelden/i }).click();
  await page.waitForURL('/dashboard', { timeout: 10000 });
  await page.getByRole('button', { name: /account/i }).click();
  await page.getByRole('menuitem', { name: /admin/i }).click();
  await page.waitForURL('/admin', { timeout: 5000 });
  await page.getByRole('link', { name: /citizen ideas/i }).click();
  await page.waitForURL('/admin/ideas', { timeout: 5000 });
}

test.describe('Citizen ideas (Z3)', () => {
  test('submission appears in admin; reply mailto link only when an email was given', async ({
    page,
  }) => {
    const stamp = Date.now();
    const anonTitle = `E2E anon ${stamp}`;
    const emailTitle = `E2E email ${stamp}`;
    const replyEmail = `reply-${stamp}@example.com`;

    // Anonymous, no email
    await submitIdea(page, anonTitle, 'ENVIRONMENT');
    // Anonymous but with an optional reply email
    await submitIdea(page, emailTitle, 'COMMUNITY', replyEmail);

    await gotoAdminIdeas(page);

    // Anonymous-without-email idea: listed, but no mailto reply link in its row
    const anonRow = page.locator('li').filter({ hasText: anonTitle });
    await expect(anonRow).toBeVisible();
    await expect(anonRow.locator('a[href^="mailto:"]')).toHaveCount(0);

    // Idea with email: a mailto link to that address is present
    const emailRow = page.locator('li').filter({ hasText: emailTitle });
    await expect(emailRow).toBeVisible();
    await expect(
      emailRow.locator(`a[href^="mailto:${replyEmail}"]`)
    ).toBeVisible();
  });

  test('public board shows an idea only after the admin approves it (pre-moderation)', async ({
    page,
  }) => {
    const stamp = Date.now();
    const title = `E2E board ${stamp}`;

    // Citizen submits an idea (status NEW)
    await submitIdea(page, title, 'ENVIRONMENT');

    // Before approval: the public board must NOT show it
    await page.goto('/ideas');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(title)).toHaveCount(0);

    // Admin approves it (sets status ACCEPTED via the row's status select)
    await gotoAdminIdeas(page);
    const row = page.locator('li').filter({ hasText: title });
    await expect(row).toBeVisible();
    await row.locator('select').selectOption('ACCEPTED');
    await page.waitForTimeout(800); // let the PATCH persist

    // After approval: it appears on the public board
    await page.goto('/ideas');
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
  });
});
