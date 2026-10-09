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
  await expect(page.getByRole("progressbar").first()).toHaveAttribute("aria-valuemax", "100");

  const languageGroup = page.getByRole("group", { name: "اختيار اللغة" });
  await languageGroup.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByText("Current performance").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test("Studio brand logo keeps its original appearance in light mode and a high-contrast plate in dark mode", async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    try { window.localStorage.setItem("menu-theme", "light"); } catch { /* test still checks the rendered default */ }
  });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-theme-toggle-ready="true"]')).toBeVisible();

    const logoFrame = page.locator("[data-studio-brand-logo]:visible");
    await expect(logoFrame).toBeVisible();
    await expect(logoFrame.locator("img")).toBeVisible();
    await expect.poll(() => logoFrame.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect.poll(() => logoFrame.locator("img").evaluate((img: HTMLImageElement) => getComputedStyle(img).opacity)).toBe("1");

    const lightStyle = await logoFrame.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, borderStyle: style.borderTopStyle, borderWidth: style.borderTopWidth, padding: style.paddingTop };
    });
    expect(lightStyle).toEqual({ background: "rgba(0, 0, 0, 0)", borderStyle: "solid", borderWidth: "0px", padding: "0px" });

    await page.getByRole("button", { name: "التبديل إلى الوضع الداكن" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-platform-theme", "dark");
    const darkStyle = await logoFrame.evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, border: style.borderTopColor, borderStyle: style.borderTopStyle, padding: style.paddingTop };
    });
    expect(darkStyle).toEqual({
      background: "rgb(255, 253, 248)",
      border: "rgb(232, 229, 221)",
      borderStyle: "solid",
      padding: "4px",
    });
    await expect(logoFrame.locator("img")).toHaveCSS("filter", "none");

    await page.getByRole("button", { name: "التبديل إلى الوضع الفاتح" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-platform-theme", "light");
    await expect.poll(() => logoFrame.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
  }
});
