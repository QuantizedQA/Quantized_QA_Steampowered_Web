import { test, expect } from "@playwright/test";
import { AddToCartPage } from "../pages/AddToCartPage";
import { CartPage } from "../pages/CartPage";
import { games } from "../data/games";

test.describe("Add to Cart", () => {
  test("Add a game to the cart successfully", async ({ page }) => {
    const game = games.palworld;

    const cartPage = new CartPage(page, game.name);
    const addToCartPage = new AddToCartPage(page, game.name);

    // Check if there are items already in cart, if yes, clear the cart
    await cartPage.ensureEmptyCart();

    // Go to the selected game detail page
    await page.goto(game.url, {
      waitUntil: "domcontentloaded",
    });

    // Get the item price from the product page
    const expectedItemPrice = await addToCartPage.getItemPrice();

    // Add the game to the cart
    await addToCartPage.clickAddToCart();

    // Assert the confirmation message, item name, and price
    await expect(addToCartPage.successfulTip).toHaveText("Added to your cart!");

    await expect(addToCartPage.confirmedItemName).toHaveText(game.name);

    await expect(addToCartPage.confirmedItemPrice).toHaveText(
      expectedItemPrice,
    );
  });
});
