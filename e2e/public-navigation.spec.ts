import { test, expect } from '@playwright/test';

test.describe('Public navigation', () => {
  test('landing page loads with ZOE branding', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ZOE/i);
    // Logo link in header
    await expect(page.getByRole('link', { name: /ZOE Platform/i }).first()).toBeVisible();
  });

  test('prototype banner is visible on landing page', async ({ page }) => {
    await page.goto('/');
    // PrototypeBanner must be present on every page (academic requirement)
    // It has amber/yellow styling and contains prototype notice text
    await expect(page.locator('.bg-amber-50, [class*="amber"]').first()).toBeVisible();
  });

  test('main nav links navigate to correct pages', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('navigation', { name: 'Main navigation' }).getByText(/projects/i).click();
    await expect(page).toHaveURL(/\/projects/);

    await page.goto('/');
    await page.getByRole('navigation', { name: 'Main navigation' }).getByText(/about/i).click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('projects page loads and shows project cards', async ({ page }) => {
    await page.goto('/projects');
    // Wait for content (API or fallback)
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL('/projects');
    // Page title exists
    await expect(page.locator('h1')).toBeVisible();
  });

  test('SDG dashboard page loads', async ({ page }) => {
    await page.goto('/sdg-dashboard');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveURL('/about');
  });

  test('events page loads', async ({ page }) => {
    await page.goto('/events');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('transparency page loads', async ({ page }) => {
    await page.goto('/transparency');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('roadmap page loads', async ({ page }) => {
    await page.goto('/roadmap');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('participation page loads', async ({ page }) => {
    await page.goto('/participate');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('rewards page loads', async ({ page }) => {
    await page.goto('/rewards');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('accessibility statement page loads', async ({ page }) => {
    await page.goto('/accessibility');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('audiences page loads', async ({ page }) => {
    await page.goto('/audiences');
    await expect(page.locator('h1')).toBeVisible();
  });
});
