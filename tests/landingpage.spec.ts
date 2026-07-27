import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://store.steampowered.com/");
  await expect(page).toHaveTitle("Welcome to Steam");
  await expect(page).toHaveURL("https://store.steampowered.com/");
});
