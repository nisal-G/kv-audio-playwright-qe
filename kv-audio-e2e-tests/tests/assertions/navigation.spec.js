//tests/assertions/navigation.spec.js

import { test, expect } from '@playwright/test';

test('Header navigation links work', async ({ page }) => {

  // Navigate to the homepage
  await page.goto('http://localhost:5173');

  // Click the "Items" link in the navigation bar
  await page.getByRole('link', { name: 'Items' }).first().click();

  // Assertion: Verify that the URL changes to the items page
  await expect(page).toHaveURL(/items/);
});

// This test verifies that when a user clicks the "Items" navigation link,
// they are redirected to the correct product listing page.
