import { defineConfig, devices } from '@playwright/test';

// devices - contains predefined browser/device settings (Chrome, Firefox, Safari)
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests', // test files location
  timeout: 60 * 1000, // increased timeout to 60s
  fullyParallel: false, // DISABLED parallel to reduce memory usage
  retries: process.env.CI ? 2 : 0,
  workers: 1, // LIMIT to 1 worker to prevent memory issues

  // add html report and it not automatically open after execute tests
  reporter: [
    ['list'], // show progress in console
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'http://localhost:5173', // url that always use by playwright
    trace: 'on-first-retry',
    screenshot: 'only-on-failure', // capture screen shots in failure points
    video: 'off', // DISABLED video to save memory
  },

  // Test only Chromium to reduce memory usage
  // Uncomment other browsers when needed
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    //  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // WebServer disabled - start manually before running tests
  // To start: cd kv-audio-frontend && npm run dev
  // webServer: {
  //   command: 'cd ../kv-audio-frontend && npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
});