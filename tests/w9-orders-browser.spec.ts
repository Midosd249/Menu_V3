import { expect, test } from "playwright/test";
const BASE_URL = process.env.STUDIO_SHELL_BASE_URL ?? "http://127.0.0.1:8082";
async function go(page: { goto: (url: string, options: { waitUntil: "domcontentloaded" }) => Promise<unknown> }, url: string) { await page.goto(url, { waitUntil: "domcontentloaded" }); }

test("W9 Orders mobile detail, language switch, contact actions, and status actions", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 320, height: 800 });
  await go(page, `${BASE_URL}/studio/orders`);
  await expect(page.getByRole("heading", { name: "الطلبات" })).toBeVisible();
  await page.getByRole("button", { name: /#\d+ · أحمد العتيبي/ }).first().click();
  await expect(page.getByRole("heading", { name: "أحمد العتيبي" })).toBeVisible();
  await expect(page.getByRole("button", { name: "تأكيد الطلب" })).toBeVisible();
  await expect(page.getByRole("link", { name: /واتساب أحمد العتيبي/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /اتصال أحمد العتيبي/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "طباعة الإيصال" })).toBeVisible();
  await page.getByRole("button", { name: "طباعة الإيصال" }).first().click();
  const receiptDialog = page.getByRole("dialog", { name: "معاينة الإيصال" });
  await expect(receiptDialog).toBeVisible();
  await expect(receiptDialog.getByText("إيصال", { exact: true }).first()).toBeVisible();
  await expect(receiptDialog.getByText("رقم الطلب", { exact: true })).toBeVisible();
  await expect(receiptDialog.getByText("الإجمالي", { exact: true }).last()).toBeVisible();
  await expect(receiptDialog.getByText("ملاحظات الطلب", { exact: true })).toHaveCount(0);
  await receiptDialog.getByRole("button", { name: "إغلاق" }).click();
  await expect(receiptDialog).toHaveCount(0);
  await page.getByRole("button", { name: "تأكيد الطلب" }).click();
  await expect(page.getByRole("button", { name: "بدء التحضير" })).toBeVisible();
  const orderUrl = page.url();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "أحمد العتيبي" })).toBeVisible();
  expect(page.url()).toBe(orderUrl);
  await page.getByRole("group", { name: "اختيار اللغة" }).getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start preparing" })).toBeVisible();
  await page.getByRole("group", { name: "Language selection" }).getByRole("button", { name: "عربي" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "الطلبات" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});

test("W9 Orders responsive detail and no-phone state", async ({ page }) => {
  test.setTimeout(120_000);
  for (const viewport of [{ width: 320, height: 800 }, { width: 360, height: 800 }, { width: 390, height: 844 }, { width: 430, height: 932 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1280, height: 800 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await go(page, `${BASE_URL}/studio/orders`);
    await page.getByRole("button", { name: /#\d+ · أحمد العتيبي/ }).first().click();
    await expect(page.getByRole("heading", { name: "أحمد العتيبي" })).toBeVisible();
    await expect(page.getByRole("link", { name: /واتساب أحمد العتيبي/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  }
  await go(page, `${BASE_URL}/studio/orders`);
  await page.getByRole("button", { name: /#\d+ · سارة القحطاني/ }).first().click();
  await expect(page.getByText("لا يوجد رقم جوال صالح للتواصل مع العميل.", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /واتساب سارة القحطاني/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /اتصال سارة القحطاني/ })).toHaveCount(0);
});

test("W9 Orders browser history preserves order context", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await go(page, `${BASE_URL}/studio/orders`);
  await page.getByRole("button", { name: /#\d+ · أحمد العتيبي/ }).first().click();
  const selectedUrl = page.url();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "الطلبات" })).toBeVisible();
  expect(page.url()).not.toBe(selectedUrl);
  await page.goForward();
  await expect(page.getByRole("heading", { name: "أحمد العتيبي" })).toBeVisible();
});
