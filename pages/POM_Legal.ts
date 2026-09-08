import { Page, Locator, expect, BrowserContext } from "@playwright/test";

export class POM_Legal {
  readonly page: Page;

  // Centralized URLs
  readonly urls = {
    HOME: "https://store.steampowered.com/",
    ACCESSIBILITY_PAGE:
      "https://help.steampowered.com/en/faqs/view/10BB-D27A-6378-4436",
    PRIVACY: "https://store.steampowered.com/privacy_agreement/",
    LEGAL: "https://store.steampowered.com/legal/",
    SUBSCRIBER_AGREEMENT:
      "https://store.steampowered.com/subscriber_agreement/",
    REFUNDS: "https://store.steampowered.com/steam_refunds/",
    COOKIES: "https://store.steampowered.com/account/cookiepreferences/",
    PRIVACY_SPANISH:
      "https://store.steampowered.com/privacy_agreement/spanish/",
  };

  // Locators
  readonly storeReportLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.storeReportLink = page.getByRole("link", {
      name: "Valve Accessibility Compliance Report - Steam Store",
    });
  }

  // Navigation & Page Actions
  async navigateToHome() {
    await this.page.goto(this.urls.HOME, { waitUntil: "domcontentloaded" });
  }

  async scrollToFooter() {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight),
    );
  }

  async clickFooterLink(selector: string, context: BrowserContext) {
    await this.scrollToFooter();

    // Search directly on page to avoid responsive container mismatches
    const link = this.page.locator(selector).first();
    await expect(link).toBeVisible({ timeout: 10000 });

    const pagePromise = context.waitForEvent("page").catch(() => null);
    await link.click();
    const newPage = await pagePromise;

    if (newPage) {
      await newPage.waitForLoadState("domcontentloaded");
      return newPage;
    }

    await this.page.waitForLoadState("domcontentloaded");
    return this.page;
  }

  async downloadAccessibilityReport() {
    await this.page.goto(this.urls.ACCESSIBILITY_PAGE, {
      waitUntil: "domcontentloaded",
    });
    await expect(this.storeReportLink).toBeVisible({ timeout: 10000 });

    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.storeReportLink.click(),
    ]);

    return download;
  }
}
