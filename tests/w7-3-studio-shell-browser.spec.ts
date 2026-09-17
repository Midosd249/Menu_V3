import { test, expect } from "@playwright/test";
import { createWriteStream, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import pg from "pg";

const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";

test("studio shell mobile navigation and RTL/LTR behavior", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  const desktopNav = page.locator('nav[aria-label="تنقل مساحة العمل على سطح المكتب"]');
  const mobileNav = page.locator('nav[aria-label="تنقل مساحة العمل على الهاتف"]');
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.locator("button")).toHaveCount(5);
  for (const label of ["نظرة عامة", "القائمة", "الطلبات", "النمو", "المزيد"]) {
    await expect(mobileNav.getByRole("button", { name: label })).toBeVisible();
  }
  await expect(desktopNav).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await mobileNav.getByRole("button", { name: "المزيد" }).click();
  const moreSheet = page.locator("div.fixed.inset-0.z-40").last();
  await expect(moreSheet).toBeVisible();
  await expect(moreSheet.locator('a[href="/studio/reports"]')).toHaveCount(0);
  await expect(moreSheet.locator('a[href="/studio/loyalty"], a[href="/studio/campaigns"], a[href="/studio/feedback"], a[href="/studio/retention"]')).toHaveCount(0);
  await expect(moreSheet.locator('a[href="/admin"]')).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(moreSheet).toBeHidden();
  const languageGroup = page.getByRole("group", { name: "اختيار اللغة" });
  await expect(languageGroup).toBeVisible();
  await languageGroup.getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("button", { name: "Overview" })).toBeVisible();
  await expect(page.getByRole("button", { name: "More" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test("self-serve customer onboarding creates a workspace without approval UI", async ({ page }) => {
  test.setTimeout(180_000);
  const databaseUrl = process.env.CUSTOMER_LIFECYCLE_DATABASE_URL ?? (process.env.CI === "true" ? "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_customer_ci" : "");
  if (!databaseUrl) throw new Error("CUSTOMER_LIFECYCLE_DATABASE_URL is required for self-serve browser QA");

  const migration = readFileSync("migrations/20260917100000_self_serve_workspace_provisioning.sql", "utf8");
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 2 });
  const userId = "self-serve-browser-user";
  try {
    await pool.query(migration);
    await pool.query("delete from menu_v3.tenants where owner_user_id = $1", [userId]);
    await pool.query(
      `insert into menu_v3."user" ("id", "name", "email", "emailVerified", "phoneNumber", "phoneNumberVerified") values ($1,$2,$3,true,$4,false) on conflict ("id") do update set "name"=excluded."name", "email"=excluded."email", "phoneNumber"=excluded."phoneNumber", "phoneNumberVerified"=false`,
      [userId, "Self Serve Browser", `${userId}@example.test`, "+966512345679"],
    );
  } finally {
    await pool.end();
  }

  const port = "8084";
  const child = spawn(
    "node",
    ["scripts/with-app-env.mjs", "./node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", port],
    {
      env: {
        ...process.env,
        VITE_AUTH_ENABLED: "false",
        MENU_V3_DEV_USER_ID: userId,
        MENU_V3_AUTH_DISABLED_TEST_DATABASE: "true",
        DATABASE_URL: databaseUrl,
        SUPABASE_DB_URL: "",
        POSTGRES_URL: "",
        POSTGRES_PRISMA_URL: "",
        POSTGRES_URL_NON_POOLING: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  child.stdout?.pipe(createWriteStream(`.grok/self-serve-browser-${port}.log`));
  child.stderr?.pipe(createWriteStream(`.grok/self-serve-browser-${port}.error.log`));
  const base = `http://127.0.0.1:${port}`;

  async function waitForServer(url: string) {
    for (let attempt = 1; attempt <= 120; attempt += 1) {
      try {
        const response = await fetch(url);
        if (response.ok) return;
      } catch {
        if (attempt === 120) throw new Error(`Server did not start: ${url}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error(`Server did not start: ${url}`);
  }

  try {
    await waitForServer(`${base}/onboarding`);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole("heading", { name: "جهّز مساحة عملك" })).toBeVisible();
    await expect(page.getByText("طلب التفعيل")).toHaveCount(0);
    await expect(page.getByText("قيد المراجعة")).toHaveCount(0);
    await expect(page.getByText("الموافقة")).toHaveCount(0);

    await page.getByRole("textbox").nth(0).fill("مذاق الاختبار");
    await page.getByRole("button", { name: "كافيه" }).click();
    await page.getByRole("textbox").nth(1).fill("Test Taste");
    await page.getByRole("textbox").nth(2).fill("وصف مختصر للاختبار");
    await page.getByRole("button", { name: "إنشاء مساحة العمل والمتابعة" }).click();
    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  } finally {
    child.kill("SIGTERM");
  }
});
