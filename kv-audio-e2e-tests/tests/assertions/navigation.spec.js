//tests/assertions/navigation.spec.js

import { test, expect } from '@playwright/test';

test('User navigates to product page', async ({ page }) => {

  await page.goto('http://localhost:5173');

  await page.getByRole('link', { name: 'Items' }).first().click();

  await expect(page).toHaveURL(/items/);

});

//this tests verifies that After clicking Products, user is redirected to product page.