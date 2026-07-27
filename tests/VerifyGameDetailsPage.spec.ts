import { test, expect } from "@playwright/test";

//
test.describe("Steam Store - Game Details Page", () => {
  test("search meowgic game and open, verify key details load", async ({
    page,
  }) => {
    await page.goto("https://store.steampowered.com/");

    const acceptAllButton = page.getByRole("button", { name: "Accept All" });
    if (await acceptAllButton.isVisible().catch(() => false)) {
      await acceptAllButton.click();
    }

    const searchInput = page.getByRole("combobox", {
      name: /search the store/i,
    });
    await searchInput.click();
    await searchInput.fill("Meowgic");

    // Press Enter to go to search results
    await page.keyboard.press("Enter");

    // Wait for search results page to load and click the Meowgic result
    const meowgicResult = page.getByRole("link", { name: /Meowgic/i }).first();
    await expect(meowgicResult).toBeVisible();
    await meowgicResult.click();

    // From here, your existing checks are fine
    await expect(page).toHaveURL(/\/app\/\d+\//);

    const title = page.locator("#appHubAppName");
    await expect(title).toBeVisible();
    await expect(title).toHaveText(/Meowgic/i);

    const price = page
      .locator(".game_purchase_price, .discount_final_price")
      .first();
    await expect(price).toBeVisible();
    await expect(price).not.toHaveText(/^$/);

    const description = page.locator("#game_area_description");
    await expect(description).toBeVisible();
    await expect(description).toHaveText(/./s);
  });

  test("Steam Counter Strike 2 page shows basic info", async ({ page }) => {
    // 1. Navigate to the game page
    await page.goto("https://store.steampowered.com/app/730/CounterStrike_2/");

    // 2. Basic sanity check: URL contains the app id
    await expect(page).toHaveURL(/\/app\/730/);

    // 3. Game title should be visible and correct
    const title = page.locator("#appHubAppName");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("Counter-Strike 2");

    // 4. Release date should be visible and non-empty
    const releaseDate = page.locator(".release_date .date");
    await expect(releaseDate).toBeVisible();
    await expect(releaseDate).toHaveText(/2012/);
  });
});
