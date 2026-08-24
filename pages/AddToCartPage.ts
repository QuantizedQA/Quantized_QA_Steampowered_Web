import { Page, Locator } from "@playwright/test";

export class AddToCartPage {
  readonly page: Page;
  readonly addToCartBtn: Locator;
  readonly purchaseSection: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly confirmationPop: Locator;
  readonly successfulTip: Locator;
  readonly confirmedItemName: Locator;
  readonly confirmedItemPrice: Locator;

  constructor(page: Page) {
    this.page = page;

    // Palworld purchase section
    this.purchaseSection = page.getByRole("region", {
      name: "Buy Palworld",
      exact: true,
    });

    // Add to cart button
    this.addToCartBtn = this.purchaseSection.getByRole("button", {
      name: "Add to Cart",
    });

    // Item price
    this.itemPrice = this.purchaseSection.locator(".game_purchase_price.price");

    // Item name
    this.itemName = page.locator("#appHubAppName");

    // Confirmation popup
    this.confirmationPop = page.getByRole("dialog");

    // Successful tip
    this.successfulTip = this.confirmationPop.getByText("Added to your cart!");

    // Confirmation item name
    this.confirmedItemName = this.confirmationPop.getByText("Palworld");

    // Confirmation item price
    this.confirmedItemPrice =
      this.confirmationPop.getByText(/^\D*\d+[.,]\d{2}\D*$/);
  }

  // Get the item name
  async getItemName(): Promise<string> {
    return (await this.itemName.innerText()).trim();
  }

  // Get the item price
  async getItemPrice(): Promise<string> {
    return (await this.itemPrice.innerText()).trim();
  }

  // Click Add to Cart button
  async clickAddToCart(): Promise<void> {
    await this.addToCartBtn.click();
  }

  // Get the confirmation data to assert
  async getConfirmation(): Promise<{
    successfulTip: string;
    finalName: string;
    finalPrice: string;
  }> {
    const successfulTip = (await this.successfulTip.innerText()).trim();

    const finalName = (await this.confirmedItemName.innerText()).trim();

    const finalPrice = (await this.confirmedItemPrice.innerText()).trim();

    return { successfulTip, finalName, finalPrice };
  }
}
