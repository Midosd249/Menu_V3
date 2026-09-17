import { expect, test } from "playwright/test";

const BASE_URL = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:8083";

async function assertAdminShell(page: import("playwright/test").Page) {
  await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
  const nav = page.locator('aside[aria-label="تنقل إدارة المنصة"] nav');
  await expect(nav).toBeVisible();
  for (const group of ["نظرة عامة", "العملاء", "التجارة والتشغيل", "الذكاء التشغيلي", "النظام"]) {
    await expect(page.getByRole("heading", { name: group })).toBeVisible();
  }
  await expect(page.getByText("طلبات الخدمات")).toHaveCount(0);
  await expect(page.getByText("العملاء المحتملون")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
}

test("Platform Admin shell browser QA", async ({ page }) => {
  test.setTimeout(120_000);
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE_URL}/admin`, { waitUntil: "domcontentloaded" });
    await assertAdminShell(page);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  const nav = page.locator('aside[aria-label="تنقل إدارة المنصة"] nav');
  const items = [
    ["المطاعم", "/admin/restaurants"],
    ["العملاء والحسابات", "/admin/clients"],
    ["الفروع", "/admin/branches"],
    ["الطلبات", "/admin/orders"],
    ["الاشتراكات", "/admin/subscriptions"],
    ["المشاريع", "/admin/projects"],
    ["تحليلات المنصة", "/admin/analytics"],
    ["سجل النشاط", "/admin/activity"],
    ["النظام والأمان", "/admin/system"],
  ] as const;
  for (const [label, route] of items) {
    await nav.getByRole("button", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`${route.replaceAll("/", "\\/")}$`));
    await expect(nav.getByRole("button", { name: label })).toHaveAttribute("aria-current", "page");
  }
  await nav.getByRole("button", { name: "النظام والأمان" }).focus();
  await expect(nav.getByRole("button", { name: "النظام والأمان" })).toBeFocused();
});
