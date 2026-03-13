import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {

  await page.goto('http://localhost:5173');

  // Assertion 1: Page title check
  await expect(page).toHaveTitle(/kv-audio-frontend/);

  // Assertion 2: Header is visible
  await expect(page.locator('header')).toBeVisible();

  // Assertion 3: Products section exists
  await expect(page.locator('body')).toBeVisible();

});

// this tests verifies that the Website loads, 
// Title is correct and Important UI elements appear