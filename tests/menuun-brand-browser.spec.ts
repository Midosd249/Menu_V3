import { test, expect } from "@playwright/test";

const BASE_URL = process.env.MENUUN_BRAND_BASE_URL ?? "http://127.0.0.1:8081";

test.describe("Menuun customer-facing brand surfaces", () => {
  test("homepage renders the approved Menuun brand in Arabic and English", async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("img", { name: /Menuun.*منيو رقمي للمطاعم والكافيهات/ })).toBeVisible();
    await expect(page.locator("footer")).toContainText("من نحن");
    await expect(page.locator("footer")).toContainText("تواصل معنا");
    await expect(page.locator("footer")).toContainText("ahmed.mohamed@menuun.com");
    await expect(page.locator("footer")).toContainText("© 2026 Menuun");
    await expect(page.locator("body")).not.toContainText("Menu V3");

    await page.goto(`${BASE_URL}/?lang=en`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("img", { name: "Menuun" })).toBeVisible();
    await expect(page.locator("footer")).toContainText("About");
    await expect(page.locator("footer")).toContainText("Contact");
    await expect(page.locator("footer")).toContainText("Pricing");
    await expect(page.locator("footer")).toContainText("© 2026 Menuun");
    await expect(page.locator("body")).not.toContainText("Menu V3");
  });

  test("login renders the Menuun identity in Arabic and English", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("img", { name: /Menuun.*منيو رقمي للمطاعم والكافيهات/ })).toBeVisible();
    await expect(page.locator("footer")).toContainText("من نحن");
    await expect(page.locator("body")).not.toContainText("Menu V3");

    await page.goto(`${BASE_URL}/login?lang=en`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("img", { name: "Menuun" })).toBeVisible();
    await expect(page.locator("footer")).toContainText("About");
    await expect(page.locator("body")).not.toContainText("Menu V3");
  });
});
