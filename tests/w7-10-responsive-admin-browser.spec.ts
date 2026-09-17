import { expect, test } from "playwright/test";

const BASE_URL = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:8083";
const VIEWPORTS = [
  { name: "320", width: 320, height: 800 }, { name: "360", width: 360, height: 800 }, { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 }, { name: "768", width: 768, height: 1024 }, { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 }, { name: "1440", width: 1440, height: 900 },
] as const;
const ROUTES = [
  "/admin", "/admin/restaurants", "/admin/clients", "/admin/branches", "/admin/orders", "/admin/subscriptions",
  "/admin/projects", "/admin/analytics", "/admin/activity", "/admin/system",
] as const;

test("Platform Admin responsive route matrix", async ({ page }) => {
  test.setTimeout(240_000);
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const route of ROUTES) {
      const consoleErrors: string[] = [];
      page.removeAllListeners("console");
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.locator('[aria-current="page"]')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
      expect(await page.locator("button:visible, a:visible").evaluateAll((nodes) => nodes.filter((node) => !(node.getAttribute("aria-label") || node.textContent?.trim())).length)).toBe(0);
      expect(consoleErrors).toEqual([]);
    }
  }
});

test("Platform Admin narrow navigation remains keyboard reachable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(`${BASE_URL}/admin/orders`, { waitUntil: "domcontentloaded" });
  const nav = page.locator('aside[aria-label="تنقل إدارة المنصة"]');
  await expect(nav).toBeVisible();
  const active = nav.locator('[aria-current="page"]');
  await expect(active).toHaveCount(1);
  await active.focus();
  await expect(active).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test("Platform Admin legacy query remains safe at narrow width", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(`${BASE_URL}/admin?tab=orders&keep=1`, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/orders\?keep=%221%22$/);
  await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
