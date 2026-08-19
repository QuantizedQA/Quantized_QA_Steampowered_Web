import { test, expect } from '@playwright/test';
import { POM_Legal } from '../pages/POM_Legal';

test.describe('Steam Footer Links - User Flow', () => {

  // Test data referencing page object properties and selectors
  const footerLinkTests = [
    {
      name: 'Privacy Policy',
      selector: 'a[href*="privacy_agreement"], a:has-text("Privacy")',
      expectedHeader: /privacy policy/i,
      getUrl: (pom: POM_Legal) => pom.urls.PRIVACY,
    },
    {
      name: 'Accessibility',
      selector: 'a[href*="accessibility"], a:has-text("Accessibility")',
      expectedHeader: /accessibility/i,
      getUrl: (pom: POM_Legal) => pom.urls.ACCESSIBILITY_PAGE,
    },
    {
      name: 'Notices & Policies',
      selector: 'a[href*="legal"], a:has-text("Notices"), a:has-text("Legal")',
      expectedHeader: /legal info|notices/i,
      getUrl: (pom: POM_Legal) => pom.urls.LEGAL,
    },
    {
      name: 'Subscriber Agreement',
      selector: 'a[href*="subscriber_agreement"], a:has-text("Subscriber Agreement")',
      expectedHeader: /subscriber agreement/i,
      getUrl: (pom: POM_Legal) => pom.urls.SUBSCRIBER_AGREEMENT,
    },
    {
      name: 'Refunds',
      selector: 'a[href*="steam_refunds"], a:has-text("Refunds")',
      expectedHeader: /steam refunds|refunds/i,
      getUrl: (pom: POM_Legal) => pom.urls.REFUNDS,
    },
    {
      name: 'Cookie Preferences',
      selector: 'a[href*="cookiepreferences"], a:has-text("Cookies")',
      expectedHeader: /cookies & browsing|cookie/i,
      getUrl: (pom: POM_Legal) => pom.urls.COOKIES,
    },
  ];

  // Loop through each footer link test case using POM_Legal
  for (const item of footerLinkTests) {
    test(`user clicks ${item.name} from homepage, verifies page, and returns home`, async ({ context, page }) => {
      const pomLegal = new POM_Legal(page);

      // 1. Navigate to home page
      await pomLegal.navigateToHome();

      // 2. Click footer link via POM method
      const targetPage = await pomLegal.clickFooterLink(item.selector, context);

      // 3. Verify target URL using central POM links
      await expect(targetPage).toHaveURL(item.getUrl(pomLegal));

      // 4. Verify page header content
      const pageHeader = targetPage.locator('h1, h2, .privacy_header_title, .faq_title, #main_content, .page_sub_header, body')
        .filter({ hasText: item.expectedHeader })
        .first();
      await expect(pageHeader).toBeVisible();

      // 5. Clean up tabs or navigate back home
      if (targetPage !== page) {
        await targetPage.close();
      } else {
        await pomLegal.navigateToHome();
        await expect(page).toHaveURL(pomLegal.urls.HOME);
      }
    });
  }

  // Separate language test for Spanish in Privacy Policy
  test('user navigates to Privacy Policy and switches language to Spanish', async ({ context, page }) => {
    const pomLegal = new POM_Legal(page);

    await pomLegal.navigateToHome();
    const targetPage = await pomLegal.clickFooterLink('a[href*="privacy_agreement"], a:has-text("Privacy")', context);

    // Handle language selection specifically on the Privacy Policy page
    const spanishLink = targetPage.locator('#languages a[href*="spanish"], .privacy_policy_languages a[href*="spanish"], a[href*="privacy_agreement/spanish"]').first();

    if (await spanishLink.isVisible()) {
      await spanishLink.click();
    } else {
      await targetPage.goto(pomLegal.urls.PRIVACY_SPANISH, { waitUntil: 'domcontentloaded' });
    }

    await expect(targetPage).toHaveURL(pomLegal.urls.PRIVACY_SPANISH);
    const spanishHeader = targetPage.locator('h1, h2, .privacy_header_title, body').filter({ hasText: /política de privacidad/i }).first();
    await expect(spanishHeader).toBeVisible();
  });

  // Test downloading the Accessibility Compliance Report PDF via POM
  test('user navigates to Accessibility page and downloads compliance report', async ({ page }) => {
    const pomLegal = new POM_Legal(page);

    const download = await pomLegal.downloadAccessibilityReport();
    expect(download.suggestedFilename()).toMatch('acr_store');
  });

});