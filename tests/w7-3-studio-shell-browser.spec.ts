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
  for (const label of ["نظرة عامة", "القائمة", "الطلبات", "النمو", "المزيد"]) await expect(mobileNav.getByRole("button", { name: label })).toBeVisible();
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

test("customer approval lifecycle browser QA covers request, decisions, activation, RTL and LTR", async ({ page }) => {
  test.setTimeout(180_000);
  const customerPort = "8084";
  const adminPort = "8085";
  const databaseUrl = process.env.CUSTOMER_LIFECYCLE_DATABASE_URL ?? (process.env.CI === "true" ? "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_customer_ci" : "");
  if (!databaseUrl) throw new Error("CUSTOMER_LIFECYCLE_DATABASE_URL is required for shared customer/admin browser QA");

  const spawnBrowserServer = (port: string, userId: string) => {
    const child = spawn(
      "node",
      ["scripts/with-app-env.mjs", "./node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", port],
      {
        env: {
          ...process.env,
          VITE_AUTH_ENABLED: "false",
          MENU_V3_DEV_USER_ID: userId,
          MENU_V3_AUTH_DISABLED_TEST_DATABASE: "true",
          PLATFORM_ADMIN_USER_IDS: "dev-user",
          DATABASE_URL: databaseUrl,
          SUPABASE_DB_URL: "",
          POSTGRES_URL: "",
          POSTGRES_PRISMA_URL: "",
          POSTGRES_URL_NON_POOLING: "",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    child.stdout?.pipe(createWriteStream(`.grok/customer-lifecycle-${port}.log`));
    child.stderr?.pipe(createWriteStream(`.grok/customer-lifecycle-${port}.error.log`));
    return child;
  };

  const customerServer = spawnBrowserServer(customerPort, "customer-lifecycle-user");
  const adminServer = spawnBrowserServer(adminPort, "dev-user");
  const customerBase = `http://127.0.0.1:${customerPort}`;
  const adminBase = `http://127.0.0.1:${adminPort}`;

  async function waitForServer(url: string, label: string) {
    for (let attempt = 1; attempt <= 120; attempt++) {
      try {
        const response = await fetch(url);
        if (response.ok) return;
      } catch (error) {
        if (attempt === 120) throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error(`${label} browser fixture did not start`);
  }

  try {
    await waitForServer(`${customerBase}/onboarding`, "Customer onboarding");
    await waitForServer(`${adminBase}/admin`, "Platform admin");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${customerBase}/studio`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole("heading", { name: "أرسل طلب التفعيل" })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

    const brand = "متجر اختبار دورة الاعتماد";
    await page.getByRole("textbox").nth(0).fill(brand);
    await page.getByRole("textbox").nth(1).fill("Approval Lifecycle Test");
    await page.getByRole("button", { name: "كافيه" }).click();
    await page.getByRole("button", { name: "إرسال طلب التفعيل" }).click();
    await expect(page.getByRole("heading", { name: "طلبك قيد المراجعة" })).toBeVisible();
    await page.getByRole("group", { name: "اختيار اللغة" }).getByRole("button", { name: "EN" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: "Your request is under review" })).toBeVisible();

    await page.goto(`${customerBase}/admin/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Customer Activation Requests" })).toHaveCount(0);

    await page.goto(`${adminBase}/admin/onboarding?lang=en`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: "Customer Activation Requests" })).toBeVisible();
    await expect(page.getByRole("heading", { name: brand })).toBeVisible();
    await page.getByRole("button", { name: "Request changes" }).click();

    await page.goto(`${customerBase}/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "نحتاج معلومات إضافية" })).toBeVisible();
    await page.getByRole("button", { name: "إعادة إرسال طلب التفعيل" }).click();
    await expect(page.getByRole("heading", { name: "طلبك قيد المراجعة" })).toBeVisible();

    await page.goto(`${adminBase}/admin/onboarding?lang=en`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: brand })).toBeVisible();
    await page.getByRole("button", { name: "Reject" }).click();

    await page.goto(`${customerBase}/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "لم تتم الموافقة على الطلب" })).toBeVisible();
    await page.getByRole("button", { name: "إعادة إرسال طلب التفعيل" }).click();
    await expect(page.getByRole("heading", { name: "طلبك قيد المراجعة" })).toBeVisible();

    await page.goto(`${adminBase}/admin/onboarding?lang=en`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: brand })).toBeVisible();
    await page.getByRole("button", { name: "Approve request" }).click();

    await page.goto(`${customerBase}/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "تم اعتماد طلبك" })).toBeVisible();
    await page.getByRole("button", { name: "تفعيل مساحة العمل" }).click();
    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    await expect(page.locator('nav[aria-label="مساحات العمل"], nav[aria-label="Workspace navigation"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  } finally {
    customerServer.kill("SIGTERM");
    adminServer.kill("SIGTERM");
  }
});

test("PH-01.3 self-serve setup provisions safely and hands off to Studio in Arabic and English", async ({ page }) => {
  test.setTimeout(180_000);
  const databaseUrl = process.env.CUSTOMER_LIFECYCLE_DATABASE_URL ?? (process.env.CI === "true" ? "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_customer_ci" : "");
  if (!databaseUrl) throw new Error("CUSTOMER_LIFECYCLE_DATABASE_URL is required for PH-01.3 browser QA");
  const migration = readFileSync("migrations/20260917100000_self_serve_workspace_provisioning.sql", "utf8");
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 4 });
  const userIds = ["ph-01-3-browser-ar", "ph-01-3-browser-en"];
  try {
    await pool.query(migration);
    for (const userId of userIds) {
      await pool.query("delete from menu_v3.tenants where owner_user_id = $1", [userId]);
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
        await cleanup.query("delete from menu_v3.tenants where owner_user_id = $1", [userId]);
        await cleanup.query('delete from menu_v3."user" where "id" = $1', [userId]);
      }
    } finally {
      await cleanup.end();
    }
  }
});
