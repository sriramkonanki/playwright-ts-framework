import { Page, Locator, expect } from "@playwright/test";

/**
 * BasePage provides shared helpers used by every page object:
 * navigation, waiting, common assertions, and element utilities.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForUrl(urlOrPattern: string | RegExp, timeout = 10_000): Promise<void> {
    await this.page.waitForURL(urlOrPattern, { timeout });
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  // -------------------------------------------------------------------------
  // Element helpers
  // -------------------------------------------------------------------------
  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  protected getByRole(
    role: Parameters<Page["getByRole"]>[0],
    options?: Parameters<Page["getByRole"]>[1]
  ): Locator {
    return this.page.getByRole(role, options);
  }

  protected getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByText(text, options);
  }

  protected getByLabel(label: string | RegExp): Locator {
    return this.page.getByLabel(label);
  }

  protected getByPlaceholder(placeholder: string | RegExp): Locator {
    return this.page.getByPlaceholder(placeholder);
  }

  // -------------------------------------------------------------------------
  // Waiting
  // -------------------------------------------------------------------------
  async waitForSelector(selector: string, timeout = 10_000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  // -------------------------------------------------------------------------
  // Assertions
  // -------------------------------------------------------------------------
  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async assertText(locator: Locator, expected: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(expected);
  }

  async assertUrl(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expected);
  }

  async assertTitle(expected: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(expected);
  }

  // -------------------------------------------------------------------------
  // Browser state
  // -------------------------------------------------------------------------
  getCurrentUrl(): string {
    return this.page.url();
  }

  async takeScreenshot(name?: string): Promise<Buffer> {
    return this.page.screenshot({ fullPage: true, path: name });
  }
}
