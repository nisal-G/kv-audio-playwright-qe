import { test, expect } from '@playwright/test';

test('intentional fail - wrong title check', async ({ page }) => {
  await page.goto('/');
  
  // This WILL FAIL because the title is "KV Audio", not "Google"
  await expect(page).toHaveTitle('Google');
});