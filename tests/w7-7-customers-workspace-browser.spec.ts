import { expect, test, type Page } from "playwright/test";

const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";

async function assertCustomersPage(page: Page) {
  await expect(page.getByRole("heading", { name: "العملاء والضيوف" })).toBeVisible();
  await expect(page.getByRole("button", { name: "تحديث بيانات العملاء" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ما البيانات الموجودة؟" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "إشارات تحتاج فهمًا" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ما الذي يدعمه النظام؟" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "حدود المساحة الحالية" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await expect(page.locator('a[href="/studio/loyalty"], a[href="/studio/campaigns"], a[href="/studio/feedback"], a[href="/studio/retention"]')).toHaveCount(0);
}

test("W7.7 Customers Workspace browser QA", async ({ page }) => {
  test.setTimeout(120_000);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE_URL}/studio/guests`, { waitUntil: "domcontentloaded" });
    await assertCustomersPage(page);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/studio/guests`, { waitUntil: "domcontentloaded" });
  const customersNav = page.locator('nav[aria-label="مساحات العمل"]');
  await expect(customersNav.getByRole("button", { name: "العملاء" })).toHaveAttribute("aria-current", "page");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/studio/guests`, { waitUntil: "domcontentloaded" });
  const refresh = page.getByRole("button", { name: "تحديث بيانات العملاء" });
  await refresh.focus();
  await expect(refresh).toBeFocused();

  const languageGroup = page.getByRole("group", { name: "اختيار اللغة" });
  await languageGroup.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Customers & Guests" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What customer data exists?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What is actually supported?" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  const mobileNav = page.locator('nav[aria-label="تنقل مساحة العمل على الهاتف"]');
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("button", { name: "More" })).toBeVisible();
});
