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

  constructor(page: Page, itemName: string) {
    this.page = page;

    this.emptyCart = page.getByText("Your cart is empty.");

    this.clearCartbtn = page.getByRole("button", { name: "Remove all items" });

    this.viewCart = page.getByRole("button", { name: /^View My Cart/ });

    // Get the first item region in cart
    this.cartItem = page
      .getByRole("button")
      .filter({ has: page.getByRole("combobox") });

    // Locate cart item name dynamically
    this.cartItemName = this.cartItem.getByText(itemName);

    // Locate cart item price
    this.cartItemPrice = this.cartItem.locator(".price");
  }

  // Check if there are items already in cart, if yes, clear the cart
  async ensureEmptyCart(): Promise<void> {
    await this.page.goto(CONFIG.CART_URL, {
      waitUntil: "domcontentloaded",
    });

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
}
