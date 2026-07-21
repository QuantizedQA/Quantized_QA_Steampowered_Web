import { test, expect } from '@playwright/test';

// 
test.describe('Steam Store - Game Details Page', () => {
  test('search and open a game, verify key details load', async ({ page }) => {  
  // Step 1: Go to Steam homepage
  await page.goto('https://store.steampowered.com/');

  const acceptAllButton = page.getByText('Accept All', { exact: true });
  await acceptAllButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  if (await acceptAllButton.isVisible()) {
    await acceptAllButton.click();
    await acceptAllButton.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  // Step 2: Search for a game
  const searchInput = page.getByRole('combobox', { name: /search the store/i });
  await searchInput.click();
  await searchInput.fill('Meowgic');

  // Step 3: Select and click the first game from the dropdown list
  const firstSuggestion = page.getByRole('link', { name: /meowgic/i }).first();
  await expect(firstSuggestion).toBeVisible({ timeout: 10000 });
  // TODO: Fix the failing test
  await firstSuggestion.click();

  await expect(page).toHaveURL(/\/app\/\d+\/Meowgic/i);

  // Step 4: Verify Title
  const title = page.locator('.apphub_AppName');
  await expect(title).toHaveText(/Meowgic/i, { timeout: 10000 });

  // Step 5: Verify Game details - Price and Description
  const price = page.locator('.game_purchase_price, .discount_final_price').first();
  await expect(price).toBeVisible();
  const priceText = await price.innerText();
  expect(priceText.trim().length).toBeGreaterThan(0);

  const description = page.locator('#game_area_description');
  await expect(description).toBeVisible();
  const descText = await description.innerText();
  expect(descText.trim().length).toBeGreaterThan(20);
  });
});