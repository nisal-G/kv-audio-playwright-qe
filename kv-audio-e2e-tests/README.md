# KV Audio - Playwright E2E Tests

End-to-end testing for the KV Audio application using Playwright.

## 🚀 Quick Start for Team Members

### 1. Install Dependencies
```bash
cd kv-audio-e2e-tests
npm install
npx playwright install
```

### 2. Configure Environment
Create `.env` file:
```env
BASE_URL=http://localhost:5173
API_URL=http://localhost:3000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
```

### 3. Start Frontend
```bash
# In a separate terminal
cd ../kv-audio-frontend
npm run dev
```

### 4. Run Tests
```bash
npm test                # Run all tests
npm run test:ui         # Interactive mode
npm run test:headed     # See browser
npm run report          # View results
```

## 📚 Full Documentation

**→ See [TEAM_GUIDE.md](./TEAM_GUIDE.md) for complete setup instructions and tutorials**

## 🎯 Common Commands

```bash
npm test                        # Run all tests
npm run test:headed             # Run with visible browser
npm run test:ui                 # Interactive UI mode (BEST for development)
npm run test:debug              # Debug mode
npm run test:chrome             # Chrome only
npm run report                  # Show HTML report
npm run codegen                 # Record tests
```

## 📁 Project Structure

```
kv-audio-e2e-tests/
├── tests/                  # Test files
│   ├── example.spec.js    # Example test
│   └── pages/             # Page Object Models
├── playwright.config.js    # Configuration
├── .env                    # Environment variables (don't commit!)
└── TEAM_GUIDE.md          # Complete team documentation
```

## 🐛 Troubleshooting

**Tests fail?**
- Ensure frontend is running on `http://localhost:5173`
- Check `.env` file exists and has correct values
- Run `npm run test:headed` to see what's happening

**Need help?**
- Read [TEAM_GUIDE.md](./TEAM_GUIDE.md)
- Ask in team chat
- Use `npm run test:debug` to investigate

## 📖 Learn More

- [Playwright Documentation](https://playwright.dev/)
- [Team Guide](./TEAM_GUIDE.md) - Complete setup and testing guide
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)

## ✅ Testing Checklist

Before pushing code:
- [ ] All tests pass: `npm test`
- [ ] New features have tests
- [ ] `.env` file not committed
- [ ] Test report reviewed: `npm run report`

---

**Happy Testing! 🎉**
