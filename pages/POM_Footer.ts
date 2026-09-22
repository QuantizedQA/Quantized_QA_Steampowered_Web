import { Page, Locator, BrowserContext, expect } from "@playwright/test";

/**
 * POM_Footer
 *
 * Page Object for the Steam store footer.
 * Scopes all link lookups to the <footer> landmark so tests never
 * accidentally match same-named links elsewhere on the page (e.g. the
 * hidden mobile global-menu duplicates of these same links).
 */
export class POM_Footer {
  readonly page: Page;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = page.locator("footer");
  }

  async open() {
    await this.page.goto("https://store.steampowered.com/", {
      waitUntil: "domcontentloaded",
    });
  }

  getLink(name: string): Locator {
    return this.footer.getByRole("link", { name, exact: true });
  }

  /**
   * Clicks a footer link and returns the page it navigated to.
   * Handles both same-tab navigation and links that open a new tab.
   */
  async clickLink(name: string, context: BrowserContext): Promise<Page> {
    const link = this.getLink(name);
    await expect(link).toBeVisible();

    const newPagePromise = context
      .waitForEvent("page", { timeout: 5000 })
      .catch(() => null);
    await link.click();
    const newPage = await newPagePromise;

    if (newPage) {
      await newPage.waitForLoadState("domcontentloaded");
      return newPage;
    }

    await this.page.waitForLoadState("domcontentloaded");
    return this.page;
  }
}
