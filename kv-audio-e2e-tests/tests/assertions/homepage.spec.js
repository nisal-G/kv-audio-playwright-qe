import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {

  // Navigate to the homepage
  await page.goto('http://localhost:5173');

  // Assertion: Verify the page title contains the project name
  await expect(page).toHaveTitle(/kv-audio-frontend/);

  // Assertion: Check if the header section is visible
  await expect(page.locator('header')).toBeVisible();

  // Assertion: Check if the body of the page is visible
  await expect(page.locator('body')).toBeVisible();

});

// This test verifies that:
// 1. The website loads successfully
// 2. The page title is correct
// 3. Important UI components such as header and body are visible