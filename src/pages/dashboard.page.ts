import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  // ---- Locators -----------------------------------------------------------
  readonly heading = this.page.getByRole("heading", { level: 1 });
  readonly userMenu = this.page.getByRole("button", { name: /account|profile|avatar/i });
  readonly logoutButton = this.page.getByRole("menuitem", { name: /log out|sign out/i });
  readonly navLinks = this.page.getByRole("navigation").getByRole("link");
  readonly notificationBell = this.page.getByRole("button", { name: /notifications/i });

  constructor(page: Page) {
    super(page);
  }

  // ---- Actions ------------------------------------------------------------
  async goto(): Promise<void> {
    await this.navigate("/dashboard");
  }

  async logout(): Promise<void> {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  async clickNavLink(label: string): Promise<void> {
    await this.page.getByRole("navigation").getByRole("link", { name: label }).click();
  }

  // ---- Assertions ---------------------------------------------------------
  async assertOnDashboard(): Promise<void> {
    await this.assertUrl(/dashboard/);
    await this.assertVisible(this.heading);
  }

  async assertWelcomeMessage(userName: string): Promise<void> {
    await this.assertVisible(this.page.getByText(new RegExp(userName, "i")));
  }

  async getNavLinkCount(): Promise<number> {
    return this.navLinks.count();
  }
}
