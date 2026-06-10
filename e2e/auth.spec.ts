import { test, expect } from '@playwright/test';

const CITIZEN = { email: 'citizen1@example.com', password: 'Test1234!' };
const ADMIN = { email: 'admin@zoe-corfu.gr', password: 'ZoeAdmin2026!' };

test.describe('Authentication', () => {
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|log in|anmelden/i })).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'WrongPass123!');
    await page.getByRole('button', { name: /sign in|log in|anmelden/i }).click();
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });
  });

  test('citizen login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', CITIZEN.email);
    await page.fill('#password', CITIZEN.password);
    await page.getByRole('button', { name: /sign in|log in|anmelden/i }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('dashboard shows citizen info after login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', CITIZEN.email);
    await page.fill('#password', CITIZEN.password);
    await page.getByRole('button', { name: /sign in|log in|anmelden/i }).click();
    await page.waitForURL('/dashboard', { timeout: 10000 });
    // Dashboard content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('logout clears session and protected routes redirect to login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('#email', CITIZEN.email);
    await page.fill('#password', CITIZEN.password);
    await page.getByRole('button', { name: /sign in|anmelden/i }).click();
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Open the account menu, then log out (both live inside the UserMenu dropdown)
    await page.getByRole('button', { name: /account/i }).click();
    await page.getByRole('menuitem', { name: /logout|abmelden/i }).click();

    // After logout, user is redirected away from dashboard (to '/' or '/login')
    await page.waitForURL(/\/(login)?$/, { timeout: 5000 });

    // Dashboard no longer accessible — should redirect to login
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    // Button text is "Create account" (auth.registerButton translation)
    await expect(page.getByRole('button', { name: /create account|registrieren/i })).toBeVisible();
  });
});

test.describe('Admin authentication', () => {
  test('admin login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', ADMIN.email);
    await page.fill('#password', ADMIN.password);
    await page.getByRole('button', { name: /sign in|log in|anmelden/i }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
  });

  test('admin can navigate to admin panel', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', ADMIN.email);
    await page.fill('#password', ADMIN.password);
    await page.getByRole('button', { name: /sign in|log in|anmelden/i }).click();
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Admin link lives inside the account menu dropdown
    await page.getByRole('button', { name: /account/i }).click();
    await page.getByRole('menuitem', { name: /admin/i }).click();
    await expect(page).toHaveURL('/admin', { timeout: 5000 });
    await expect(page.locator('h1')).toBeVisible();
  });
});
