import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {

  await page.goto('http://localhost:5173');

  await expect(page).toHaveTitle(/kv-audio-frontend/);

  await expect(page.locator('header')).toBeVisible();

  await expect(page.locator('body')).toBeVisible();

});

// this tests verifies that the Website loads, 
// Title is correct and Important UI elements appear