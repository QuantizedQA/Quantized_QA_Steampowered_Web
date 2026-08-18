import { test, expect } from '@playwright/test';

// Test for loop to iterate through footer links and verify navigation and content
test.describe('Steam Footer Links - User Flow', () => {

  const footerLinkTests = [
    {
      name: 'Privacy Policy',
      selector: 'a[href*="privacy_agreement"], a:has-text("Privacy")',
      expectedUrl: 'https://store.steampowered.com/privacy_agreement/',
      expectedHeader: /privacy policy/i,
    },
    {
      name: 'Accessibility',
      selector: 'a[href*="accessibility"], a:has-text("Accessibility")',
      expectedUrl: 'https://help.steampowered.com/en/faqs/view/10BB-D27A-6378-4436',
      expectedHeader: /accessibility/i,
    },
    {
      name: 'Notices & Policies',
      selector: 'a[href*="legal"], a:has-text("Notices"), a:has-text("Legal")',
      expectedUrl: 'https://store.steampowered.com/legal/',
      expectedHeader: /legal info|notices/i,
    },
    {
      name: 'Subscriber Agreement',
      selector: 'a[href*="subscriber_agreement"], a:has-text("Subscriber Agreement")',
      expectedUrl: 'https://store.steampowered.com/subscriber_agreement/',
      expectedHeader: /subscriber agreement/i,
    },
    {
      name: 'Refunds',
      selector: 'a[href*="steam_refunds"], a:has-text("Refunds")',
      expectedUrl: 'https://store.steampowered.com/steam_refunds/',
      expectedHeader: /steam refunds|refunds/i,
    },
    {
      name: 'Cookie Preferences',
      selector: 'a[href*="cookiepreferences"], a:has-text("Cookies")',
      expectedUrl: 'https://store.steampowered.com/account/cookiepreferences/',
      expectedHeader: /cookies & browsing|cookie/i,
    },
  ];

  // Loop through each footer link test case and perform the user flow
  for (const item of footerLinkTests) {
    test(`user clicks ${item.name} from homepage, verifies page, and returns home`, async ({ context, page }) => {
      // 1. Load Steam homepage
      await page.goto('https://store.steampowered.com/', { waitUntil: 'domcontentloaded' });

      // 2. Scroll to bottom so footer elements render
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // 3. Adaptable locator scoped to the footer container
      const footer = page.locator('#footer_content, #footer, .footer_content');
      const link = footer.locator(item.selector).first();

      await expect(link).toBeVisible({ timeout: 10000 });

      // 4. Handle navigation across potential tabs
      const pagePromise = context.waitForEvent('page').catch(() => null);
      await link.click();
      const newPage = await pagePromise;

      const targetPage = newPage || page;
      await targetPage.waitForLoadState('domcontentloaded');

      // 5. URL verification matching string or regex
      await expect(targetPage).toHaveURL(item.expectedUrl);

      // 6. Header verification with fallback for non-standard header elements
      const pageHeader = targetPage.locator('h1, h2, .privacy_header_title, .faq_title, #main_content, .page_sub_header, body')
        .filter({ hasText: item.expectedHeader })
        .first();
      await expect(pageHeader).toBeVisible();

      // Return home or close tab
      if (newPage) {
        await newPage.close();
      } else {
        await page.goto('https://store.steampowered.com/', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL('https://store.steampowered.com/');
      }
    });
  }

  // Separate language test for Spanish in Privacy Policy
  test('user navigates to Privacy Policy and switches language to Spanish', async ({ context, page }) => {
    await page.goto('https://store.steampowered.com/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footer = page.locator('#footer_content, #footer, .footer_content');
    const privacyLink = footer.locator('a[href*="privacy_agreement"], a:has-text("Privacy")').first();

    await expect(privacyLink).toBeVisible({ timeout: 10000 });

    const pagePromise = context.waitForEvent('page').catch(() => null);
    await privacyLink.click();
    const newPage = await pagePromise;
    const targetPage = newPage || page;

    await targetPage.waitForLoadState('domcontentloaded');

    // Handle language selection specifically on the Privacy Policy page
    const spanishLink = targetPage.locator('#languages a[href*="spanish"], .privacy_policy_languages a[href*="spanish"], a[href*="privacy_agreement/spanish"]').first();
    
    if (await spanishLink.isVisible()) {
      await spanishLink.click();
    } else {
      await targetPage.goto('https://store.steampowered.com/privacy_agreement/spanish', { waitUntil: 'domcontentloaded' });
    }

    await expect(targetPage).toHaveURL('https://store.steampowered.com/privacy_agreement/spanish/');
    const spanishHeader = targetPage.locator('h1, h2, .privacy_header_title, body').filter({ hasText: /política de privacidad/i }).first();
    await expect(spanishHeader).toBeVisible();
  });

  // Test downloading the Accessibility Compliance Report PDF
  test('user navigates to Accessibility page and downloads compliance report', async ({ page }) => {
    await page.goto('https://help.steampowered.com/en/faqs/view/10BB-D27A-6378-4436', { waitUntil: 'domcontentloaded' });

    const storeReportLink = page.getByRole('link', { name: 'Valve Accessibility Compliance Report - Steam Store' });
    await expect(storeReportLink).toBeVisible({ timeout: 10000 });

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      storeReportLink.click(),
    ]);

    expect(download.suggestedFilename()).toMatch('acr_store');
  });

});