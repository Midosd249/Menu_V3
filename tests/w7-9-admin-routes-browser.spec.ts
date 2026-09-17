import { test, expect } from "playwright/test";
import { readFileSync } from "node:fs";
import pg from "pg";

const baseURL = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:8083";
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_ci";
const adminNav = 'aside[aria-label="تنقل إدارة المنصة"]';
const routes = [
  "/admin", "/admin/restaurants", "/admin/orders", "/admin/clients", "/admin/branches", "/admin/leads",
  "/admin/projects", "/admin/service-requests", "/admin/subscriptions", "/admin/analytics", "/admin/activity", "/admin/system",
] as const;

test.beforeAll(async () => {
  const sql = readFileSync("migrations/20260917120000_platform_admin_subscription_control.sql", "utf8");
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  try { await pool.query(sql); } finally { await pool.end(); }
});

for (const route of routes) {
  test(`W7.9 authorized Admin route ${route} renders the real workspace`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
    if (route === "/admin/subscriptions") {
      await expect(page.getByRole("heading", { name: "اشتراكات العملاء" })).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
    }
    await expect(page.locator(`${adminNav} [aria-current='page']`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await page.reload({ waitUntil: "networkidle" });
    if (route === "/admin/subscriptions") {
      await expect(page.getByRole("heading", { name: "اشتراكات العملاء" })).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { name: "مركز تحكم Menu V3" })).toBeVisible();
    }
    await expect(page.locator(`${adminNav} [aria-current='page']`)).toHaveCount(1);
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

test("PH-04 subscription control workspace renders at mobile and desktop widths", async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${baseURL}/admin/subscriptions`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "اشتراكات العملاء" })).toBeVisible();
    await expect(page.getByText("الاشتراكات والحسابات")).toBeVisible();
    await expect(page.locator(`${adminNav} [aria-current='page']`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }
});
