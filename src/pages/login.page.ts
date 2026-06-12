import { Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * LoginPage — page object for the login screen.
 * Targets a generic login form; adjust selectors to match your app.
 */
export class LoginPage extends BasePage {
  // ---- Locators -----------------------------------------------------------
  readonly emailInput = this.page.getByLabel(/email/i);
  readonly passwordInput = this.page.getByLabel(/password/i);
  readonly submitButton = this.page.getByRole("button", { name: /sign in|log in/i });
  readonly errorMessage = this.page.getByRole("alert");
  readonly forgotPasswordLink = this.page.getByRole("link", { name: /forgot password/i });

  constructor(page: Page) {
    super(page);
  }

  // ---- Actions ------------------------------------------------------------
  async goto(): Promise<void> {
    await this.navigate("/login");
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /** Full happy-path login. Returns the page URL after redirect. */
  async login(email: string, password: string): Promise<string> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
    await this.page.waitForLoadState("networkidle");
    return this.getCurrentUrl();
  }

  // ---- Assertions ---------------------------------------------------------
  async assertLoginFormVisible(): Promise<void> {
    await this.assertVisible(this.emailInput);
    await this.assertVisible(this.passwordInput);
    await this.assertVisible(this.submitButton);
  }

  async assertErrorVisible(message?: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async assertEmailError(message: string | RegExp): Promise<void> {
    const error = this.page.locator('[data-testid="email-error"], [id*="email-error"]');
    await expect(error).toContainText(message);
  }
}
