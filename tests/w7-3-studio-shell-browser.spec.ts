import { test, expect } from "@playwright/test";
import { createWriteStream } from "node:fs";
import { spawn } from "node:child_process";

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

  const spawnBrowserServer = (port: string, userId: string) => spawn(
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
      stdio: ["ignore", createWriteStream(`.grok/customer-lifecycle-${port}.log"), createWriteStream(`.grok/customer-lifecycle-${port}.error.log`)],
    },
  );

  const customerServer = spawnBrowserServer(customerPort, "customer-lifecycle-user");
  const adminServer = spawnBrowserServer(adminPort, "dev-user");
  const customerBase = `http://127.0.0.1:${customerPort}`;
  const adminBase = `http://127.0.0.1:${adminPort}`;

  async function waitForServer(url: string, label: string) {
    for (let attempt = 1; attempt <= 120; attempt += 1) {
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
