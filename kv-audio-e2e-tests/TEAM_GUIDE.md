# 🎵 KV Audio - Playwright E2E Testing Setup Guide for Team

**Step-by-Step Guide for Team Members to Set Up and Run Tests**

---

## 📋 **What is This Project?**

This is an **End-to-End (E2E) Testing** project for the KV Audio application using **Playwright**. It allows us to:
- ✅ Automatically test the entire application
- ✅ Test across Chrome, Firefox, and Safari browsers
- ✅ Catch bugs before they reach production
- ✅ Ensure features work correctly after changes

---

## 🎯 **For Team Members: How to Get Started**

### **Step 1: Prerequisites - What You Need**

Before starting, make sure you have:

1. **Node.js installed** (version 16 or higher)
   - Check: Open terminal and run `node --version`
   - If not installed: Download from [nodejs.org](https://nodejs.org/)

2. **Git installed**
   - Check: Run `git --version`
   - If not installed: Download from [git-scm.com](https://git-scm.com/)

3. **VS Code** (recommended editor)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

---

### **Step 2: Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/nisal-G/kv-audio-playwright-qe.git

# Navigate to the project
cd kv-audio-playwright-qe
```

---

### **Step 3: Navigate to Tests Folder**

```bash
cd kv-audio-e2e-tests
```

---

### **Step 4: Install Dependencies**

```bash
# Install all required packages
npm install

# Install Playwright browsers (Chrome, Firefox, Safari)
npx playwright install
```

**Note:** This might take 2-5 minutes depending on your internet speed.

---

### **Step 5: Configure Environment Variables**

Create a `.env` file in the `kv-audio-e2e-tests` folder:

```bash
# You can copy this template
```

Add this content to `.env`:

```env
# Application URLs
BASE_URL=http://localhost:5173
API_URL=http://localhost:3000

# Test User Credentials (ask team lead for these)
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!

# Admin Credentials (optional)
ADMIN_USER_EMAIL=admin@example.com
ADMIN_USER_PASSWORD=AdminPassword123!
```

**⚠️ Important:** 
- Never commit `.env` to Git (it's already in `.gitignore`)
- Ask your team lead for actual test credentials

---

### **Step 6: Start the Frontend Application**

**Before running tests, the frontend must be running!**

Open a **NEW terminal** window and run:

```bash
# Navigate to frontend folder
cd kv-audio-frontend

# Start the development server
npm run dev
```

Keep this terminal open! The frontend should run on `http://localhost:5173`

---

### **Step 7: Run Your First Test**

Go back to the tests terminal and run:

```bash
# Run all tests
npm test
```

You should see output like:
```
Running 6 tests using 6 workers
  ✓  1 [chromium] › tests\example.spec.js:4:1 › has title
  ✓  2 [firefox] › tests\example.spec.js:4:1 › has title
  ✓  3 [webkit] › tests\example.spec.js:4:1 › has title
  ...
  6 passed (20.6s)
```

🎉 **Success!** If you see this, your setup is working!

---

### **Step 8: View Test Results**

```bash
# Open HTML report in browser
npx playwright show-report
```

This opens a detailed interactive report showing all test results.

---

## 🎮 **Common Commands for Daily Use**

### **Running Tests**

```bash
# Run all tests (headless - no browser window)
npm test

# Run tests and SEE the browser (helpful for debugging)
npm run test:headed

# Run tests in UI mode (BEST for development)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run only Chrome tests
npm run test:chrome

# Run only Firefox tests
npm run test:firefox
```

### **Running Specific Tests**

```bash
# Run a specific test file
npx playwright test tests/homepage.spec.js

# Run tests matching a name
npx playwright test --grep "login"

# Run a single test with its line number
npx playwright test tests/auth.spec.js:15
```

### **Viewing Reports**

```bash
# Show last test report
npm run report
```

### **Recording Tests (Codegen)**

```bash
# Generate tests by recording your actions
npm run codegen
```

This opens a browser where Playwright records your clicks and generates test code!

---

## 📁 **Project Structure Explained**

```
kv-audio-e2e-tests/
│
├── .env                        # Your environment variables (SECRET - don't commit!)
├── .env.example                # Template for .env
├── .gitignore                  # Files to ignore in Git
├── package.json                # Dependencies and scripts
├── playwright.config.js        # Playwright configuration
│
├── tests/                      # Your test files go here
│   ├── example.spec.js        # Example test (can delete)
│   ├── homepage.spec.js       # Homepage tests
│   ├── auth.spec.js           # Login/Register tests
│   ├── products.spec.js       # Product browsing tests
│   │
│   └── pages/                 # Page Object Models (reusable code)
│       ├── LoginPage.js       # Login page interactions
│       ├── HomePage.js        # Homepage interactions
│       └── ProductPage.js     # Products page interactions
│
├── test-results/              # Test execution results (auto-generated)
└── playwright-report/         # HTML reports (auto-generated)
```

---

## ✍️ **How to Write Your First Test**

### **Example 1: Simple Homepage Test**

Create `tests/my-test.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

test('homepage should load', async ({ page }) => {
  // Go to homepage
  await page.goto('/');
  
  // Check if header is visible
  const header = page.locator('header');
  await expect(header).toBeVisible();
});
```

### **Example 2: Login Test**

```javascript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  // Go to login page
  await page.goto('/login');
  
  // Fill in email and password
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Verify we're logged in (redirected to home)
  await expect(page).toHaveURL('/');
});
```

### **Example 3: Navigation Test**

```javascript
import { test, expect } from '@playwright/test';

test('can navigate to products', async ({ page }) => {
  // Start at homepage
  await page.goto('/');
  
  // Click Products link
  await page.click('text=Products');
  
  // Verify we're on products page
  await expect(page).toHaveURL(/.*items/i);
  
  // Check products are visible
  const products = page.locator('[class*="product"]');
  await expect(products.first()).toBeVisible();
});
```

---

## 🎯 **Test Writing Cheat Sheet**

### **Navigation**
```javascript
await page.goto('/path');          // Go to URL
await page.goBack();               // Go back
await page.reload();               // Reload page
```

### **Finding Elements**
```javascript
page.locator('text=Login')         // By text
page.locator('button')             // By tag
page.locator('.class-name')        // By class
page.locator('#id-name')           // By ID
page.locator('[data-testid="btn"]') // By test ID (BEST)
page.getByRole('button', { name: 'Submit' }) // By role
```

### **Interactions**
```javascript
await page.click('button')                    // Click
await page.fill('input', 'text')             // Type text
await page.check('checkbox')                 // Check checkbox
await page.selectOption('select', 'value')   // Select dropdown
```

### **Assertions (Checking Results)**
```javascript
await expect(page).toHaveURL('/expected')    // Check URL
await expect(page).toHaveTitle('Title')      // Check title
await expect(element).toBeVisible()          // Check visible
await expect(element).toHaveText('Text')     // Check text
await expect(element).toHaveCount(5)         // Check count
```

---

## 🐛 **Debugging Tests**

### **Method 1: UI Mode (EASIEST)**
```bash
npm run test:ui
```
- Visual interface
- See tests run in real-time
- Time-travel through test steps
- Click to see what happened

### **Method 2: Debug Mode**
```bash
npm run test:debug
```
- Opens Playwright Inspector
- Step through test line by line
- Pause and inspect elements

### **Method 3: Run with Browser Visible**
```bash
npm run test:headed
```
- See the browser window
- Watch tests execute
- Understand what's happening

### **Method 4: Screenshots**
```javascript
await page.screenshot({ path: 'debug.png' });
```

---

## ✅ **Best Practices for Team**

### **DO:**
- ✅ Write clear test names: `test('user can login with valid credentials')`
- ✅ Use `data-testid` attributes in your React components
- ✅ Keep tests independent (each test should work alone)
- ✅ Use Page Objects for complex pages
- ✅ Run tests before pushing code
- ✅ Add tests for new features

### **DON'T:**
- ❌ Don't commit `.env` file
- ❌ Don't use `page.waitForTimeout()` (use proper waits)
- ❌ Don't make tests depend on each other
- ❌ Don't use fragile selectors like `div > div > button`
- ❌ Don't skip failing tests without fixing them

---

## 👥 **Team Workflow**

### **Before Starting Work:**
```bash
git pull origin main          # Get latest code
cd kv-audio-e2e-tests
npm install                   # Update dependencies
```

### **When Writing Tests:**
```bash
npm run test:ui               # Use UI mode for development
```

### **Before Committing:**
```bash
npm test                      # Run all tests
npm run report                # Check results
git add .
git commit -m "Add tests for feature X"
git push
```

### **When Tests Fail:**
1. Run `npm run test:headed` to see what's happening
2. Use `npm run test:debug` to step through
3. Check if frontend is running
4. Check if `.env` is configured correctly
5. Ask team for help in Slack/Discord

---

## 🚑 **Troubleshooting Common Issues**

### **Issue: `npm install` fails**
**Solution:**
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### **Issue: Tests timeout**
**Solution:**
- Check if frontend is running on `http://localhost:5173`
- Increase timeout in `playwright.config.js`
- Check your internet connection

### **Issue: "Element not found"**
**Solution:**
- Use Playwright Inspector: `npm run test:debug`
- Check if selector is correct
- Add wait: `await page.waitForSelector('.element')`

### **Issue: Tests pass locally but fail on others' machines**
**Solution:**
- Check `.env` configuration
- Ensure same Node.js version
- Clear `node_modules` and reinstall

### **Issue: Browsers not installing**
**Solution:**
```bash
npx playwright install --with-deps
```

---

## 📚 **Learning Resources**

### **Official Documentation**
- [Playwright Docs](https://playwright.dev/)
- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### **Video Tutorials**
- [Playwright Crash Course](https://www.youtube.com/results?search_query=playwright+tutorial)
- [Playwright Official YouTube](https://www.youtube.com/@Playwrightdev)

### **Community**
- [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

---

## 🎓 **Learning Path for New Team Members**

### **Week 1: Understanding**
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Run existing tests
- [ ] Read test files
- [ ] Use `npm run test:ui` to understand tests

### **Week 2: Basic Testing**
- [ ] Write simple navigation test
- [ ] Write homepage test
- [ ] Use basic locators
- [ ] Add simple assertions

### **Week 3: Intermediate**
- [ ] Write login test
- [ ] Use Page Objects
- [ ] Write product browsing test
- [ ] Debug failing tests

### **Week 4: Advanced**
- [ ] Write complete user flows
- [ ] Review teammates' test PRs
- [ ] Help debug complex issues
- [ ] Improve test coverage

---

## 📞 **Getting Help**

**Questions? Need Help?**

1. **Check this README first**
2. **Ask in team chat:** #testing channel
3. **Tag the QA lead:** @qa-lead
4. **Team meetings:** Every Wednesday 2 PM
5. **Email:** qa-team@kvaudio.com

---

## 🎯 **Quick Command Reference Card**

```bash
# SETUP (one time)
npm install
npx playwright install

# DAILY DEVELOPMENT
npm run test:ui          # Best for development
npm run test:headed      # See browser
npm test                 # Run all tests

# SPECIFIC TESTS
npx playwright test tests/auth.spec.js
npx playwright test --grep "login"

# DEBUGGING
npm run test:debug       # Step through tests
npm run report           # View results
npm run codegen          # Record new tests

# VIEWING RESULTS
npm run report           # HTML report
```

---

## ✨ **Tips for Success**

1. **Always start frontend before running tests**
2. **Use `npm run test:ui` for the best development experience**
3. **Write test names that explain what they test**
4. **Run tests before pushing code**
5. **Ask questions early - don't stay stuck**
6. **Review test reports to understand failures**
7. **Keep tests simple and focused**

---

## 📝 **Quick Start Summary**

```bash
# 1. Clone repo
git clone https://github.com/nisal-G/kv-audio-playwright-qe.git

# 2. Go to tests folder
cd kv-audio-playwright-qe/kv-audio-e2e-tests

# 3. Install
npm install
npx playwright install

# 4. Create .env file with credentials

# 5. Start frontend (in another terminal)
cd ../kv-audio-frontend && npm run dev

# 6. Run tests
npm test

# 7. View results
npm run report
```

---

**You're all set! Welcome to the testing team! 🎉**

For questions, reach out to the team lead or check the resources section above.

Happy Testing! 🚀
