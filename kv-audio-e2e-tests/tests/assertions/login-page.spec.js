//tests/assertions/login-assertions.spec.js
import { test, expect } from '@playwright/test';

test('Login form elements should be visible', async ({ page }) => {

  await page.goto('http://localhost:5173');

  const loginButton = page.getByRole('link', { name: 'Login' }).first();

  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();

});
//this tests verifies that the login button exists and is clickable.

test('Login with invalid credentials shows error', async ({ page }) => {

  await page.goto('http://localhost:5173/login');

  await page.getByLabel('Email Address').fill('wrong@email.com');
  await page.getByLabel('Password').fill('wrongpassword');

  await page.getByRole('button', { name: 'Sign In' }).first().click();

  await expect(page.locator('.go3958317564')).toBeVisible();
});
//Invalid Login Assertion