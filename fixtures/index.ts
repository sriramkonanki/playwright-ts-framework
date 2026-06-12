import { test as base, APIRequestContext, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/login.page";
import { DashboardPage } from "../src/pages/dashboard.page";
import { UsersApiClient } from "../src/api/users.api";
import { AuthApiClient } from "../src/api/auth.api";

// ---------------------------------------------------------------------------
// Shape of all custom fixtures
// ---------------------------------------------------------------------------
export type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export type ApiFixtures = {
  usersApi: UsersApiClient;
  authApi: AuthApiClient;
  authenticatedRequest: APIRequestContext;
};

// ---------------------------------------------------------------------------
// Extended test object with page fixtures
// ---------------------------------------------------------------------------
export const test = base.extend<TestFixtures & ApiFixtures>({
  // --- Page Objects --------------------------------------------------------
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // --- API Clients ---------------------------------------------------------
  usersApi: async ({ request, baseURL }, use) => {
    const client = new UsersApiClient(request, baseURL ?? "https://reqres.in");
    await use(client);
  },

  authApi: async ({ request, baseURL }, use) => {
    const client = new AuthApiClient(request, baseURL ?? "https://reqres.in");
    await use(client);
  },

  // --- Pre-authenticated API request context -------------------------------
  authenticatedRequest: async ({ playwright, baseURL }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: baseURL ?? "https://reqres.in",
      extraHTTPHeaders: {
        "Authorization": `Bearer ${process.env.AUTH_TOKEN ?? "test-token"}`,
        "Content-Type": "application/json",
      },
    });
    await use(apiContext);
    await apiContext.dispose();
  },
});

export { expect };
