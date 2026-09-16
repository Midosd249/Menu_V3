import { spawn } from "node:child_process";
import { unlink, writeFile } from "node:fs/promises";
import { expect, test } from "playwright/test";

const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";

async function assertMidnightInkAndSand(page: import("playwright/test").Page) {
  const visual = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const canvas = document.querySelector(".min-h-dvh");
    const header = document.querySelector("header");
    const aside = document.querySelector('aside');
    const active = document.querySelector('[aria-current="page"]');
    return {
      studioScope: Boolean(document.querySelector('nav[aria-label="مساحات العمل"]')),
      bodyBackground: body.backgroundColor,
      bodyPaper: body.getPropertyValue("--color-paper").trim(),
      bodyInk: body.getPropertyValue("--color-ink").trim(),
      bodyRing: body.getPropertyValue("--color-ring").trim(),
      canvasBackground: canvas ? getComputedStyle(canvas).backgroundColor : "",
      headerBackground: header ? getComputedStyle(header).backgroundColor : "",
      asideBackground: aside ? getComputedStyle(aside).backgroundColor : "",
      activeBackground: active ? getComputedStyle(active).backgroundColor : "",
      activeColor: active ? getComputedStyle(active).color : "",
    };
  });

  expect(visual.studioScope).toBe(true);
  expect(visual.bodyBackground).toBe("rgb(242, 237, 227)");
  expect(visual.bodyPaper).toBe("#fbf8f2");
  expect(visual.bodyInk).toBe("#1d2421");
  expect(visual.bodyRing).toBe("#8b642e");
  expect(visual.canvasBackground).toBe("rgb(242, 237, 227)");
  expect(visual.headerBackground).toBe("rgb(251, 248, 242)");
  expect(visual.asideBackground).toBe("rgb(31, 37, 34)");
  expect(visual.activeBackground).toBe("rgb(44, 52, 48)");
  expect(visual.activeColor).toBe("rgb(255, 255, 255)");
}

test("W7.3 Studio shell browser QA", async ({ page }) => {
  test.setTimeout(120_000);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
  const desktopNav = page.locator('nav[aria-label="مساحات العمل"]');
  await expect(desktopNav).toBeVisible();
  await expect(desktopNav.locator("button")).toHaveCount(6);

  await assertMidnightInkAndSand(page);

  for (const label of ["نظرة عامة", "القائمة", "الطلبات", "النمو", "العملاء", "الإعدادات"]) {
    await expect(desktopNav.getByRole("button", { name: label })).toBeVisible();
  }
  await expect(desktopNav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(desktopNav.locator('a[href="/studio/reports"]')).toHaveCount(0);
  await expect(desktopNav.locator('a[href="/studio/loyalty"], a[href="/studio/campaigns"], a[href="/studio/feedback"], a[href="/studio/retention"]')).toHaveCount(0);
  await expect(desktopNav.locator('a[href="/admin"]')).toHaveCount(0);

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  const firstWorkspace = desktopNav.locator("button").first();
  await firstWorkspace.focus();
  await expect(firstWorkspace).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/studio`, { waitUntil: "domcontentloaded" });
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

test("customer approval lifecycle browser QA covers request, decisions, activation, RTL and LTR", async ({ page }) => {
  test.setTimeout(180_000);

  const port = "8084";
  const fixturePath = "migrations/99999999_w7_3_customer_activation_browser_fixture.sql";
  await writeFile(
    fixturePath,
    `create table if not exists menu_v3.member_branch_access (\n  tenant_id text not null,\n  user_id text not null,\n  branch_id text not null,\n  created_at timestamptz not null default now(),\n  primary key (user_id, branch_id),\n  foreign key (tenant_id) references menu_v3.tenants(id) on delete cascade,\n  foreign key (branch_id) references menu_v3.branches(id) on delete cascade\n);\n\ncreate index if not exists member_branch_access_tenant_user_idx\n  on menu_v3.member_branch_access (tenant_id, user_id);\n\ncreate index if not exists member_branch_access_branch_idx\n  on menu_v3.member_branch_access (branch_id, user_id);\n`,
  );

  const child = spawn("node", ["scripts/with-app-env.mjs", "./node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", port], {
    env: {
      ...process.env,
      VITE_AUTH_ENABLED: "false",
      PLATFORM_ADMIN_USER_IDS: "dev-user",
      DATABASE_URL: "",
      SUPABASE_DB_URL: "",
      POSTGRES_URL: "",
      POSTGRES_PRISMA_URL: "",
      POSTGRES_URL_NON_POOLING: "",
    },
    stdio: "ignore",
  });

  try {
    let started = false;
    for (let attempt = 1; attempt <= 120; attempt += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/onboarding`);
        if (response.ok) {
          started = true;
          break;
        }
      } catch (error) {
        if (attempt === 120) throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    if (!started) throw new Error("Customer onboarding browser fixture did not start");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://127.0.0.1:${port}/onboarding`, { waitUntil: "domcontentloaded" });
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

    await page.goto(`http://127.0.0.1:${port}/admin/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Customer Activation Requests" })).toBeVisible();
    await expect(page.getByText(brand)).toBeVisible();
    await page.getByRole("button", { name: "Request changes" }).click();

    await page.goto(`http://127.0.0.1:${port}/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Action required" })).toBeVisible();
    await page.getByRole("button", { name: "Resubmit activation request" }).click();
    await expect(page.getByRole("heading", { name: "Your request is under review" })).toBeVisible();

    await page.goto(`http://127.0.0.1:${port}/admin/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText(brand)).toBeVisible();
    await page.getByRole("button", { name: "Reject" }).click();

    await page.goto(`http://127.0.0.1:${port}/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "The request was not approved" })).toBeVisible();
    await page.getByRole("button", { name: "Resubmit activation request" }).click();
    await expect(page.getByRole("heading", { name: "Your request is under review" })).toBeVisible();

    await page.goto(`http://127.0.0.1:${port}/admin/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText(brand)).toBeVisible();
    await page.getByRole("button", { name: "Approve request" }).click();

    await page.goto(`http://127.0.0.1:${port}/onboarding`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Your request is approved" })).toBeVisible();
    await page.getByRole("button", { name: "Activate workspace" }).click();
    await expect(page).toHaveURL(/\/studio$/);
    await expect(page.locator('nav[aria-label="مساحات العمل"], nav[aria-label="Workspace navigation"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  } finally {
    child.kill("SIGTERM");
    await unlink(fixturePath).catch(() => undefined);
  }
});