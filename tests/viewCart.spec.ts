import { test, expect } from "@playwright/test";
import { AddToCartPage } from "../pages/AddToCartPage";
import { CONFIG } from "../config/config";
import { CartPage } from "../pages/CartPage";

test.describe("Add to Cart", () => {
  test("Cart item detail verification", async ({ page }) => {
    const cartPage = new CartPage(page);
    const addToCartPage = new AddToCartPage(page);

    // Ensure the cart is empty
    await cartPage.ensureEmptyCart();

    // Open game details page
    await page.goto(CONFIG.BASE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Get expected values
    const expectedItemName = await addToCartPage.getItemName();
    const expectedItemPrice = await addToCartPage.getItemPrice();

    // Add to cart
    await addToCartPage.clickAddToCart();

    // Go to cart
    await cartPage.viewCart.click();

    // Get actual values
    const { finalCartItemName, finalCartItemPrice } =
      await cartPage.getCartItemInfo();
    console.log("Expected Name:", expectedItemName);
    console.log("Expected Price:", expectedItemPrice);

    console.log("Actual Name:", finalCartItemName);
    console.log("Actual Price:", finalCartItemPrice);
    // Verify
    expect(finalCartItemName).toBe(expectedItemName);
    expect(finalCartItemPrice).toBe(expectedItemPrice);
  });
});
