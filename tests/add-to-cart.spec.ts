import { test, expect } from "@playwright/test";
import { AddToCartPage } from "../pages/AddToCartPage";
import { CONFIG } from "../config/config";
import { CartPage } from "../pages/CartPage";

test.describe("Add to Cart", () => {
  test("Add a game to the cart successfully", async ({ page }) => {
    const cartPage = new CartPage(page);
    const addToCartPage = new AddToCartPage(page);

    // // Check if there are items already in cart, if yes, clear the cart
    await cartPage.ensureEmptyCart();

    // Go to the game detail page
    await page.goto(CONFIG.BASE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Get the item nama, price and click the add to cart button
    const expectedItemName = await addToCartPage.getItemName();
    const expectedItemPrice = await addToCartPage.getItemPrice();

    await addToCartPage.clickAddToCart();

    // Assert the tip, name, price
    const confirmation = await addToCartPage.getConfirmation();

    expect(confirmation.successfulTip).toBe("Added to your cart!");
    expect(confirmation.finalName).toBe(expectedItemName);
    expect(confirmation.finalPrice).toBe(expectedItemPrice);
  });
});
