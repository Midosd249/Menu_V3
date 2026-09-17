import { test, expect } from "@playwright/test";
import { createWriteStream, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import pg from "pg";

const BASE_URL = process.env.PH_01_4_BASE_URL ?? "http://127.0.0.1:8087";
const DATABASE_URL = process.env.CUSTOMER_LIFECYCLE_DATABASE_URL ?? "";

function uniqueRegistration() {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    email: `ph-01-4-${suffix}@example.test`,
    phone: `05${String(Date.now()).slice(-8)}`,
    password: "MenuV3-Test-Password-123!",
  };
}

test("PH-01.4 existing customer login preserves workspace access and rejects invalid sessions", async ({ page }) => {
  test.setTimeout(180_000);
  if (!DATABASE_URL) throw new Error("CUSTOMER_LIFECYCLE_DATABASE_URL is required for PH-01.4 browser QA");

  const migration = readFileSync("migrations/20260917100000_self_serve_workspace_provisioning.sql", "utf8");
  const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 2 });
  await pool.query(migration);
  await pool.end();

  const child = spawn(
    "node",
    ["scripts/with-app-env.mjs", "./node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "8087"],
    {
      env: {
        ...process.env,
        VITE_AUTH_ENABLED: "true",
        BETTER_AUTH_SECRET: "ph-01-4-browser-test-secret",
        BETTER_AUTH_URL: BASE_URL,
        DATABASE_URL: DATABASE_URL,
        SUPABASE_DB_URL: "",
        POSTGRES_URL: "",
        POSTGRES_PRISMA_URL: "",
        POSTGRES_URL_NON_POOLING: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  child.stdout?.pipe(createWriteStream(".grok/ph-01-4-browser.log"));
  child.stderr?.pipe(createWriteStream(".grok/ph-01-4-browser.error.log"));

  const account = uniqueRegistration();
  let userId = "";

  async function waitForServer() {
    for (let attempt = 1; attempt <= 120; attempt += 1) {
      try {
        const response = await fetch(`${BASE_URL}/login`);
        if (response.ok) return;
      } catch {
        if (attempt === 120) throw new Error("PH-01.4 browser fixture did not start");
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("PH-01.4 browser fixture did not start");
  }

  try {
    await waitForServer();
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto(`${BASE_URL}/login?mode=signup`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "أنشئ حسابك مجانًا" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "الاسم الكامل" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "اسم البراند أو المطعم" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "رقم الجوال السعودي" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "البريد الإلكتروني" })).toBeVisible();

    await page.getByRole("textbox", { name: "الاسم الكامل" }).fill("PH-01.4 Existing Customer");
    await page.getByRole("textbox", { name: "اسم البراند أو المطعم" }).fill("عميل تسجيل الدخول للاختبار");
    await page.getByRole("textbox", { name: "رقم الجوال السعودي" }).fill(account.phone);
    await page.getByRole("textbox", { name: "البريد الإلكتروني" }).fill(account.email);
    await page.getByLabel("كلمة المرور").fill(account.password);
    await page.getByLabel("تأكيد كلمة المرور").fill(account.password);
    await page.getByRole("button", { name: "إنشاء الحساب" }).click();

    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole("heading", { name: "جهّز مساحة عملك" })).toBeVisible();

    const brand = "PH-01.4 Workspace";
    await page.getByRole("textbox").nth(0).fill(brand);
    await page.getByRole("button", { name: "كافيه" }).click();
    await page.getByRole("textbox").nth(1).fill("PH-01.4 Workspace");
    await page.getByRole("textbox").nth(2).fill("Existing customer login verification workspace");
    await page.getByRole("button", { name: "إنشاء مساحة العمل والمتابعة" }).click();

    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    await expect(page.getByText(brand, { exact: true })).toBeVisible();

    const database = new pg.Pool({ connectionString: DATABASE_URL, max: 1 });
    const userRows = await database.query<{ id: string }>(
      'select "id" from "user" where "email" = $1 limit 1',
      [account.email],
    );
    userId = userRows.rows[0]?.id ?? "";
    expect(userId).not.toBe("");
    const membershipRows = await database.query<{ tenant_id: string; user_id: string; role: string }>(
      "select tenant_id, user_id, role from tenant_members where user_id = $1 and is_active = true limit 1",
      [userId],
    );
    expect(membershipRows.rows).toHaveLength(1);
    expect(membershipRows.rows[0]?.user_id).toBe(userId);
    expect(membershipRows.rows[0]?.role).toBe("owner");
    await database.end();

    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/studio$/);
    await expect(page.getByText(brand, { exact: true })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "البريد الإلكتروني" })).toHaveCount(0);
    await expect(page.getByRole("textbox", { name: "الاسم الكامل" })).toHaveCount(0);

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await page.getByRole("textbox", { name: "البريد الإلكتروني" }).fill(account.email);
    await page.getByLabel("كلمة المرور").fill(account.password);
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();
    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    await expect(page.getByText(brand, { exact: true })).toBeVisible();

    await page.context().clearCookies();
    await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("textbox", { name: "البريد الإلكتروني" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "الاسم الكامل" })).toHaveCount(0);

    await page.getByRole("textbox", { name: "البريد الإلكتروني" }).fill(account.email);
    await page.getByLabel("كلمة المرور").fill(account.password);
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();
    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    await expect(page.getByText(brand, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  } finally {
    child.kill("SIGTERM");
    if (userId) {
      const cleanup = new pg.Pool({ connectionString: DATABASE_URL, max: 1 });
      await cleanup.query('delete from tenants where owner_user_id = $1', [userId]);
      await cleanup.query('delete from "user" where "id" = $1', [userId]);
      await cleanup.end();
    }
  }
});
