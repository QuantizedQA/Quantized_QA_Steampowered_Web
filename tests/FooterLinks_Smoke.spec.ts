import { test, expect, Page } from "@playwright/test";
import { POM_Footer } from "../pages/POM_Footer";

/**
 * Smoke coverage for the Steam store footer's core legal links.
 * Each case clicks one link and verifies it lands on the right URL
 * with the right page content. Link labels and destinations below were
 * confirmed against the live footer as of writing this test.
 */
interface FooterLinkCase {
  name: string;
  urlPattern: RegExp;
  verifyContent: (targetPage: Page) => Promise<void>;
}

const footerLinkCases: FooterLinkCase[] = [
  {
    name: "Privacy",
    urlPattern: /store\.steampowered\.com\/privacy_agreement\//,
    verifyContent: async (targetPage) => {
      await expect(targetPage).toHaveTitle(/Privacy Policy Agreement/i);
      await expect(targetPage.locator("h1")).toHaveText("Privacy Policy");
    },
  },
  {
    name: "Notices & Policies",
    urlPattern: /store\.steampowered\.com\/legal\//,
    verifyContent: async (targetPage) => {
      await expect(targetPage).toHaveTitle(/Legal Info/i);
      await expect(targetPage.locator("h2").first()).toHaveText("Legal Info");
    },
  },
  {
    name: "Steam SSA",
    urlPattern: /store\.steampowered\.com\/subscriber_agreement\//,
    verifyContent: async (targetPage) => {
      await expect(targetPage).toHaveTitle(/Steam Subscriber Agreement/i);
    },
  },
  {
    name: "Refunds",
    urlPattern: /store\.steampowered\.com\/steam_refunds\//,
    verifyContent: async (targetPage) => {
      await expect(targetPage).toHaveTitle(/Steam Refunds/i);
      await expect(targetPage.locator(".pageheader").first()).toHaveText(
        "Steam Refunds",
      );
    },
  },
  {
    name: "Cookies",
    urlPattern: /store\.steampowered\.com\/account\/cookiepreferences\//,
    verifyContent: async (targetPage) => {
      await expect(
        targetPage.getByText("Cookies & Browsing", { exact: true }),
      ).toBeVisible();
    },
  },
  {
    name: "Accessibility",
    urlPattern:
      /^https:\/\/help\.steampowered\.com\/(?:[a-z]{2}\/)?faqs\/view\/10BB-D27A-6378-4436\/?$/,
    verifyContent: async (targetPage) => {
      await expect(targetPage).toHaveTitle(
        /Accessibility Conformance Reports/i,
      );
    },
  },
];

test.describe("Footer Links - Legal (Smoke)", () => {
  test.beforeEach(async ({ page }) => {
    const footer = new POM_Footer(page);
    await footer.open();
  });

  for (const { name, urlPattern, verifyContent } of footerLinkCases) {
    test(`"${name}" footer link opens the correct page`, async ({
      page,
      context,
    }) => {
      const footer = new POM_Footer(page);
      const targetPage = await footer.clickLink(name, context);

      await expect(targetPage).toHaveURL(urlPattern);
      await verifyContent(targetPage);

      if (targetPage !== page) {
        await targetPage.close();
      }
    });
  }
});
