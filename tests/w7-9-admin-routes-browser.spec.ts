import { test, expect } from "playwright/test";

const baseURL = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:8083";
const adminNav = 'aside[aria-label="تنقل إدارة المنصة"]';
const activeRoutes = [
  "/admin",
  "/admin/restaurants",
  "/admin/orders",
  "/admin/clients",
  "/admin/branches",
  "/admin/projects",
  "/admin/subscriptions",
  "/admin/analytics",
  "/admin/activity",
  "/admin/system",
] as const;
const retiredRoutes = ["/admin/leads", "/admin/service-requests"] as const;

for (const route of activeRoutes) {
  test(`W7.9 authorized Admin route ${route} renders the real workspace`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
    await expect(page.locator(`${adminNav} [aria-current='page']`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
    await expect(page.locator(`${adminNav} [aria-current='page']`)).toHaveCount(1);
  });
}

for (const route of retiredRoutes) {
  test(`W7.9 retired Admin route ${route} is not exposed`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(404);
    await expect(page.getByText("طلبات الخدمات")).toHaveCount(0);
    await expect(page.getByText("العملاء المحتملون")).toHaveCount(0);
  });
}

test("W7.9 Admin child routes preserve mobile geometry and route-based active state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/admin/orders`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
  await expect(page.locator(`${adminNav} [aria-current='page']`)).toHaveCount(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("W7.9 Admin browser back/forward preserves workspace routes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
  await page.goto(`${baseURL}/admin/analytics`, { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/admin\/analytics$/);
  await page.goBack({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/admin$/);
  await page.goForward({ waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/admin\/analytics$/);
});

test("W7.9 legacy Admin tab query values normalize safely", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${baseURL}/admin?tab=orders&keep=1`, { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/admin\/orders\?keep=%221%22$/);
  const search = new URL(page.url()).searchParams;
  expect(search.get("keep")).toBe("\"1\"");
  await expect(page.locator(`${adminNav} [aria-current='page']`)).toHaveCount(1);

  await page.goto(`${baseURL}/admin?tab=unknown`, { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
});

test("W7.9 existing Admin onboarding child route remains reachable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${baseURL}/admin/onboarding`, { waitUntil: "networkidle" });
  await expect(page).not.toHaveURL(/\/login/);
});
