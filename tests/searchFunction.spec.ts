import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    //navigate to the target application homepage before each test
    await page.goto("https://store.steampowered.com/");
  });

  test("Return relevant result for valid search item", async ({ page }) => {
    // find search field
    const searchInput = page.getByPlaceholder("Search the store");
    // fill search field with a game called Portal
    searchInput.fill("Portal");
    // press Enter
    await searchInput.press("Enter");
    // page has correct URL
    await expect(page).toHaveURL(
      "https://store.steampowered.com/search?term=Portal",
    );
    // assert that the search results grid is visible
    const resultList = page.locator("#search_results");
    expect(resultList).toBeDefined();
    // assert all results contain 'portal'
    const searchItems = page.locator(".search_name > .title");
    const allTexts = await searchItems.allTextContents();
    expect(allTexts.every((text) => /portal/i.test(text))).toBe(true);
  });
});
