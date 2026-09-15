import { expect, test } from "playwright/test";

const BASE_URL = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:8083";

async function assertAdminShell(page: import("playwright/test").Page) {
  await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
  await expect(page.locator('aside[aria-label="تنقل إدارة المنصة"] nav')).toBeVisible();
  for (const group of ["نظرة عامة", "العملاء", "التجارة والتشغيل", "المبيعات", "الذكاء التشغيلي", "النظام"]) {
    await expect(page.getByRole("heading", { name: group })).toBeVisible();
  }

  const visual = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const canvas = document.querySelector(".min-h-dvh");
    const aside = document.querySelector('aside[aria-label="تنقل إدارة المنصة"]');
    const active = document.querySelector('[aria-current="page"]');
    return {
      adminScope: Boolean(aside),
      bodyBackground: body.backgroundColor,
      bodyPaper: body.getPropertyValue("--color-paper").trim(),
      bodyInk: body.getPropertyValue("--color-ink").trim(),
      bodyRing: body.getPropertyValue("--color-ring").trim(),
      canvasBackground: canvas ? getComputedStyle(canvas).backgroundColor : "",
      asideBackground: aside ? getComputedStyle(aside).backgroundColor : "",
      activeBackground: active ? getComputedStyle(active).backgroundColor : "",
      activeColor: active ? getComputedStyle(active).color : "",
    };
  });

  expect(visual.adminScope).toBe(true);
  expect(visual.bodyBackground).toBe("rgb(242, 237, 227)");
  expect(visual.bodyPaper).toBe("#fbf8f2");
  expect(visual.bodyInk).toBe("#1d2421");
  expect(visual.bodyRing).toBe("#8b642e");
  expect(visual.canvasBackground).toBe("rgb(242, 237, 227)");
  expect(visual.asideBackground).toBe("rgb(31, 37, 34)");
  expect(visual.activeBackground).toBe("rgb(44, 52, 48)");
  expect(visual.activeColor).toBe("rgb(255, 255, 255)");

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
  const nav = page.locator('aside[aria-label="تنقل إدارة المنصة"] nav');
  await expect(page.getByText("لا توجد شاشة Security مستقلة")).toBeVisible();
  await expect(page.getByText("لا توجد شاشة Platform Health مستقلة")).toBeVisible();
  await expect(page.getByText("لا توجد شاشة Configuration مستقلة")).toBeVisible();

  const items = [
    ["المطاعم", "/admin/restaurants"],
    ["العملاء والحسابات", "/admin/clients"],
    ["الفروع", "/admin/branches"],
    ["الطلبات", "/admin/orders"],
    ["الاشتراكات", "/admin/subscriptions"],
    ["طلبات الخدمات", "/admin/service-requests"],
    ["العملاء المحتملون", "/admin/leads"],
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
