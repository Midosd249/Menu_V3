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
  const migration = readFileSync("migrations/20260917100000_self_serve_workspace_provisioning.sql", "utf8");
  const migrationPool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  try {
    await migrationPool.query(migration);
  } finally {
    await migrationPool.end();
  }

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
    for (const [index, userId] of userIds.entries()) {
      const phone = `+96651234567${index}`;
      await pool.query("delete from menu_v3.tenants where owner_user_id = $1", [userId]);
      await pool.query(
        `insert into menu_v3."user" ("id", "name", "email", "emailVerified", "phoneNumber", "phoneNumberVerified", "selfServeEligibleAt") values ($1,$2,$3,true,$4,false,now()) on conflict ("id") do update set "name"=excluded."name", "email"=excluded."email", "phoneNumber"=excluded."phoneNumber", "phoneNumberVerified"=false, "selfServeEligibleAt"=now()`,
        [userId, "PH-01.3 Browser", `${userId}@example.test`, phone],
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

test("PH-01.4 real Better Auth customer can return to an existing workspace through login", async ({ page }) => {
  test.setTimeout(180_000);
  const databaseUrl = process.env.CUSTOMER_LIFECYCLE_DATABASE_URL ?? (process.env.CI === "true" ? "postgresql://postgres:postgres@127.0.0.1:5432/menu_v3_customer_ci" : "");
  if (!databaseUrl) throw new Error("CUSTOMER_LIFECYCLE_DATABASE_URL is required for PH-01.4 browser QA");
  const migration = readFileSync("migrations/20260917100000_self_serve_workspace_provisioning.sql", "utf8");
  const migrationPool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  try { await migrationPool.query(migration); } finally { await migrationPool.end(); }

  const port = "8087";
  const base = `http://127.0.0.1:${port}`;
  const server = spawn(
    "node",
    ["scripts/with-app-env.mjs", "./node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", port],
    {
      env: {
        ...process.env,
        VITE_AUTH_ENABLED: "true",
        BETTER_AUTH_SECRET: "ph-01-4-browser-test-secret",
        BETTER_AUTH_URL: base,
        DATABASE_URL: databaseUrl,
        SUPABASE_DB_URL: "",
        POSTGRES_URL: "",
        POSTGRES_PRISMA_URL: "",
        POSTGRES_URL_NON_POOLING: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout?.pipe(createWriteStream(".grok/ph-01-4-browser.log"));
  server.stderr?.pipe(createWriteStream(".grok/ph-01-4-browser.error.log"));

  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const email = `ph-01-4-${suffix}@example.test`;
  const phone = `05${String(Date.now()).slice(-8)}`;
  const password = "MenuV3-Test-Password-123!";
  let userId = "";

  async function waitForServer() {
    for (let attempt = 1; attempt <= 120; attempt += 1) {
      try {
        const response = await fetch(`${base}/login`);
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

    await page.goto(`${base}/login?mode=signup`, { waitUntil: "domcontentloaded" });
    await page.getByRole("textbox", { name: "الاسم الكامل" }).fill("PH-01.4 Existing Customer");
    await page.getByRole("textbox", { name: "اسم البراند أو المطعم" }).fill("عميل تسجيل الدخول للاختبار");
    await page.getByRole("textbox", { name: "رقم الجوال السعودي" }).fill(phone);
    await page.getByRole("textbox", { name: "البريد الإلكتروني" }).fill(email);
    await page.getByLabel("كلمة المرور").fill(password);
    await page.getByLabel("تأكيد كلمة المرور").fill(password);
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

    const database = new pg.Pool({ connectionString: databaseUrl, max: 1 });
    try {
      const userRows = await database.query<{ id: string }>('select "id" from "user" where "email" = $1 limit 1', [email]);
      userId = userRows.rows[0]?.id ?? "";
      expect(userId).not.toBe("");
      const membershipRows = await database.query<{ tenant_id: string; user_id: string; role: string }>(
        "select tenant_id, user_id, role from tenant_members where user_id = $1 and is_active = true limit 1",
        [userId],
      );
      expect(membershipRows.rows).toHaveLength(1);
      expect(membershipRows.rows[0]?.user_id).toBe(userId);
      expect(membershipRows.rows[0]?.role).toBe("owner");
    } finally { await database.end(); }

    await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/studio$/);
    await expect(page.getByRole("textbox", { name: "البريد الإلكتروني" })).toHaveCount(0);
    await expect(page.getByRole("textbox", { name: "الاسم الكامل" })).toHaveCount(0);

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
    await page.getByRole("textbox", { name: "البريد الإلكتروني" }).fill(email);
    await page.getByLabel("كلمة المرور").fill(password);
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();
    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    await expect(page.getByText(brand, { exact: true })).toBeVisible();

    await page.context().clearCookies();
    await page.goto(`${base}/studio`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("textbox", { name: "البريد الإلكتروني" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "الاسم الكامل" })).toHaveCount(0);

    await page.getByRole("textbox", { name: "البريد الإلكتروني" }).fill(email);
    await page.getByLabel("كلمة المرور").fill(password);
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();
    await expect(page).toHaveURL(/\/studio$/, { timeout: 15_000 });
    await expect(page.getByText(brand, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  } finally {
    server.kill("SIGTERM");
    if (userId) {
      const cleanup = new pg.Pool({ connectionString: databaseUrl, max: 1 });
      try {
        await cleanup.query("delete from tenants where owner_user_id = $1", [userId]);
        await cleanup.query('delete from "user" where "id" = $1', [userId]);
      } finally { await cleanup.end(); }
    }
  }
});
