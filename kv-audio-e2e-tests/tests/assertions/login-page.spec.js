//tests/assertions/login-assertions.spec.js
import { test, expect } from '@playwright/test';

test('Login form elements should be visible', async ({ page }) => {

  // Navigate to homepage
  await page.goto('http://localhost:5173');

  // Locate the login button in the header navigation
  const loginButton = page.getByRole('link', { name: 'Login' }).first();

  // Assertion: Verify the login button is visible to the user
  await expect(loginButton).toBeVisible();

  // Assertion: Verify the login button is clickable (enabled)
  await expect(loginButton).toBeEnabled();

});
//this tests verifies that the login button exists and is clickable.

test('Login with invalid credentials shows error', async ({ page }) => {

  // Navigate directly to the login page
  await page.goto('http://localhost:5173/login');

  // Enter an invalid email address
  await page.getByLabel('Email Address').fill('wrong@email.com');

  // Enter an incorrect password
  await page.getByLabel('Password').fill('wrongpassword');

  // Click the "Sign In" button
  await page.getByRole('button', { name: 'Sign In' }).first().click();

  // Assertion: Verify that an error message appears after failed login
  await expect(page.locator('.go3958317564')).toBeVisible();
});
// This test ensures that the system correctly handles invalid login attempts
// and displays an error message to the user.