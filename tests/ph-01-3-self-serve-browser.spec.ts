import { test, expect } from "@playwright/test";
import { createWriteStream, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import pg from "pg";

const databaseUrl = process.env.CUSTOMER_LIFECYCLE_DATABASE_URL ?? (process.env.CI === "true" ? "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_customer_ci" : "");
const provisioningMigration = readFileSync("migrations/20260917100000_self_serve_workspace_provisioning.sql", "utf8");

test("PH-01.3 self-serve setup provisions safely and hands off to Studio in Arabic and English", async ({ page }) => {
  test.setTimeout(180_000);
  if (!databaseUrl) throw new Error("CUSTOMER_LIFECYCLE_DATABASE_URL is required for PH-01.3 browser QA");

  const pool = new pg.Pool({ connectionString: databaseUrl, max: 4 });
  const userIds = ["ph-01-3-browser-ar", "ph-01-3-browser-en"];
  try {
    await pool.query(provisioningMigration);
    for (const userId of userIds) {
      await pool.query(`delete from menu_v3.tenants where owner_user_id = $1`, [userId]);
      await pool.query(
        `insert into menu_v3."user" ("id", "name", "email", "emailVerified", "phoneNumber", "phoneNumberVerified") values ($1,$2,$3,true,$4,false) on conflict ("id") do update set "name"=excluded."name", "email"=excluded."email", "phoneNumber"=excluded."phoneNumber", "phoneNumberVerified"=false`,
        [userId, "PH-01.3 Browser", `${userId}@example.test`, "+966512345670"],
      );
    }
  } finally {
    await pool.end();
  }

  const servers = userIds.map((userId, index) => {
    const port = String(8086 + index);
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
    child.stdout?.pipe(createWriteStream(`.grok/ph-01-3-${port}.log`));
    child.stderr?.pipe(createWriteStream(`.grok/ph-01-3-${port}.error.log`));
    return { child, base: `http://127.0.0.1:${port}`, userId };
  });

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
    await Promise.all(servers.map(({ base }) => waitForServer(`${base}/onboarding`)));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${servers[0].base}/studio`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: "جهّز مساحة عملك" })).toBeVisible();
    await page.getByRole("button", { name: "إنشاء مساحة العمل والمتابعة" }).click();
    await expect(page.getByRole("alert")).toHaveText("أدخل اسم البراند.");
    await page.getByRole("textbox").nth(0).fill("مذاق الاختبار");
    await page.getByRole("button", { name: "كافيه" }).click();
    await page.getByRole("textbox").nth(1).fill("Test Taste");
    await page.getByRole("textbox").nth(2).fill("وصف مختصر للاختبار");
    await page.getByRole("button", { name: "إنشاء مساحة العمل والمتابعة" }).click();
    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/studio$/);

    await page.goto(`${servers[1].base}/onboarding`, { waitUntil: "domcontentloaded" });
    await page.getByRole("group", { name: "اختيار اللغة" }).getByRole("button", { name: "EN" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: "Set up your workspace" })).toBeVisible();
    await page.getByRole("textbox").nth(0).fill("English Test Brand");
    await page.getByRole("button", { name: "Restaurant" }).click();
    await page.getByRole("textbox").nth(1).fill("English Test Brand");
    await page.getByRole("button", { name: "Create workspace & continue" }).click();
    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/studio$/);
  } finally {
    for (const { child } of servers) child.kill("SIGTERM");
    const cleanup = new pg.Pool({ connectionString: databaseUrl, max: 2 });
    try {
      for (const userId of userIds) {
        await cleanup.query(`delete from menu_v3.tenants where owner_user_id = $1`, [userId]);
        await cleanup.query('delete from menu_v3."user" where "id" = $1', [userId]);
      }
    } finally {
      await cleanup.end();
    }
  }
});
