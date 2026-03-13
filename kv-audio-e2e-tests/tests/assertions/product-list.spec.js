//tests/assertions/product-page.spec.js
import { test, expect } from '@playwright/test';

test('Product cards should display correctly', async ({ page }) => {

  // Navigate to the items/products page
  await page.goto('http://localhost:5173/items');

  // Locate the first product title on the page
  const productTitle = page.locator('h3').first();

  // Locate the "View Details" button for the first product
  const viewButton = page.getByRole('link', { name: 'View Details' }).first();

  // Assertion: Verify that the product title is visible
  await expect(productTitle).toBeVisible();

  // Assertion: Verify that the "View Details" button is visible
  await expect(viewButton).toBeVisible();

});
// This test ensures that product cards load correctly on the product listing page
// and that users can access the product details.