//tests/assertions/product-page.spec.js
import { test, expect } from '@playwright/test';

test('Product cards should display correctly', async ({ page }) => {

  await page.goto('http://localhost:5173/items');

  const productTitle = page.locator('h3').first();
  const viewButton = page.getByRole('link', { name: 'View Details' }).first();

  await expect(productTitle).toBeVisible();
  await expect(viewButton).toBeVisible();

});
//this tests verifies that the product cards are visible on the product page.