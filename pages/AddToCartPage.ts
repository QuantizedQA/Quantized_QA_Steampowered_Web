import { Page, Locator } from "@playwright/test";

export class AddToCartPage {
  readonly page: Page;

  readonly addToCartBtn: Locator;
  readonly purchaseSection: Locator;

  readonly itemPrice: Locator;

  readonly confirmationPop: Locator;
  readonly successfulTip: Locator;
  readonly confirmedItemName: Locator;
  readonly confirmedItemPrice: Locator;

  constructor(page: Page, itemName: string) {
    this.page = page;

    // Locate the purchase section for the selected game
    this.purchaseSection = page.getByRole("region", {
      name: `Buy ${itemName}`,
      exact: true,
    });

    // Locate the Add to Cart button
    this.addToCartBtn = this.purchaseSection.getByRole("button", {
      name: "Add to Cart",
    });

    // Locate the product price on the product page
    this.itemPrice = this.purchaseSection.locator(".discount_final_price");

    // Locate the confirmation dialog after adding to cart
    this.confirmationPop = page.getByRole("dialog");

    // Verify the success message
    this.successfulTip = this.confirmationPop.getByText("Added to your cart!");

    // Verify the added game's name
    this.confirmedItemName = this.confirmationPop.getByText(itemName);

    // Locate the added game's price
    this.confirmedItemPrice = this.confirmationPop.locator(
      ".game_purchase_price",
    );
  }

  // Get product price for comparison with cart price
  async getItemPrice(): Promise<string> {
    return (await this.itemPrice.innerText()).trim();
  }

  // Click Add to Cart button
  async clickAddToCart(): Promise<void> {
    await this.addToCartBtn.click();
  }
}
