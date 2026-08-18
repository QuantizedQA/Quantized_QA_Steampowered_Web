import { Page, Locator, expect } from "@playwright/test";
import { CONFIG } from "../config/config";

export class CartPage {
  readonly page: Page;
  readonly emptyCart: Locator;
  readonly clearCartbtn: Locator;
  readonly viewCart: Locator;
  readonly cartItem: Locator;
  readonly cartItemName: Locator;
  readonly cartItemPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCart = page.getByText("Your cart is empty.");
    this.clearCartbtn = page.getByRole("button", { name: "Remove all items" });
    this.viewCart = page.getByRole("button", { name: /^View My Cart/ });
    // Get the first item region in cart
    this.cartItem = page
      .getByRole("button")
      .filter({ has: page.getByRole("combobox") });
    this.cartItemName = this.cartItem.getByText("Palworld");
    // Match the price format instead of a specific value to support different locales and price changes.
    this.cartItemPrice = this.cartItem.getByText(/^\D*\d+[.,]\d{2}\D*$/);
  }

  // Check if there are items already in cart, if yes, clear the cart
  async ensureEmptyCart(): Promise<void> {
    await this.page.goto(CONFIG.CART_URL, {
      waitUntil: "domcontentloaded",
      timeout: CONFIG.TIMEOUT.LONG,
    });

    // Wait until the network is idle.
    // Without this, the cart page may still be rendering during automation,
    // causing element lookup to fail intermittently.
    await this.page.waitForLoadState("networkidle");

    await Promise.race([
      this.emptyCart.waitFor({ state: "visible" }),
      this.clearCartbtn.waitFor({ state: "visible" }),
    ]);

    if (await this.emptyCart.isVisible()) {
      return;
    }
    await this.clearCartbtn.click();
    await expect(this.emptyCart).toBeVisible();
  }

  async getCartItemInfo(): Promise<{
    finalCartItemName: string;
    finalCartItemPrice: string;
  }> {
    await this.cartItemName.waitFor();
    await this.cartItemPrice.waitFor();

    const finalCartItemName =
      (await this.cartItemName.textContent())?.trim() ?? "";

    const finalCartItemPrice =
      (await this.cartItemPrice.textContent())?.trim() ?? "";

    return {
      finalCartItemName,
      finalCartItemPrice,
    };
  }
}
