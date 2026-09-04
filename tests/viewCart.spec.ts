import { test, expect } from "@playwright/test";
import { AddToCartPage } from "../pages/AddToCartPage";
import { CartPage } from "../pages/CartPage";
import { games } from "../data/games";

test.describe("View Cart", () => {
  test("Cart item detail verification", async ({ page }) => {
    const game = games.palworld;

    const cartPage = new CartPage(page, game.name);
    const addToCartPage = new AddToCartPage(page, game.name);

    // Ensure the cart is empty
    await cartPage.ensureEmptyCart();

    // Open game details page
    await page.goto(game.url, {
      waitUntil: "domcontentloaded",
    });

    // Get expected price
    const expectedItemPrice = await addToCartPage.getItemPrice();

    // Add to cart
    await addToCartPage.clickAddToCart();

    // Go to cart
    await cartPage.viewCart.click();

    // Verify cart item details
    await expect(cartPage.cartItemName).toHaveText(game.name);

    await expect(cartPage.cartItemPrice).toHaveText(expectedItemPrice);
  });
});
