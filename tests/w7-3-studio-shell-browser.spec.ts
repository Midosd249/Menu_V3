import { expect, test, type Page } from "playwright/test";

const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";

async function ensureStudio(page: Page) {
  await page.goto(`${BASE_URL}/onboarding`, { waitUntil: "domcontentloaded" });
  if (page.url().includes("/studio")) return;

  await expect(page.getByRole("heading", { name: "جهّز منيو منشأتك" })).toBeVisible({ timeout: 15_000 });
  await page.getByLabel("اسم المنشأة بالعربية").fill("مطعم اختبار الاستوديو الطويل — Long Studio Restaurant");
  await page.getByLabel("اسم المنشأة بالإنجليزية (اختياري)").fill("Long Studio Restaurant");
  await page.getByRole("button", { name: "متابعة" }).click();
  await page.getByRole("button", { name: "متابعة" }).click();
  await page.getByRole("button", { name: "تخطي الأصناف" }).click();
  await expect(page).toHaveURL(/\/studio(?:\/)?$/, { timeout: 15_000 });
}

test("W7.3 Studio shell browser QA", async ({ page }) => {
  test.setTimeout(60_000);
  await ensureStudio(page);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  await expect(page.locator('nav[aria-label="مساحات العمل"]')).toBeVisible();
  await expect(page.locator('nav[aria-label="مساحات العمل"] button')).toHaveCount(6);

  for (const label of ["الرئيسية", "القائمة", "الطلبات", "النمو", "العملاء", "الإعدادات"]) {
    await expect(page.locator('nav[aria-label="مساحات العمل"] button', { hasText: label })).toBeVisible();
  }
  await expect(page.locator('nav[aria-label="مساحات العمل"] [aria-current="page"]')).toHaveCount(1);
  await expect(page.locator('a[href="/studio/reports"]')).toHaveCount(0);
  await expect(page.locator('a[href="/studio/loyalty"], a[href="/studio/campaigns"], a[href="/studio/feedback"], a[href="/studio/retention"]')).toHaveCount(0);
  await expect(page.locator('a[href="/admin"]')).toHaveCount(0);

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  const firstWorkspace = page.locator('nav[aria-label="مساحات العمل"] button').first();
  await firstWorkspace.focus();
  await expect(firstWorkspace).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  const mobileNav = page.locator('nav[aria-label="تنقل مساحة العمل على الهاتف"]');
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.locator("button")).toHaveCount(5);
  for (const label of ["الرئيسية", "القائمة", "الطلبات", "النمو", "المزيد"]) {
    await expect(mobileNav.getByRole("button", { name: label })).toBeVisible();
  }
  await expect(page.locator('nav[aria-label="مساحات العمل"]')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  await mobileNav.getByRole("button", { name: "المزيد" }).click();
  const moreSheet = page.locator("div.fixed.inset-0.z-40");
  await expect(moreSheet).toBeVisible();
  await expect(moreSheet.getByText("المزيد", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(moreSheet).toHaveCount(0);

  await page.getByRole("button", { name: "اختيار اللغة" }).getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("button", { name: "More" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
