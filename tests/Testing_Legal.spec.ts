import { test, expect } from '@playwright/test';
import { POM_Legal } from '../pages/POM_Legal';

test.describe('Steam Footer Links - User Flow', () => {

  // Test data referencing page object properties, selectors, header regex, and body text regex
  const footerLinkTests = [
    {
      name: 'Privacy Policy',
      selector: 'a[href*="privacy_agreement"]:visible, a:has-text("Privacy"):visible',
      expectedHeader: /privacy policy/i,
      expectedBody: /valve corporation|personal data|privacy policy/i,
      getUrl: (pom: POM_Legal) => pom.urls.PRIVACY,
    },
    {
      name: 'Accessibility',
      selector: 'a[href*="accessibility"]:visible, a:has-text("Accessibility"):visible',
      expectedHeader: /accessibility/i,
      expectedBody: /valve is committed|voluntary product accessibility template|vpat/i,
      getUrl: (pom: POM_Legal) => pom.urls.ACCESSIBILITY_PAGE,
    },
    {
      name: 'Notices & Policies',
      selector: 'a[href*="legal"]:visible, a:has-text("Notices"):visible',
      expectedHeader: /legal info|notices/i,
      expectedBody: /trademarks|copyright|valve corporation/i,
      getUrl: (pom: POM_Legal) => pom.urls.LEGAL,
    },
    {
      name: 'Subscriber Agreement',
      selector: 'a[href*="subscriber_agreement"]:visible, a:has-text("Subscriber Agreement"):visible',
      expectedHeader: /subscriber agreement/i,
      expectedBody: /steam account|agreement|steam services/i,
      getUrl: (pom: POM_Legal) => pom.urls.SUBSCRIBER_AGREEMENT,
    },
    {
      name: 'Refunds',
      selector: 'a[href*="steam_refunds"]:visible, a:has-text("Refunds"):visible',
      expectedHeader: /steam refunds|refunds/i,
      expectedBody: /14 days|two hours|valve will/i,
      getUrl: (pom: POM_Legal) => pom.urls.REFUNDS,
    },
    {
      name: 'Cookie Preferences',
      selector: 'a[href*="cookiepreferences"]:visible, a:has-text("Cookies"):visible',
      expectedHeader: /cookies & browsing|cookie/i,
      expectedBody: /cookies|browser|preferences/i,
      getUrl: (pom: POM_Legal) => pom.urls.COOKIES,
    },
  ];

  // Loop through each footer link test case using POM_Legal
  for (const item of footerLinkTests) {
    test(`user clicks ${item.name} from homepage, verifies header & body, and returns home`, async ({ context, page }) => {
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

      // 5. Verify page body content
      const pageBody = targetPage.locator('body, #main_content, #news_column, .privacy_policy_content')
        .filter({ hasText: item.expectedBody })
        .first();
      await expect(pageBody).toBeVisible();

      // 6. Clean up tabs or navigate back home
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
    const targetPage = await pomLegal.clickFooterLink('a[href*="privacy_agreement"]:visible, a:has-text("Privacy"):visible', context);

    // Handle language selection specifically on the Privacy Policy page
    const spanishLink = targetPage.locator('#languages a[href*="spanish"], .privacy_policy_languages a[href*="spanish"], a[href*="privacy_agreement/spanish"]').first();

    if (await spanishLink.isVisible()) {
      await spanishLink.click();
    } else {
      await targetPage.goto(pomLegal.urls.PRIVACY_SPANISH, { waitUntil: 'domcontentloaded' });
    }

    await expect(targetPage).toHaveURL(pomLegal.urls.PRIVACY_SPANISH);
    
    // Verify Spanish header
    const spanishHeader = targetPage.locator('h1, h2, .privacy_header_title, body').filter({ hasText: /política de privacidad/i }).first();
    await expect(spanishHeader).toBeVisible();

    // Verify Spanish body content
    const spanishBody = targetPage.locator('body').filter({ hasText: /datos personales|información/i }).first();
    await expect(spanishBody).toBeVisible();
  });

  // Test downloading the Accessibility Compliance Report PDF via POM
  test('user navigates to Accessibility page and downloads compliance report', async ({ page }) => {
    const pomLegal = new POM_Legal(page);

    const download = await pomLegal.downloadAccessibilityReport();
    expect(download.suggestedFilename()).toMatch('acr_store');
  });

});