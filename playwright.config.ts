import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration - Portafolio de Juan
 * Targets production deployment
 * Uses @mobile tag to separate mobile-only tests from desktop
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  timeout: 30_000,
  
  expect: {
    timeout: 5_000,
  },
  
  fullyParallel: true,
  
  forbidOnly: !!process.env.CI,
  
  retries: process.env.CI ? 2 : 0,
  
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['list'],
    ['html'],
  ],
  
  use: {
    // Production URL
    baseURL: process.env.BASE_URL || 'https://portafolio-fotografia.onrender.com',
    
    trace: 'retain-on-failure',
    
    screenshot: 'only-on-failure',
    
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
      // Run everything EXCEPT @mobile tests
      grepInvert: /@mobile/i,
    },

    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      // Run ONLY @mobile tests
      grep: /@mobile/i,
    },
  ],
});
