//tests/assertions/login-assertions.spec.js
import { test, expect } from '@playwright/test';

test('Login button should be visible and clickable', async ({ page }) => {

  await page.goto('http://localhost:5173');

  const loginButton = page.getByRole('link', { name: 'Login' }).first();

  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();

});
//this tests verifies that the login button exists and is clickable.