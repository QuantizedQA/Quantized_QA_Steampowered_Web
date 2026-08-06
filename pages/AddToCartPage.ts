import test, { Page, Locator } from "@playwright/test";

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
    this.itemName = this.purchaseSection.locator("h2.title");

    // Confirmation popup of successful purchase
    // Confirmation popup
    this.confirmationPop = page.getByRole("dialog");
    // Successful tip
    this.successfulTip = this.confirmationPop.getByText("Added to your cart!");
    // Confirmation item name
    this.confirmedItemName = this.confirmationPop.getByText("Palworld");
    // Confirmation item price
    this.confirmedItemPrice = this.confirmationPop.getByText("$29.99");
  }
  // Get the item name
  async getItemName(): Promise<string> {
    try {
      await this.purchaseSection.waitFor();
      await this.itemName.waitFor();
      // Remove "Buy", just take the item name
      const title = (await this.itemName.innerText())
        .replace("Buy ", "")
        .trim();
      console.log("Get the item name: ", title);
      return title;
    } catch (err: any) {
      console.error("Can not get the item name: ", err.message);
      throw err;
    }
  }

  // Get the item price
  async getItemPrice(): Promise<string> {
    try {
      await this.itemPrice.waitFor();
      const price = (await this.itemPrice.innerText()).trim();
      console.log("Get the item price: ", price);
      return price;
    } catch (err: any) {
      console.error("Can not get the item price: ", err.message);
      throw err;
    }
  }

  // Click Add to Cart button
  async clickAddToCart(): Promise<void> {
    try {
      await this.addToCartBtn.click();
    } catch (err: any) {
      console.error("Can not click Add to Cart button: ", err.message);
      throw err;
    }
  }

  // Get the confirmation data to assert
  async getConfirmation(): Promise<{
    successfulTip: string;
    finalName: string;
    finalPrice: string;
  }> {
    try {
      await this.successfulTip.waitFor();
      const successfulTip = (await this.successfulTip.innerText()).trim();
      await this.confirmedItemName.waitFor();
      const finalName = (await this.confirmedItemName.innerText()).trim();
      await this.confirmedItemPrice.waitFor();
      const finalPrice = (await this.confirmedItemPrice.innerText()).trim();
      const result = { successfulTip, finalName, finalPrice };
      console.log(
        `Add game to cart successfully, Name: ${finalName}, Price: ${finalPrice}`,
      );
      return result;
    } catch (err: any) {
      console.error("Can not add to cart: ", err.message);
      throw err;
    }
  }
}
