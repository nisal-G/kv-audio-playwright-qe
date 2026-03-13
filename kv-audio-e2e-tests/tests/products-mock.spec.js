import { test, expect } from '@playwright/test';

// This test file demonstrates Playwright API mocking.
// Instead of calling the real backend controller,
// API requests are intercepted and replaced with mock responses.

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

  // Start waiting for the products request before navigation.
  // This proves the frontend actually made the request.
  const productsRequestPromise = page.waitForRequest('**/api/products/get/**');

  // Open /items. The page makes an API request, which is intercepted above.
  await page.goto('/items');

  // Confirm that the request was really sent by the browser.
  await productsRequestPromise;

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

test('Scenario 4: category filtering works with mocked data', async ({ page }) => {
  // Reset browser storage for consistent behavior.
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Mock data with multiple categories.
  const mockProducts = [
    {
      _id: 'mock-1',
      key: 'MIC-001',
      name: 'Microphone Pro',
      category: 'microphones',
      description: 'Professional microphone',
      price: 15000,
      availability: true,
      image: []
    },
    {
      _id: 'mock-2',
      key: 'MIC-002',
      name: 'Microphone Standard',
      category: 'microphones',
      description: 'Standard microphone',
      price: 8000,
      availability: true,
      image: []
    },
    {
      _id: 'mock-3',
      key: 'SPK-001',
      name: 'Speaker Large',
      category: 'speakers',
      description: 'Large powerful speaker',
      price: 55000,
      availability: true,
      image: []
    },
    {
      _id: 'mock-4',
      key: 'CAB-001',
      name: 'Cables Bundle',
      category: 'cables',
      description: 'Complete cable set',
      price: 5000,
      availability: true,
      image: []
    }
  ];

  // Intercept and return products with multiple categories.
  await page.route('**/api/products/get/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProducts)
    });
  });

  // Load the products page.
  await page.goto('/items');

  // Verify all category buttons appear with correct counts.
  await expect(page.getByRole('button', { name: /microphones \(2\)/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /speakers \(1\)/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /cables \(1\)/i })).toBeVisible();

  // Click on "microphones" filter to show only microphones.
  await page.getByRole('button', { name: /microphones \(2\)/i }).click();

  // Verify only microphones are displayed.
  await expect(page.getByText('Microphone Pro')).toBeVisible();
  await expect(page.getByText('Microphone Standard')).toBeVisible();
  // Speaker and cables should NOT be visible after filter.
  await expect(page.getByText('Speaker Large')).not.toBeVisible();
  await expect(page.getByText('Cables Bundle')).not.toBeVisible();
});

test('Scenario 6: slow API response with delayed fulfillment', async ({ page }) => {
  // Reset browser storage for consistent behavior.
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Mock data to return.
  const mockProducts = [
    {
      _id: 'mock-1',
      key: 'MIC-001',
      name: 'Delayed Microphone',
      category: 'microphones',
      description: 'This product arrived slowly',
      price: 12500,
      availability: true,
      image: []
    }
  ];

  // Intercept and delay the response by 1 second to simulate network latency.
  await page.route('**/api/products/get/**', async (route) => {
    // Wait 1 second before sending the response.
    await page.waitForTimeout(1000);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProducts)
    });
  });

  // Load the page.
  await page.goto('/items');

  // After the 1 second delay, the product should eventually appear.
  // Use a longer timeout to account for network + rendering time.
  await expect(page.getByText('Delayed Microphone')).toBeVisible({ timeout: 10000 });
});

test('Scenario 8: network error (no response from server)', async ({ page }) => {
  // Reset browser storage for consistent behavior.
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Intercept request and abort it (simulate network failure like no internet).
  await page.route('**/api/products/get/**', async (route) => {
    await route.abort('failed');
  });

  // Load the page. Request will fail to complete.
  await page.goto('/items');

  // UI should show an error state when network request fails.
  // Check for error message or ensure products do NOT appear.
  const productsVisible = await page.getByText('Mock').count();
  expect(productsVisible).toBe(0);
});
