import { test, expect } from '@playwright/test';

/**
 * EXAMPLE TEST FILE FOR TEAM MEMBERS
 * 
 * This file demonstrates how to write basic Playwright tests.
 * Copy this file and modify it for your own tests.
 * 
 * Test file naming: feature-name.spec.js
 * Example: auth.spec.js, products.spec.js, homepage.spec.js
 */

// Test suite - groups related tests together
test.describe('Example Test Suite', () => {
  
  // This runs BEFORE each test in this suite
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before every test
    await page.goto('/');
  });

  // Test 1: Basic navigation
  test('should navigate to homepage', async ({ page }) => {
    // Check if we're on the correct URL
    await expect(page).toHaveURL('/');
    
    // Check if header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  // Test 2: Finding elements
  test('should find elements by different methods', async ({ page }) => {
    // By text content
    const link = page.locator('text=About');
    
    // By CSS class
    const card = page.locator('.product-card');
    
    // By ID
    const button = page.locator('#submit-button');
    
    // By data-testid (RECOMMENDED)
    const element = page.locator('[data-testid="my-element"]');
    
    // By role (BEST for accessibility)
    const submitBtn = page.getByRole('button', { name: 'Submit' });
  });

  // Test 3: Clicking and typing
  test('should interact with elements', async ({ page }) => {
    // Click on an element
    await page.click('text=Products');
    
    // Fill an input field
    await page.fill('input[name="email"]', 'test@example.com');
    
    // Check a checkbox
    await page.check('input[type="checkbox"]');
    
    // Select from dropdown
    await page.selectOption('select', 'option-value');
  });

  // Test 4: Assertions (checking results)
  test('should verify page content', async ({ page }) => {
    // Check URL
    await expect(page).toHaveURL('/');
    
    // Check page title
    await expect(page).toHaveTitle(/KV Audio/i);
    
    // Check if element is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check text content
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Welcome');
    
    // Check if element exists
    const button = page.locator('button');
    await expect(button).toHaveCount(1);
  });

  // Test 5: Waiting for elements
  test('should wait for elements to load', async ({ page }) => {
    await page.goto('/items');
    
    // Wait for network to be idle
    await page.waitForLoadState('networkidle');
    
    // Wait for specific element
    await page.waitForSelector('.product-card');
    
    // Check if product loaded
    const product = page.locator('.product-card');
    await expect(product.first()).toBeVisible();
  });

  // Test 6: Form submission
  test('should submit a form', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form fields
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await page.waitForTimeout(2000);
    
    // Verify success (adjust based on your app)
    const successMsg = page.locator('text=success, text=sent');
    await expect(successMsg.first()).toBeVisible({ timeout: 5000 });
  });

  // Test 7: Navigation and back button
  test('should navigate and go back', async ({ page }) => {
    // Start at homepage
    await expect(page).toHaveURL('/');
    
    // Go to another page
    await page.click('text=About');
    await expect(page).toHaveURL(/.*about/i);
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  // Test 8: Working with multiple elements
  test('should count and interact with multiple elements', async ({ page }) => {
    await page.goto('/items');
    
    // Wait for products to load
    await page.waitForLoadState('networkidle');
    
    // Get all products
    const products = page.locator('.product-card, [class*="product"]');
    
    // Count products
    const count = await products.count();
    console.log(`Found ${count} products`);
    
    // Click first product
    if (count > 0) {
      await products.first().click();
    }
  });

  // Test 9: Mobile responsive test
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile screen size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to page
    await page.goto('/');
    
    // Check if mobile menu is visible
    const mobileMenu = page.locator('[class*="mobile-menu"], button[aria-label="menu"]');
    
    // If mobile menu exists, click it
    if (await mobileMenu.isVisible({ timeout: 2000 })) {
      await mobileMenu.click();
    }
  });

  // Test 10: Taking screenshots for debugging
  test('should take screenshots', async ({ page }) => {
    await page.goto('/');
    
    // Take full page screenshot
    await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
    
    // Take element screenshot
    const header = page.locator('header');
    await header.screenshot({ path: 'screenshots/header.png' });
  });

  // Test 11: Skip a test (useful when test is not ready)
  test.skip('this test will be skipped', async ({ page }) => {
    // This test won't run
  });

  // Test 12: Using environment variables
  test('should use environment variables', async ({ page }) => {
    // Get values from .env file
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    
    console.log('Base URL:', baseUrl);
    console.log('Test Email:', testEmail);
  });

});

// Test suite with authentication
test.describe('Login Example Tests', () => {
  
  test('user should see login form', async ({ page }) => {
    await page.goto('/login');
    
    // Check form elements are visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test.skip('user can login with valid credentials', async ({ page }) => {
    // Skip this test - needs valid credentials
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL);
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD);
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL('/', { timeout: 5000 });
    
    // Verify logged in
    const logoutButton = page.locator('text=Logout');
    await expect(logoutButton).toBeVisible();
  });

});

/**
 * TIPS FOR WRITING GOOD TESTS:
 * 
 * 1. Use descriptive test names
 *    ✅ test('user can login with valid credentials')
 *    ❌ test('test 1')
 * 
 * 2. Keep tests independent
 *    Each test should work on its own
 * 
 * 3. Use stable selectors
 *    ✅ [data-testid="submit-button"]
 *    ❌ div > div > button:nth-child(3)
 * 
 * 4. Always use await for async operations
 *    ✅ await page.click('button')
 *    ❌ page.click('button')
 * 
 * 5. Add proper waits
 *    ✅ await page.waitForLoadState('networkidle')
 *    ❌ await page.waitForTimeout(5000)
 * 
 * 6. Use meaningful assertions
 *    Check what actually matters to the user
 * 
 * 7. Clean up after tests
 *    Use afterEach to reset state if needed
 * 
 * 8. Group related tests
 *    Use test.describe() to organize tests
 */

/**
 * COMMON PATTERNS:
 * 
 * // Navigate
 * await page.goto('/path');
 * 
 * // Find element
 * const element = page.locator('selector');
 * 
 * // Click
 * await page.click('button');
 * 
 * // Type
 * await page.fill('input', 'text');
 * 
 * // Assert visible
 * await expect(element).toBeVisible();
 * 
 * // Assert text
 * await expect(element).toHaveText('Expected');
 * 
 * // Assert URL
 * await expect(page).toHaveURL('/expected');
 * 
 * // Wait for element
 * await page.waitForSelector('.element');
 * 
 * // Wait for navigation
 * await page.waitForURL('/path');
 * 
 * // Wait for network
 * await page.waitForLoadState('networkidle');
 */
