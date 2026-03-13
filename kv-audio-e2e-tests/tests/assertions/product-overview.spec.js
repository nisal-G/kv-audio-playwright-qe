//tests/assertions/product-overview.spec.js
import { test, expect } from '@playwright/test';

test('Product overview page displays correctly', async ({ page }) => {

  await page.goto('http://localhost:5173/items');

  await page.getByRole('link', { name: 'View Details' }).first().click();

  await expect(page.locator('h1')).toBeVisible(); 
  await expect(page.locator('text=Add to Cart')).toBeVisible();
});
//Ensures product details page loads.