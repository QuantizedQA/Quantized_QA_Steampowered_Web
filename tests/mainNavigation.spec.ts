import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);

  await homePage.open();
});

// Verify Store navigation

test("store navigation", async ({ page }) => {
  await homePage.clickStore();

  await expect(homePage.storeLink).toBeVisible();

  await expect(page).toHaveURL("https://store.steampowered.com/");
  await expect(page).toHaveTitle("Welcome to Steam");
});

// Verify community navigation

test("community navigation", async ({ page }) => {
  await expect(homePage.communityLink).toBeVisible();

  await homePage.clickCommunity();

  await expect(page).toHaveURL("https://steamcommunity.com/");
  await expect(page).toHaveTitle("Steam Community");
});

// Verify about navigation

test("about navigation", async ({ page }) => {
  await expect(homePage.aboutLink).toBeVisible();

  await homePage.clickAbout();

  await expect(page).toHaveURL("https://store.steampowered.com/about/");
  await expect(page).toHaveTitle("Steam, The Ultimate Online Game Platform");
});

// Verify Support navigation

test("support navigation", async ({ page }) => {
  await expect(homePage.supportLink).toBeVisible();

  await homePage.clickSupport();

  await expect(page).toHaveURL("https://help.steampowered.com/en/");
  await expect(page).toHaveTitle("Steam Support");
});
