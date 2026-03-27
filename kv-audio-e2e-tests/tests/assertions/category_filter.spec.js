import { test, expect } from '@playwright/test';

test('Category filter buttons should be visible', async ({ page }) => {

  await page.goto('http://localhost:5173/items');

  await expect(page.locator('text=Filter by Category')).toBeVisible();

  const allButton = page.getByRole('button', { name: /All/ });
  await expect(allButton).toBeVisible();
});

test('Add to cart button works', async ({ page }) => {

  await page.goto('http://localhost:5173/items');

  await page.getByRole('link', { name: 'View Details' }).first().click();

  await page.getByRole('button', { name: 'Add to Cart' }).click();

  await expect(page.locator('.go3958317564')).toBeVisible();
});