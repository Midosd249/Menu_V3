import { expect, test } from "playwright/test";

const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";
const VIEWPORTS = [
  { name: "320", width: 320, height: 800 },
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
] as const;

const ROUTES = [
  "/studio",
  "/studio/menu",
  "/studio/growth",
  "/studio/guests",
  "/studio/orders",
  "/studio/settings",
  "/studio/options",
  "/studio/import",
  "/studio/branches",
  "/studio/team",
  "/studio/brand",
  "/studio/design",
  "/studio/qr",
  "/studio/preview",
] as const;

type PlaywrightPage = { goto: (url: string, options: { waitUntil: "domcontentloaded" }) => Promise<unknown> };

async function gotoStudioRoute(page: PlaywrightPage, url: string) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("ERR_ABORTED")) throw error;
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }
}

test("W7.10 Studio responsive route matrix", async ({ page }) => {
  test.setTimeout(240_000);
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const route of ROUTES) {
      const consoleErrors: string[] = [];
      page.removeAllListeners("console");
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      await gotoStudioRoute(page, `${BASE_URL}${route}`);
      const shellBanner = page.getByRole("banner").first();
      await expect(shellBanner, `Expected the Studio shell banner for ${route} at ${viewport.name}px; URL=${page.url()}; body=${(await page.locator("body").innerText()).slice(0, 240)}`).toBeVisible({ timeout: 30_000 });
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        offenders: Array.from(document.querySelectorAll("body *")).map((node) => {
          const rect = (node as HTMLElement).getBoundingClientRect();
          return { tag: node.tagName, text: (node.textContent || "").trim().slice(0, 80), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), overflowX: getComputedStyle(node).overflowX };
        }).filter((item) => item.right > window.innerWidth + 1 || item.left < -1).slice(0, 12),
      }));
      expect(overflow.scrollWidth, `Horizontal overflow at ${route} ${viewport.name}px: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}; offenders=${JSON.stringify(overflow.offenders)}`).toBeLessThanOrEqual(overflow.clientWidth + 1);
      expect(await page.locator("button:visible, a:visible").evaluateAll((nodes) => nodes.filter((node) => {
        const label = node.getAttribute("aria-label") || node.textContent?.trim();
        return !label;
      }).length)).toBe(0);
      expect(consoleErrors).toEqual([]);
    }
  }
});

test("W7.10 Studio shell remains accessible at the narrowest viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await gotoStudioRoute(page, `${BASE_URL}/studio`);
  const mobileNav = page.locator('nav[aria-label="تنقل مساحة العمل على الهاتف"]');
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.locator("button")).toHaveCount(5);
  await expect(mobileNav.locator('[aria-current="page"]')).toHaveCount(1);
  const first = mobileNav.locator("button").first();
  await first.focus();
  await expect(first).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test("W7.10 Studio Menu header keeps the import action reachable at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await gotoStudioRoute(page, `${BASE_URL}/studio/menu`);
  const importButton = page.getByRole("button", { name: "استيراد القائمة" });
  await expect(importButton).toBeVisible();
  await expect(importButton).toBeEnabled();
  const box = await importButton.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(24);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(24);
  const overflow = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(overflow.scrollWidth, `Horizontal overflow at Studio Menu 320px: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`).toBeLessThanOrEqual(overflow.clientWidth + 1);
});

test("W7.10 Studio language switch preserves usable LTR at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoStudioRoute(page, `${BASE_URL}/studio/menu`);
  const languageGroup = page.getByRole("group", { name: "اختيار اللغة" });
  await languageGroup.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Items" })).toBeVisible();
  const overflow = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(overflow.scrollWidth, `Horizontal overflow at Studio Menu LTR 390px: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`).toBeLessThanOrEqual(overflow.clientWidth + 1);
});


test("W7.10 Studio dark mobile bottom navigation has accessible text contrast and a distinct active state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem("menu-theme", "dark"));
  await gotoStudioRoute(page, `${BASE_URL}/studio`);
  await expect(page.locator("html")).toHaveAttribute("data-platform-theme", "dark");
  const nav = page.locator('nav[aria-label="تنقل مساحة العمل على الهاتف"]');
  await expect(nav).toBeVisible();
  const colors = await nav.evaluate((element) => {
    const active = element.querySelector("button[aria-current='page']")!;
    const inactive = element.querySelector("button:not([aria-current])")!;
    return {
      background: getComputedStyle(element).backgroundColor,
      border: getComputedStyle(element).borderTopColor,
      activeBackground: getComputedStyle(active).backgroundColor,
      activeText: getComputedStyle(active).color,
      inactiveText: getComputedStyle(inactive).color,
      activeIndicator: getComputedStyle(active).boxShadow,
    };
  });
  expect(colors.background).toBe("rgb(11, 13, 17)");
  expect(colors.border).toBe("rgb(86, 96, 110)");
  expect(colors.activeBackground).toBe("rgb(37, 43, 53)");
  expect(colors.activeText).toBe("rgb(255, 247, 237)");
  expect(colors.inactiveText).toBe("rgb(208, 213, 221)");
  expect(colors.activeIndicator).toContain("rgb(31, 209, 165)");
  for (const [foreground, background] of [[colors.activeText, colors.activeBackground], [colors.inactiveText, colors.background]]) {
    const ratio = await page.evaluate(([fg, bg]) => {
      const channels = (value: string) => value.match(/\\d+/g)!.slice(0, 3).map(Number);
      const luminance = (rgb: number[]) => rgb.map((value) => value / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      const a = luminance(channels(fg));
      const b = luminance(channels(bg));
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    }, [foreground, background] as const);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
