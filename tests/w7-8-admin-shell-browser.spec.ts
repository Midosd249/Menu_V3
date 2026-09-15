import { expect, test } from "playwright/test";

const BASE_URL = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:8083";

async function assertAdminShell(page: import("playwright/test").Page) {
  await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "تنقل إدارة المنصة" })).toBeVisible();
  for (const group of ["نظرة عامة", "العملاء", "التجارة والتشغيل", "المبيعات", "الذكاء التشغيلي", "النظام"]) {
    await expect(page.getByRole("heading", { name: group })).toBeVisible();
  }
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
}

test("W7.8 Platform Admin shell browser QA", async ({ page }) => {
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
  const nav = page.getByRole("navigation", { name: "تنقل إدارة المنصة" });
  for (const item of [
    "المطاعم",
    "العملاء والحسابات",
    "الفروع",
    "الطلبات",
    "الاشتراكات",
    "طلبات الخدمات",
    "العملاء المحتملون",
    "المشاريع",
    "تحليلات المنصة",
    "سجل النشاط",
    "النظام والأمان",
  ]) {
    const control = nav.getByRole("button", { name: item });
    await control.click();
    await expect(control).toHaveAttribute("aria-current", "page");
  }

  await page.getByRole("button", { name: "النظام والأمان" }).focus();
  await expect(page.getByRole("button", { name: "النظام والأمان" })).toBeFocused();
  await expect(page.getByText("لا توجد شاشة Security مستقلة")).toBeVisible();
  await expect(page.getByText("لا توجد شاشة Platform Health مستقلة")).toBeVisible();
  await expect(page.getByText("لا توجد شاشة Configuration مستقلة")).toBeVisible();
});
