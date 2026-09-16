import { expect, test } from "playwright/test";

const baseURL = process.env.CUSTOMER_ONBOARDING_BASE_URL ?? "http://127.0.0.1:8084";

test("customer approval lifecycle works end-to-end in Arabic and English", async ({ page }) => {
  test.setTimeout(120_000);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/onboarding`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "أرسل طلب التفعيل" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  const brand = "متجر اختبار دورة الاعتماد";
  await page.getByRole("textbox").nth(0).fill(brand);
  await page.getByRole("textbox").nth(1).fill("Approval Lifecycle Test");
  await page.getByRole("button", { name: "كافيه" }).click();
  await page.getByRole("button", { name: "إرسال طلب التفعيل" }).click();
  await expect(page.getByRole("heading", { name: "طلبك قيد المراجعة" })).toBeVisible();
  await expect(page.getByText("لا يمكن دخول الاستوديو قبل الاعتماد")).toBeVisible();

  await page.getByRole("group", { name: "اختيار اللغة" }).getByRole("button", { name: "EN" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: "Your request is under review" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);

  await page.goto(`${baseURL}/admin/onboarding`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Customer Activation Requests" })).toBeVisible();
  await expect(page.getByText(brand)).toBeVisible();
  await page.getByRole("button", { name: "Request changes" }).click();

  await page.goto(`${baseURL}/onboarding`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Action required" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resubmit activation request" })).toBeVisible();
  await page.getByRole("button", { name: "Resubmit activation request" }).click();
  await expect(page.getByRole("heading", { name: "Your request is under review" })).toBeVisible();

  await page.goto(`${baseURL}/admin/onboarding`, { waitUntil: "networkidle" });
  await expect(page.getByText(brand)).toBeVisible();
  await page.getByRole("button", { name: "Reject" }).click();

  await page.goto(`${baseURL}/onboarding`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "The request was not approved" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resubmit activation request" })).toBeVisible();
  await page.getByRole("button", { name: "Resubmit activation request" }).click();
  await expect(page.getByRole("heading", { name: "Your request is under review" })).toBeVisible();

  await page.goto(`${baseURL}/admin/onboarding`, { waitUntil: "networkidle" });
  await expect(page.getByText(brand)).toBeVisible();
  await page.getByRole("button", { name: "Approve request" }).click();

  await page.goto(`${baseURL}/onboarding`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Your request is approved" })).toBeVisible();
  await page.getByRole("button", { name: "Activate workspace" }).click();
  await expect(page).toHaveURL(/\/studio$/);
  await expect(page.locator('nav[aria-label="مساحات العمل"], nav[aria-label="Workspace navigation"]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
});
