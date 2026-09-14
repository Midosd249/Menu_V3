import { expect, test } from "playwright/test";

const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";

test("W7.4 Studio Home browser QA", async ({ page }) => {
  test.setTimeout(120_000);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText(/يحتاج انتباهك|Needs your attention/).first()).toBeVisible();
    await expect(page.getByText(/الأداء الحالي|Current performance/).first()).toBeVisible();
    await expect(page.getByText(/آخر النشاط التشغيلي|Recent operational activity/).first()).toBeVisible();
    await expect(page.getByText(/صحة المنيو|Menu health/).first()).toBeVisible();
    await expect(page.getByText(/فرصة النمو|Growth opportunity/).first()).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /استوديو|صباح الخير|مساء الخير|Good / }).first()).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "100");

  const languageGroup = page.getByRole("group", { name: "اختيار اللغة" });
  await languageGroup.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByText("Current performance").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
