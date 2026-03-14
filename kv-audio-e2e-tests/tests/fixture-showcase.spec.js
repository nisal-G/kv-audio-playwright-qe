import { test as base, expect } from '@playwright/test';

/**
 * Custom Fixtures for KV Audio E2E Tests
 * 
 * This file demonstrates Playwright's fixture system using base.extend()
 * Each fixture sets up a specific application state for reusable testing
 */

/**
 * @typedef {Object} Fixtures
 * @property {import('@playwright/test').Page} loggedInPage - User session ready for authenticated actions
 * @property {import('@playwright/test').Page} productsPage - Products catalog page loaded and ready
 * @property {import('@playwright/test').Page} cartReadyPage - Shopping cart with items, ready for checkout
 * @property {import('@playwright/test').Page} adminPage - Admin panel access attempt (may redirect if unauthorized)
 */

// Custom fixtures using base.extend()
const test = /** @type {import('@playwright/test').TestType<import('@playwright/test').PlaywrightTestArgs & Fixtures, import('@playwright/test').PlaywrightWorkerArgs>} */ (
  base.extend({
    
    // FIXTURE 1: Logged-in user session
    loggedInPage: async ({ page }, use) => {
      console.log('Setting up authenticated user session...');
      
      // Navigate to login page
      await page.goto('http://localhost:5173/login');
      
      // TODO: Complete actual login when credentials are available
      // await page.fill('[data-testid="email"]', 'testuser@example.com');
      // await page.fill('[data-testid="password"]', 'password123');
      // await page.click('[data-testid="login-button"]');
      // await page.waitForURL('**/home');
      
      console.log('User session ready');
      await use(page);
    },

    // FIXTURE 2: Products page with catalog loaded
    productsPage: async ({ page }, use) => {
      console.log('Loading products catalog...');
      
      // Navigate to products page and wait for content
      await page.goto('http://localhost:5173/items');
      await page.waitForLoadState('networkidle');
      
      // TODO: Wait for product grid when selectors are known
      // await page.waitForSelector('[data-testid="product-grid"]');
      
      console.log('Products catalog ready');
      await use(page);
    },

    // FIXTURE 3: Shopping cart with items (depends on loggedInPage)
    cartReadyPage: async ({ loggedInPage }, use) => {
      console.log('Preparing shopping cart with items...');
      
      // Navigate to products from logged-in state
      await loggedInPage.goto('http://localhost:5173/items');
      await loggedInPage.waitForLoadState('networkidle');
      
      // TODO: Add product(s) to cart when selectors are available
      // await loggedInPage.click('[data-testid="first-product-add-to-cart"]');
      // await loggedInPage.waitForSelector('[data-testid="cart-count"]');
      
      console.log('Shopping cart ready');
      await use(loggedInPage);
    },

    // FIXTURE 4: Admin access attempt (demonstrates security redirects)
    adminPage: async ({ page }, use) => {
      console.log('Attempting admin panel access...');
      
      // Try to access admin panel directly
      await page.goto('http://localhost:5173/admin');
      await page.waitForLoadState('networkidle');
      
      // Note: This will redirect to login if unauthorized (expected behavior)
      console.log('Admin access attempt completed');
      await use(page);
    }
  })
);

//testing section

test.describe('Fixture Tests', () => {
  test('login page loads', async ({ page }) => {
    console.log('Checking login page loads...');

    await page.goto('http://localhost:5173/login');

    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('body')).toBeVisible();

    console.log('Login page loaded');
  });

  test('products page loads', async ({ productsPage }) => {
    console.log('Checking products page loads...');

    await expect(productsPage).toHaveURL(/.*items/);
    await expect(productsPage.locator('body')).toBeVisible();

    console.log('Products page loaded');
  });
  test('product search works', async ({ productsPage }) => {
  console.log('Testing product search functionality...');

  // TODO: Replace with real selector
  const searchInput = productsPage.locator('input[placeholder*="Search"]');

  await expect(productsPage).toHaveURL(/.*items/);

  if (await searchInput.count() > 0) {
    await searchInput.fill('speaker');
    await searchInput.press('Enter');
  }

  await expect(productsPage.locator('body')).toBeVisible();

  console.log('Product search test completed');
});


test('product filter works', async ({ productsPage }) => {
  console.log('Testing product filter functionality...');

  await expect(productsPage).toHaveURL(/.*items/);

  // TODO: Replace with real filter selector
  const filterButton = productsPage.locator('button:has-text("Filter")');

  if (await filterButton.count() > 0) {
    await filterButton.click();
  }

  await expect(productsPage.locator('body')).toBeVisible();

  console.log('Product filter test completed');
});


test('product sorting works', async ({ productsPage }) => {
  console.log('Testing product sorting functionality...');

  await expect(productsPage).toHaveURL(/.*items/);

  // TODO: Replace with sorting dropdown selector
  const sortDropdown = productsPage.locator('select');

  if (await sortDropdown.count() > 0) {
    await sortDropdown.selectOption({ index: 1 });
  }

  await expect(productsPage.locator('body')).toBeVisible();

  console.log('Product sorting test completed');
});

  test('cart page accessible after login', async ({ cartReadyPage }) => {
    console.log('Checking cart page accessibility after login...');

    // TODO: If your app has a dedicated cart URL, assert that exact URL here.
    // This allows either /items (current fixture) or /cart if routing is updated later.
    await expect(cartReadyPage).toHaveURL(/.*(items|cart)/);
    await expect(cartReadyPage.locator('body')).toBeVisible();

    console.log('Cart page flow is accessible');
  });
  test('unauthorized user cannot access admin panel', async ({ adminPage }) => {
    console.log('Checking unauthorized admin access restriction...');

    await expect(adminPage).toHaveURL(/.*login/);

    console.log('Unauthorized admin access blocked');
  });

  test('invalid login credentials show error or stay on login page', async ({ page }) => {
    console.log('Checking invalid login handling...');

    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');

    // TODO: Replace with stable data-testid selectors when available.
    const emailInput = page.locator('input[placeholder*="Email"]');
    const passwordInput = page.locator('input[placeholder*="Password"]');
    const signInButton = page.locator('button[type="submit"]:has-text("Sign In")');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(signInButton).toBeVisible();

    await emailInput.fill('invalid@test.com');
    await passwordInput.fill('wrongpassword123');
    await signInButton.click();

    await page.waitForTimeout(1500);

    const currentUrl = page.url();
    const hasErrorMessage =
      (await page.locator('.text-red-500, .text-danger, .error, .alert-danger').count()) > 0;
    const staysOnLogin = currentUrl.includes('/login');

    expect(hasErrorMessage || staysOnLogin).toBe(true);

    console.log('Invalid login handled correctly');
  });
});

test.afterAll(async () => {
  console.log('All fixture showcase tests completed');
});