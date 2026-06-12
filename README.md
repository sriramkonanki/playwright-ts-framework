# Playwright + TypeScript Test Framework

A production-ready test framework built with **Playwright**, **TypeScript**, the **Page Object Model**, typed **API clients**, and **CI/CD via GitHub Actions**.

---

## Features

- **Playwright + TypeScript** — full type safety across every test
- **Page Object Model** — reusable, maintainable UI abstractions
- **Typed API clients** — structured wrappers around Playwright's `APIRequestContext`
- **Custom fixtures** — shared pages and API clients injected via Playwright's fixture system
- **Multi-browser matrix** — Chromium, Firefox, WebKit, and Mobile Chrome
- **API test project** — headless API tests in their own Playwright project
- **GitHub Actions CI** — lint → API tests → E2E matrix → merged HTML report

---

## Project Structure

```
playwright-framework/
├── src/
│   ├── pages/                  # Page Object Model
│   │   ├── base.page.ts        # Shared helpers (nav, wait, assert)
│   │   ├── login.page.ts
│   │   └── dashboard.page.ts
│   ├── api/                    # Typed API clients
│   │   ├── base.api.ts         # HTTP verbs, auth headers, error handling
│   │   ├── users.api.ts
│   │   └── auth.api.ts
│   ├── utils/
│   │   └── helpers.ts          # Data generators, env helpers, validators
│   └── types/
│       └── api.types.ts        # Shared TypeScript interfaces
├── fixtures/
│   └── index.ts                # Custom Playwright fixtures (pages + API clients)
├── tests/
│   ├── e2e/
│   │   └── login.spec.ts       # UI tests using page objects
│   └── api/
│       ├── users.spec.ts       # CRUD API tests
│       └── auth.spec.ts        # Auth endpoint tests
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI/CD pipeline
├── playwright.config.ts
├── tsconfig.json
├── .eslintrc.json
└── .env.example
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install --with-deps
```

### 3. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your BASE_URL, API_BASE_URL, etc.
```

### 4. Run tests

```bash
# All tests
npm test

# E2E only (Chromium)
npm run test:e2e

# API only
npm run test:api

# Headed mode (watch the browser)
npm run test:headed

# Interactive UI mode
npm run test:ui

# Debug mode
npm run test:debug
```

### 5. View the HTML report

```bash
npm run test:report
```

---

## Architecture

### Page Object Model

Every page extends `BasePage`, which provides:

- Navigation helpers (`navigate`, `waitForUrl`)
- Element accessors (`getByTestId`, `getByRole`, `getByLabel`, etc.)
- Common assertions (`assertVisible`, `assertText`, `assertUrl`)

```typescript
// src/pages/login.page.ts
export class LoginPage extends BasePage {
  readonly emailInput = this.page.getByLabel(/email/i);
  readonly submitButton = this.page.getByRole("button", { name: /sign in/i });

  async login(email: string, password: string): Promise<string> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    return this.getCurrentUrl();
  }
}
```

### API Clients

Every API client extends `BaseApiClient`, which handles:

- Auth header injection via `setAuthToken()`
- Typed `get`, `post`, `put`, `patch`, `delete` methods
- Raw response access for negative test cases
- Automatic JSON parsing and error throwing

```typescript
// src/api/users.api.ts
export class UsersApiClient extends BaseApiClient {
  async getUser(id: number): Promise<SingleResponse<User>> {
    return this.get<SingleResponse<User>>(`/api/users/${id}`);
  }

  async getUserRaw(id: number): Promise<APIResponse> {
    return this.getRaw(`/api/users/${id}`); // for 4xx assertions
  }
}
```

### Custom Fixtures

Page objects and API clients are injected via Playwright's fixture system — no manual instantiation in tests.

```typescript
// fixtures/index.ts
export const test = base.extend<TestFixtures & ApiFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  usersApi: async ({ request, baseURL }, use) =>
    use(new UsersApiClient(request, baseURL ?? "")),
});
```

```typescript
// tests/api/users.spec.ts
import { test, expect } from "../../fixtures";

test("creates a user", async ({ usersApi }) => {
  const user = await usersApi.createUser({ name: "Jane", job: "QA" });
  expect(user.id).toBeTruthy();
});
```

---

## Configuration

`playwright.config.ts` defines five projects:

| Project | Matches | Runs on |
|---|---|---|
| `chromium` | `tests/e2e/**` | Desktop Chrome |
| `firefox` | `tests/e2e/**` | Desktop Firefox |
| `webkit` | `tests/e2e/**` | Desktop Safari |
| `mobile-chrome` | `tests/e2e/**` | Pixel 5 emulation |
| `api` | `tests/api/**` | No browser |

Key settings:

| Setting | Local | CI |
|---|---|---|
| `retries` | 0 | 2 |
| `workers` | Auto | 2 |
| `trace` | Off | On first retry |
| `screenshot` | On failure | On failure |

---

## CI/CD Pipeline

The GitHub Actions workflow in `.github/workflows/playwright.yml` runs three jobs:

```
lint → api-tests ──┐
lint → e2e-tests ──┴── merge-reports
```

**Triggers:** push/PR to `main`/`develop`, nightly schedule, and manual `workflow_dispatch` with suite/browser selectors.

### Setting up GitHub Secrets and Variables

In your repository go to **Settings → Secrets and variables → Actions** and add:

| Type | Name | Description |
|---|---|---|
| Secret | `AUTH_TOKEN` | Bearer token for authenticated API calls |
| Variable | `BASE_URL` | Your app's base URL (e.g. `https://app.example.com`) |
| Variable | `API_BASE_URL` | Your API's base URL |

### Artifacts

After each run, Playwright HTML reports are uploaded as artifacts and retained for 14 days (30 days for the merged report).

---

## Adding Tests

### New page object

```bash
# Create src/pages/my-feature.page.ts extending BasePage
# Add fixture to fixtures/index.ts
# Write tests in tests/e2e/my-feature.spec.ts
```

### New API endpoint

```bash
# Add method to the relevant API client (or create src/api/my-resource.api.ts)
# Add fixture to fixtures/index.ts
# Write tests in tests/api/my-resource.spec.ts
```

---

## Scripts

| Command | Description |
|---|---|
| `npm test` | Run all tests |
| `npm run test:e2e` | E2E tests on Chromium only |
| `npm run test:api` | API tests only |
| `npm run test:headed` | Open browser during test run |
| `npm run test:debug` | Pause on each step |
| `npm run test:ui` | Playwright interactive UI mode |
| `npm run test:report` | Open last HTML report |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check (no emit) |

---

## Demo API

By default, tests run against [reqres.in](https://reqres.in) — a public mock REST API — so you can validate the setup immediately without a real backend. Point `BASE_URL` / `API_BASE_URL` at your app when ready.
