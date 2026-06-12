import { test, expect } from "../../fixtures";

/**
 * Login page E2E tests.
 * These target a generic login UI — update BASE_URL/.env.local to point at your app.
 */
test.describe("Login Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("should display login form elements", async ({ loginPage }) => {
    await loginPage.assertLoginFormVisible();
  });

  test("should show error on invalid credentials", async ({ loginPage }) => {
    await loginPage.login("invalid@example.com", "wrongpassword");
    // Adjust assertion to match your app's error UI
    await loginPage.assertErrorVisible();
  });

  test("should navigate to forgot password page", async ({ loginPage, page }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/forgot/i);
  });

  test("should toggle password visibility", async ({ loginPage }) => {
    await loginPage.fillPassword("secretpassword");
    // Many apps have a show/hide toggle — adapt to your locator
    const toggleButton = loginPage.page.getByRole("button", { name: /show|hide password/i });
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(loginPage.passwordInput).toHaveAttribute("type", "text");
    } else {
      test.skip();
    }
  });
});
