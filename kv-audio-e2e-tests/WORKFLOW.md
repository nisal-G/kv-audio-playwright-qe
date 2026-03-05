# 🔄 Testing Workflow for KV Audio Team

**Quick reference for daily testing workflows**

---

## 📅 Daily Development Workflow

### **Morning Routine**
```bash
# 1. Pull latest code
git pull origin main

# 2. Update dependencies
cd kv-audio-e2e-tests
npm install

# 3. Start frontend (separate terminal)
cd ../kv-audio-frontend
npm run dev

# 4. Run tests to ensure everything works
cd ../kv-audio-e2e-tests
npm test
```

---

## ✍️ When Writing New Tests

### **Step 1: Plan Your Test**
- What feature are you testing?
- What user actions need to happen?
- What should the expected result be?

### **Step 2: Create Test File**
```bash
# Create new test file
# Name it after the feature: feature-name.spec.js
cd tests
# Create your file
```

### **Step 3: Write Test in UI Mode**
```bash
# Use UI mode for best development experience
npm run test:ui
```

### **Step 4: Run Your Test**
```bash
# Run specific test file
npx playwright test tests/your-test.spec.js

# Or run with browser visible
npx playwright test tests/your-test.spec.js --headed
```

### **Step 5: Debug if Needed**
```bash
# Use debug mode to step through
npm run test:debug tests/your-test.spec.js
```

### **Step 6: Verify All Tests Pass**
```bash
# Run all tests before committing
npm test
```

---

## 🔧 When Debugging Failing Tests

### **Step 1: See What's Happening**
```bash
npm run test:headed
```
Watch the browser to see where it fails

### **Step 2: Use Debug Mode**
```bash
npm run test:debug
```
Step through the test line by line

### **Step 3: Check Common Issues**
- [ ] Is frontend running?
- [ ] Is backend running (if needed)?
- [ ] Are environment variables set?
- [ ] Has the UI changed?
- [ ] Are selectors still correct?

### **Step 4: Add Console Logs**
```javascript
test('debug test', async ({ page }) => {
  console.log('Current URL:', page.url());
  const text = await page.locator('h1').textContent();
  console.log('Heading:', text);
});
```

### **Step 5: Take Screenshots**
```javascript
await page.screenshot({ path: 'debug.png' });
```

---

## 📤 Before Committing Code

### **Checklist:**
```bash
# 1. Run all tests
npm test

# 2. Check test report
npm run report

# 3. Verify new tests are included
git status

# 4. Ensure .env is not being committed
git status  # Should NOT see .env

# 5. Stage your changes
git add tests/your-test.spec.js

# 6. Commit with clear message
git commit -m "Add tests for user login feature"

# 7. Push to your branch
git push origin feature/your-branch
```

---

## 🔍 Code Review Workflow

### **When Reviewing Test PRs:**

1. **Check test file names**
   - Descriptive names?
   - Proper location?

2. **Review test code**
   - Clear test names?
   - Good selectors?
   - Proper assertions?

3. **Run tests locally**
   ```bash
   git checkout branch-name
   cd kv-audio-e2e-tests
   npm install
   npm test
   ```

4. **Check test report**
   ```bash
   npm run report
   ```

5. **Provide feedback**
   - Suggest improvements
   - Ask questions
   - Approve if good!

---

## 🚀 When Testing New Features

### **Step 1: Understand the Feature**
- What does it do?
- What are the user flows?
- What can go wrong?

### **Step 2: Write Test Scenarios**
Example for login feature:
- ✅ User can see login form
- ✅ User can login with valid credentials
- ✅ User sees error with invalid credentials
- ✅ User sees validation errors for empty fields
- ✅ User can navigate to register page

### **Step 3: Implement Tests**
```javascript
test.describe('Login Feature', () => {
  test('scenario 1', async ({ page }) => { /* ... */ });
  test('scenario 2', async ({ page }) => { /* ... */ });
  // etc...
});
```

### **Step 4: Run and Verify**
```bash
npm run test:ui
```

---

## 🐛 When Tests Suddenly Fail

### **Possible Reasons:**

1. **UI Changed**
   - Update selectors in tests
   - Check with frontend team

2. **API Changed**
   - Update test data
   - Check with backend team

3. **Timing Issues**
   - Add proper waits
   - Use `waitForLoadState('networkidle')`

4. **Environment Issues**
   - Check `.env` file
   - Restart servers
   - Clear cache: `npm cache clean --force`

5. **Dependency Updates**
   - Run `npm install` again
   - Check for breaking changes

### **Quick Fix Workflow:**
```bash
# 1. Identify failing test
npm test

# 2. Run that test with UI
npm run test:ui

# 3. See what's different
npm run test:headed

# 4. Fix the test

# 5. Verify fix
npm test

# 6. Commit fix
git commit -m "Fix: Update login test selectors"
```

---

## 🎯 Testing Best Practices Workflow

### **Before Writing Tests:**
- [ ] Read existing tests to understand style
- [ ] Check if similar tests exist
- [ ] Plan your test scenarios
- [ ] Discuss with team if unsure

### **While Writing Tests:**
- [ ] Use descriptive test names
- [ ] Use stable selectors (data-testid)
- [ ] Add comments for complex logic
- [ ] Keep tests independent
- [ ] Use Page Objects for complex pages

### **After Writing Tests:**
- [ ] Run tests multiple times (ensure not flaky)
- [ ] Check test runs in all browsers
- [ ] Review test report
- [ ] Get team feedback
- [ ] Update documentation if needed

---

## 📊 Weekly Testing Activities

### **Monday:**
- Pull latest code
- Run full test suite
- Check for flaky tests
- Report any issues

### **During Week:**
- Write tests for new features
- Update tests for changed features
- Debug failing tests
- Help teammates with testing

### **Friday:**
- Run full test suite
- Review test coverage
- Update test documentation
- Plan testing for next week

---

## 🆘 When You Need Help

### **Resources in Order:**

1. **Check Documentation**
   - `TEAM_GUIDE.md` - Complete guide
   - `README.md` - Quick reference
   - `tests/example-guide.spec.js` - Code examples

2. **Try Debug Tools**
   ```bash
   npm run test:ui      # Visual debugging
   npm run test:debug   # Step through
   npm run test:headed  # Watch execution
   ```

3. **Check Playwright Docs**
   - [playwright.dev](https://playwright.dev/)
   - Search for your specific issue

4. **Ask Team**
   - Team chat: #testing channel
   - Tag: @qa-lead
   - Team meeting: Wednesday 2 PM

5. **Stack Overflow**
   - Search: "playwright [your issue]"
   - Ask new question if not found

---

## ✅ Success Metrics

### **Good Test Suite Has:**
- ✅ All tests passing
- ✅ Fast execution (< 2 minutes)
- ✅ Clear test names
- ✅ No flaky tests
- ✅ Good coverage of critical paths
- ✅ Up-to-date documentation

### **Good Team Testing Culture:**
- ✅ Everyone writes tests
- ✅ Tests reviewed in PRs
- ✅ Failing tests fixed immediately
- ✅ Regular test maintenance
- ✅ Knowledge sharing

---

## 🎉 You're Ready!

Follow these workflows and you'll be a testing pro in no time!

**Remember:** 
- Tests are code - treat them well
- Good tests save time and prevent bugs
- Don't hesitate to ask for help
- Share your knowledge with the team

Happy Testing! 🚀
