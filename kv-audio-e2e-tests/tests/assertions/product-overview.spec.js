//tests/assertions/product-overview.spec.js
import { test, expect } from '@playwright/test';

test('Product overview page displays correctly', async ({ page }) => {

  // Navigate to the items page
  await page.goto('http://localhost:5173/items');

  // Click the "View Details" button for the first product
  await page.getByRole('link', { name: 'View Details' }).first().click();

  // Assertion: Verify that the product title (h1) is visible on the details page
  await expect(page.locator('h1')).toBeVisible(); 

  // Assertion: Verify that the "Add to Cart" button appears
  await expect(page.locator('text=Add to Cart')).toBeVisible();
});
// This test ensures that when a user selects a product,
// the product details page loads successfully and key elements are displayed.