//tests/assertions/product-page.spec.js
import { test, expect } from '@playwright/test';

test('Product cards should display correctly', async ({ page }) => {

  await page.goto('http://localhost:5173/items');

  const productCard = page.locator('div');

  await expect(productCards.first()).toBeVisible();

});

//this tests verifies that the product cards are visible on the product page.