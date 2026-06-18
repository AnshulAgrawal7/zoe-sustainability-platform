import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';

// Use Windows Chrome on WSL2 if available
const WINDOWS_CHROME = '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe';
const useWindowsChrome = existsSync(WINDOWS_CHROME);

export default defineConfig({
  testDir: './e2e',
  // Remove E2E-created test ideas/comments from the persistent DB after the run.
  globalTeardown: './e2e/global-teardown.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...(useWindowsChrome && {
      executablePath: WINDOWS_CHROME,
    }),
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(useWindowsChrome && {
          executablePath: WINDOWS_CHROME,
        }),
      },
    },
  ],
  webServer: [
    {
      command: 'cd backend && npm run dev',
      url: 'http://localhost:3001/api/projects',
      reuseExistingServer: !process.env.CI,
      // Generous on a cold CI runner (ts-node-dev / first Vite build); locally
      // this is just a max wait, so it never slows a warm server down.
      timeout: 120 * 1000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      // Generous on a cold CI runner (ts-node-dev / first Vite build); locally
      // this is just a max wait, so it never slows a warm server down.
      timeout: 120 * 1000,
    },
  ],
});
