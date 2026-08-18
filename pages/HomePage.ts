import { Page, Locator } from "@playwright/test";

/**
 * HomePage
 *
 * Page Object for the Steam homepage.
 * Contains reusable locators and actions for the main navigation.
 */

export class HomePage {
  readonly page: Page;

  // Main navigation links
  readonly nav: Locator;
  readonly storeLink: Locator;
  readonly communityLink: Locator;
  readonly aboutLink: Locator;
  readonly supportLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nav = page.getByRole("navigation", { name: "Global Menu" });

    this.storeLink = this.nav.getByRole("link", {
      name: "STORE",
      exact: true,
    });

    this.communityLink = this.nav.getByRole("link", {
      name: "COMMUNITY",
      exact: true,
    });

    this.aboutLink = this.nav.getByRole("link", {
      name: "About",
      exact: true,
    });

    this.supportLink = this.nav.getByRole("link", {
      name: "SUPPORT",
      exact: true,
    });
  }

  // Opens the Steam homepage

  async open() {
    await this.page.goto("https://store.steampowered.com/", {
      waitUntil: "domcontentloaded",
    });
  }

  async clickStore() {
    await this.storeLink.click();
  }

  async clickCommunity() {
    await this.communityLink.click();
  }

  async clickAbout() {
    await this.aboutLink.click();
  }

  async clickSupport() {
    await this.supportLink.click();
  }
}
