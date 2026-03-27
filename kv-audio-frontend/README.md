# 🎵 KV Audio — Audio Equipment Rental Platform

A full-stack web application for renting professional audio equipment — built with a modern React frontend, a Node.js/Express/MongoDB backend, and a comprehensive Playwright end-to-end test suite.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [System Architecture](#-system-architecture)
- [Technologies Used](#-technologies-used)
- [Key Features](#-key-features)
- [Folder Structure](#-folder-structure)
- [Setup Instructions](#-setup-instructions)
- [How to Run](#-how-to-run)
- [Running Tests](#-running-tests)
- [Contribution](#-contribution)

---

## 🔍 Project Overview

**KV Audio** is an online rental platform designed for event planners, musicians, and production teams to browse and book professional audio equipment — including microphones, speakers, cables, and more. The platform supports two user roles:

- **Customer** — Browse the product catalog, submit rental bookings, leave reviews, and manage their profile.
- **Admin** — Manage the full inventory, approve or reject bookings, moderate reviews, and manage user accounts.

The project is composed of three self-contained modules:

| Module | Description |
|---|---|
| `kv-audio-frontend` | React-based SPA with routing, authentication, and a polished UI |
| `kv-audio-backend` | RESTful API built with Express.js, secured with JWT authentication |
| `kv-audio-e2e-tests` | Playwright-based end-to-end test suite covering UI flows and API mocking |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │         React Frontend  ·  Vite  ·  TailwindCSS          │   │
│   │  Pages: Home · Items · Booking · Admin · Login · Register │   │
│   └─────────────────────┬────────────────────────────────────┘   │
│                         │  HTTP / Axios                          │
└─────────────────────────┼────────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│                   Node.js  /  Express  Backend                   │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  Routes & Controllers                                    │   │
│   │  /api/users · /api/products · /api/orders               │   │
│   │  /api/reviews · /api/inquiries                          │   │
│   └──────────────┬───────────────────────────────────────────┘   │
│                  │  JWT Middleware  (Auth & Role Guard)           │
│   ┌──────────────▼───────────────────────────────────────────┐   │
│   │  Mongoose Models                                         │   │
│   │  User · Product · Order · Review · Inquiry · OTP        │   │
│   └──────────────┬───────────────────────────────────────────┘   │
└──────────────────┼───────────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────────┐
│                    MongoDB Atlas  (Cloud DB)                      │
└──────────────────────────────────────────────────────────────────┘

       ┌──────────────────────────────────────────┐
       │  Playwright E2E Test Suite               │
       │  Targets  →  http://localhost:5173       │
       │  Browsers →  Chromium  ·  Firefox        │
       └──────────────────────────────────────────┘
```

### Data Flow

1. The user interacts with the **React frontend** served at `http://localhost:5173`.
2. The frontend makes authenticated API calls (with JWT in the `Authorization` header) to the **Express backend** at `http://localhost:3000`.
3. The backend validates the token, applies role-based access control (Admin / Customer), and communicates with **MongoDB Atlas**.
4. **Supabase Storage** handles product image uploads on the frontend.
5. **Google OAuth 2.0** is supported for one-click user login via `@react-oauth/google`.
6. **Nodemailer** sends 6-digit OTP codes for email verification.
7. **Playwright** tests interact with the live frontend and can mock backend API responses to test frontend behavior in isolation.

---

## 🛠️ Technologies Used

### Frontend

| Category | Technology |
|---|---|
| Framework | React 19 (with Vite) |
| Routing | React Router DOM v7 |
| Styling | TailwindCSS v4 |
| HTTP Client | Axios |
| Authentication | JWT (localStorage), Google OAuth (`@react-oauth/google`) |
| Image Storage | Supabase Storage (`@supabase/supabase-js`) |
| Notifications | React Hot Toast |
| Icons | React Icons |
| Build Tool | Vite 7 |
| Linting | ESLint 9 |
| Deployment | Vercel |

### Backend

| Category | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v4 |
| Database | MongoDB (via Mongoose v8) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | bcrypt |
| Email Service | Nodemailer (Gmail SMTP) |
| Google Auth | Axios → Google UserInfo API |
| Config | dotenv |
| Dev Server | Nodemon |
| Middleware | body-parser, cors |

### Testing

| Category | Technology |
|---|---|
| Framework | Playwright v1.58 |
| Language | JavaScript (ES Modules) |
| Browsers | Chromium, Firefox (WebKit available) |
| Reporting | HTML report + console list reporter |
| Patterns | Custom Fixtures, Page Object Model, API Mocking |
| Config | `playwright.config.js` + dotenv |

---

## ✨ Key Features

### Customer Features

- 🔐 **Authentication** — Register, log in with email/password, or sign in instantly with Google OAuth
- 📧 **Email Verification** — OTP-based email verification sent via Nodemailer
- 🎛️ **Product Catalog** — Browse audio equipment with category filters and search
- 📄 **Product Details** — View full specifications, pricing, dimensions, and availability
- 🛒 **Booking System** — Select items, choose rental dates, and submit booking orders
- ⭐ **Reviews** — Submit and view product reviews
- 📬 **Inquiries** — Contact the team through a built-in inquiry form
- 👤 **Profile Management** — Update personal details and view booking history

### Admin Features

- 📊 **Dashboard** — Overview of orders, users, and products
- 📦 **Product Management** — Add, update, and manage the equipment inventory
- 📋 **Order Management** — View, approve, or reject customer bookings
- 👥 **User Management** — List all customers, block or unblock accounts
- 💬 **Review Moderation** — View and manage customer reviews

### Testing Features

- 🧪 **Custom Fixtures** — Reusable Playwright fixtures for authenticated sessions, products page, cart state, and admin access
- 🌐 **API Mocking** — Intercept and mock backend responses to test 6 scenarios: success, empty state, HTTP 500, slow response, and network failure
- ✅ **Assertion Specs** — Dedicated tests for homepage, login, navigation, product list, product overview, and category filtering
- 🔒 **Security Tests** — Verify unauthorized users are redirected away from the admin panel
- 🖥️ **Cross-Browser** — Configured for Chromium and Firefox
- 📸 **Screenshots on Failure** — Automatically captured screenshots for failed test runs

---

## 📁 Folder Structure

```
kv-audio-playwright-qe/
│
├── kv-audio-frontend/               # React SPA (Vite + TailwindCSS)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images and static files
│   │   ├── components/              # Shared UI components
│   │   │   ├── header.jsx
│   │   │   ├── productCard.jsx
│   │   │   ├── bookingItem.jsx
│   │   │   ├── imageSlider.jsx
│   │   │   ├── mobileNavPannel.jsx
│   │   │   └── Footer/
│   │   ├── pages/
│   │   │   ├── home/                # Customer-facing pages
│   │   │   │   ├── home.jsx         # Landing page
│   │   │   │   ├── items.jsx        # Product catalog
│   │   │   │   ├── productOverview.jsx
│   │   │   │   ├── bookingPage.jsx  # Rental booking flow
│   │   │   │   ├── aboutUs.jsx
│   │   │   │   ├── contactUs.jsx
│   │   │   │   └── gallery.jsx
│   │   │   ├── admin/               # Admin panel
│   │   │   │   ├── adminPage.jsx
│   │   │   │   ├── adminBookingPage.jsx
│   │   │   │   ├── adminItemsPage.jsx
│   │   │   │   ├── adminUsersPage.jsx
│   │   │   │   ├── adminReviewsPage.jsx
│   │   │   │   ├── addItemPage.jsx
│   │   │   │   └── updateItemsPage.jsx
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verifyEmail/
│   │   ├── utils/
│   │   ├── App.jsx                  # Root routing
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
├── kv-audio-backend/                # Express.js REST API
│   ├── controllers/
│   │   ├── userController.js        # Auth, Google OAuth, OTP, user management
│   │   ├── productController.js     # Equipment CRUD
│   │   ├── orderController.js       # Booking & order management
│   │   ├── reviewController.js
│   │   └── inquiryController.js
│   ├── models/
│   │   ├── user.js                  # Roles, email verification, block status
│   │   ├── product.js               # Name, price, category, availability
│   │   ├── order.js                 # Items, rental dates, status, total
│   │   ├── review.js
│   │   ├── inquiry.js
│   │   └── otp.js
│   ├── routes/
│   │   ├── userRouter.js
│   │   ├── productRouter.js
│   │   ├── orderRouter.js
│   │   ├── reviewRouter.js
│   │   └── inquiryRouter.js
│   ├── index.js                     # Entry point: Express + MongoDB + middleware
│   └── package.json
│
└── kv-audio-e2e-tests/              # Playwright E2E Test Suite
    ├── tests/
    │   ├── assertions/              # UI assertion test specs
    │   │   ├── homepage.spec.js
    │   │   ├── login-page.spec.js
    │   │   ├── navigation.spec.js
    │   │   ├── product-list.spec.js
    │   │   ├── product-overview.spec.js
    │   │   └── category_filter.spec.js
    │   ├── fixture-showcase.spec.js # Custom Playwright fixtures
    │   ├── products-mock.spec.js    # API mocking scenarios
    │   ├── failing-demo.spec.js
    │   └── example.spec.js
    ├── fixtures/
    ├── mocks/
    ├── utils/
    ├── screenshots/                 # Captured on test failures
    ├── playwright-report/           # Generated HTML report
    ├── playwright.config.js
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Supabase](https://supabase.com/) project (for image storage)
- A [Google Cloud OAuth 2.0](https://console.cloud.google.com/) Client ID

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/kv-audio-playwright-qe.git
cd kv-audio-playwright-qe
```

---

### 2. Backend Setup

```bash
cd kv-audio-backend
npm install
```

Create a `.env` file in `kv-audio-backend/`:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

> **Note:** Use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular Gmail password.

---

### 3. Frontend Setup

```bash
cd kv-audio-frontend
npm install
```

Create a `.env` file in `kv-audio-frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### 4. E2E Tests Setup

```bash
cd kv-audio-e2e-tests
npm install
npx playwright install
```

Create a `.env` file in `kv-audio-e2e-tests/` (refer to `.env.example`):

```env
BASE_URL=http://localhost:5173
```

---

## ▶️ How to Run

### Start the Backend

```bash
cd kv-audio-backend
npm start
```

API server runs at **`http://localhost:3000`**

---

### Start the Frontend

```bash
cd kv-audio-frontend
npm run dev
```

Frontend dev server runs at **`http://localhost:5173`**

---

## 🧪 Running Tests

> **Important:** Start both the **frontend** and **backend** before running tests.

```bash
cd kv-audio-e2e-tests
```

| Command | Description |
|---|---|
| `npm test` | Run all tests headlessly across all configured browsers |
| `npm run test:headed` | Run tests with the browser window visible |
| `npm run test:debug` | Step through tests in debug mode |
| `npm run test:ui` | Open the Playwright interactive UI |
| `npm run test:chrome` | Run on Chromium only |
| `npm run test:firefox` | Run on Firefox only |
| `npm run test:mobile` | Run with a mobile Chrome viewport |
| `npm run report` | Open the last generated HTML report |
| `npm run codegen` | Launch Playwright's test recorder |

### Test Suites

| Suite | What It Covers |
|---|---|
| `tests/assertions/` | UI assertions: homepage, login, navigation, product list, product overview, category filters |
| `fixture-showcase.spec.js` | Custom Playwright fixtures: authenticated sessions, cart state, admin access |
| `products-mock.spec.js` | API mocking: success, empty state, HTTP 500 error, slow response, network failure |
| `failing-demo.spec.js` | Intentional failure demo for reporting demonstration |
| `example.spec.js` | Basic sanity checks and Playwright introductory examples |

---

## 🤝 Contribution

### Core System

The **KV Audio** platform — including the full-stack architecture, REST API design, authentication system (JWT, Google OAuth, OTP email verification), booking & order workflows, admin dashboard, and all UI/UX — was independently designed and developed by **Nisal Gunathilaka** as a personal full-stack portfolio project.

### End-to-End Testing

The Playwright E2E test suite (`kv-audio-e2e-tests`) was developed as part of a **university group assignment**, implemented in collaboration with peers. The testing work covers test strategy and design, custom fixture architecture, API mocking, cross-browser execution, and HTML reporting — and forms an integral part of the overall project.

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

