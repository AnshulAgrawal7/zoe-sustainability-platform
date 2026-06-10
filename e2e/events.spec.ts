import { test, expect } from '@playwright/test';

// NOTE: this app keeps auth in memory only (no persistence/refresh-on-load), so a
// hard navigation (`page.goto`) after login is effectively logged out. Admin/user
// flows therefore navigate CLIENT-SIDE (React Router <Link> clicks) to keep the
// session, instead of page.goto into protected routes.

test.describe('Events (public)', () => {
  test('events page loads and renders content', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1500);
    expect(await page.locator('main').isVisible()).toBe(true);
  });

  test('a seeded event appears on its linked project detail', async ({ page }) => {
    // evt-cleanup-jun25 is seeded against proj-marine (public, no auth needed).
    await page.goto('/projects/proj-marine');
    await expect(
      page.getByRole('heading', {
        name: /events for this project|termine zu diesem projekt|εκδηλώσεις για αυτό το έργο/i,
      })
    ).toBeVisible({ timeout: 8000 });
  });
});

test.describe('Admin event management', () => {
  const ADMIN = { email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' };

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', ADMIN.email);
    await page.fill('#password', ADMIN.password);
    await page.getByRole('button', { name: /sign in|anmelden|σύνδεση/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  });

  test('admin creates an event linked to a project (single session)', async ({ page }) => {
    // Navigate client-side so the in-memory admin session survives.
    await page.getByRole('button', { name: /account menu|kontomenü|μενού λογαριασμού/i }).click();
    await page.getByRole('menuitem', { name: /^admin/i }).click();
    await page.waitForURL('**/admin', { timeout: 10000 });

    await page.getByRole('link', { name: /manage events|termine verwalten|διαχείριση εκδηλώσεων/i }).click();
    await page.waitForURL('**/admin/events', { timeout: 10000 });

    await page.getByRole('link', { name: /create event|termin anlegen|δημιουργία εκδήλωσης/i }).click();
    await page.waitForURL('**/admin/events/new', { timeout: 10000 });

    const stamp = Date.now();
    const titleEn = `E2E Cleanup ${stamp}`;
    await page.fill('#event-title-en', titleEn);
    await page.fill('#event-title-el', `E2E Καθαρισμός ${stamp}`);
    await page.fill('#event-title-de', `E2E Reinigung ${stamp}`);
    await page.fill('#event-desc-en', 'An end-to-end test event.');
    await page.fill('#event-desc-el', 'Δοκιμαστική εκδήλωση.');
    await page.fill('#event-desc-de', 'Eine Testveranstaltung.');
    await page.fill('#event-date', '2026-12-01T10:00');
    await page.selectOption('#event-project', 'proj-marine');

    await page.getByRole('button', { name: /save changes|änderungen speichern|αποθήκευση/i }).click();
    await page.waitForURL('**/admin/events', { timeout: 10000 });
    await expect(page.getByText(titleEn)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Event participation', () => {
  const USER = { email: 'citizen1@example.com', password: 'Test1234!' };

  test('a logged-in user joins an event and sees confirmation', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', USER.email);
    await page.fill('#password', USER.password);
    await page.getByRole('button', { name: /sign in|anmelden|σύνδεση/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Client-side nav to /events via the Discover dropdown (keeps the session).
    await page.getByRole('button', { name: /discover|entdecken|ανακάλυψη/i }).click();
    await page.getByRole('menuitem', { name: /events|termine|εκδηλώσεις/i }).click();
    await page.waitForURL('**/events', { timeout: 10000 });
    await page.waitForTimeout(1500);

    // Logged-in users get a one-click "Register" button that joins + earns points.
    const joinButton = page.getByRole('button', { name: /^register$|^anmelden$|^εγγραφή$/i }).first();
    await joinButton.click();
    await expect(page.getByRole('status').first()).toBeVisible({ timeout: 5000 });
  });
});
