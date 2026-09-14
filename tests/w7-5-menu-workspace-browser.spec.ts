import { expect, test } from "playwright/test";

const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";

test("W7.5 Menu Workspace browser QA", async ({ page }) => {
  test.setTimeout(120_000);

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE_URL}/studio/menu`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "القائمة" })).toBeVisible();
    await expect(page.getByText("مساحة عمل القائمة", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "الأصناف" })).toBeVisible();
    const toolsNav = page.getByRole("navigation", { name: "أدوات القائمة" });
    await expect(toolsNav).toBeVisible();
    await expect(toolsNav.getByRole("link", { name: "الخيارات" })).toHaveAttribute("href", "/studio/options");
    await expect(toolsNav.getByRole("link", { name: "الاستيراد" })).toHaveAttribute("href", "/studio/import");
    await expect(toolsNav.getByRole("link", { name: "المعاينة" })).toHaveAttribute("href", "/studio/preview");
    await expect(toolsNav.getByRole("link", { name: "رمز QR" })).toHaveAttribute("href", "/studio/qr");
    await expect(page.getByRole("button", { name: "متاح", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "غير متاح", exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/studio/menu`, { waitUntil: "domcontentloaded" });
  const search = page.getByRole("textbox", { name: "بحث عن صنف" });
  await expect(search).toBeVisible();
  await search.focus();
  await expect(search).toBeFocused();

  await page.getByRole("button", { name: "غير متاح", exact: true }).click();
  await expect(page.getByRole("button", { name: "غير متاح", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "متاح", exact: true })).toHaveAttribute("aria-pressed", "false");

  const languageGroup = page.getByRole("group", { name: "اختيار اللغة" });
  await languageGroup.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Items" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
