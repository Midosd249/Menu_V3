import { expect, test } from "playwright/test";

const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";

test("W7.6 Growth Workspace browser QA", async ({ page }) => {
  test.setTimeout(120_000);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE_URL}/studio/growth`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "من الملاحظة إلى قرار واضح" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "1. راقب" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "2. افهم" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "3. نفّذ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "4. قِس" })).toBeVisible();

    const growthNav = page.getByRole("navigation", { name: "تنقل مساحة النمو" });
    await expect(growthNav.getByRole("link", { name: "نظرة عامة" })).toHaveAttribute("aria-current", "page");
    await expect(growthNav.getByRole("link", { name: "الذكاء" })).toHaveAttribute("href", "/studio/intelligence");
    await expect(growthNav.getByRole("link", { name: "الإجراءات" })).toHaveAttribute("href", "/studio/intelligence-actions");
    await expect(growthNav.getByRole("link", { name: "التحليلات" })).toHaveAttribute("href", "/studio/analytics");
    await expect(growthNav.getByRole("link", { name: "التقارير" })).toHaveAttribute("href", "/studio/reports");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/studio/growth`, { waitUntil: "domcontentloaded" });
  const refresh = page.getByRole("button", { name: "تحديث بيانات النمو" });
  await expect(refresh).toBeVisible();
  await refresh.focus();
  await expect(refresh).toBeFocused();

  const languageGroup = page.getByRole("group", { name: "اختيار اللغة" });
  await languageGroup.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "From observation to a clear decision" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "1. Observe" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "2. Understand" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "3. Act" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "4. Measure" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
