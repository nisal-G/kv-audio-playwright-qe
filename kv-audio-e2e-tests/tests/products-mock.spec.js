import { test, expect } from '@playwright/test';

test('Scenario 1: successful API response renders mocked products', async ({ page }) => {
  // Keep browser storage clean so login/session state does not affect this demo.
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // This is the fake JSON data that will be returned instead of the real backend.
  const mockProducts = [
    {
      _id: 'mock-1',
      key: 'MIC-001',
      name: 'Mock Wireless Microphone',
      category: 'microphones',
      description: 'Battery-powered stage microphone for events.',
      price: 12500,
      availability: true,
      image: []
    },
    {
      _id: 'mock-2',
      key: 'SPK-002',
      name: 'Mock Powered Speaker',
      category: 'speakers',
      description: '12-inch powered speaker with clean output.',
      price: 48500,
      availability: false,
      image: []
    }
  ];

  let productsApiIntercepted = false;

  // page.route() listens for outgoing requests that match this URL pattern.
  // When /api/products/get/** is requested, Playwright intercepts it before it reaches the backend.
  await page.route('**/api/products/get/**', async (route) => {
    productsApiIntercepted = true;

    // route.fulfill() sends a mock HTTP response back to the browser.
    // The frontend receives this as if it came from the real API server.
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProducts)
    });
  });

  // Open /items. The page makes an API request, which is intercepted above.
  await page.goto('/items');

  // Validate that UI content is built from our mocked response body.
  await expect(page.getByRole('heading', { name: 'Items & Equipment' })).toBeVisible();
  await expect(page.getByText('Mock Wireless Microphone')).toBeVisible();
  await expect(page.getByText('Mock Powered Speaker')).toBeVisible();

  // Category filter buttons should be built from mocked categories and counts.
  await expect(page.getByRole('button', { name: /microphones \(1\)/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /speakers \(1\)/i })).toBeVisible();

  // Validate stock state rendered from mock values.
  await expect(page.getByText('In Stock')).toBeVisible();
  await expect(page.getByText('Unavailable')).toBeVisible();

  // Extra proof that request interception really happened.
  expect(productsApiIntercepted).toBeTruthy();
});

test('Scenario 2: empty API response shows empty state', async ({ page }) => {
  // Keep test deterministic by resetting storage before page scripts run.
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // In this scenario, API returns success but with no products.
  const emptyProducts = [];

  // Intercept the same backend endpoint and replace response with an empty array.
  await page.route('**/api/products/get/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(emptyProducts)
    });
  });

  // Navigate to the page that fetches products.
  await page.goto('/items');

  // UI should handle empty data gracefully.
  await expect(page.getByText('No items available yet')).toBeVisible();
  await expect(page.getByText('Mock Wireless Microphone')).not.toBeVisible();
});

test('Scenario 3: API failure (500) shows error state', async ({ page }) => {
  // Reset browser storage for consistent behavior.
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Intercept request and simulate backend failure.
  await page.route('**/api/products/get/**', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Mock server error' })
    });
  });

  // Load /items; frontend axios call will receive the mocked 500 response.
  await page.goto('/items');

  // UI should move to error state when product loading fails.
  await expect(page.getByText('Unable to load items')).toBeVisible();
});
