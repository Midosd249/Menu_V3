import { test, expect } from "@playwright/test";

const BASE_URL = process.env.MENUUN_BRAND_BASE_URL ?? "http://127.0.0.1:8081";
const MARKETING_FOOTER = 'footer:not(.menuq-live-footer)';

async function expectFooterContract(page: import("@playwright/test").Page, language: "ar" | "en") {
  const footer = page.locator(MARKETING_FOOTER);
  const links = language === "ar"
    ? ["الباقات والأسعار", "المعاينة", "تسجيل الدخول", "شروط الاستخدام", "سياسة الخصوصية"]
    : ["Pricing", "Preview", "Sign in", "Terms of Service", "Privacy Policy"];

  await expect(footer).toContainText(language === "ar" ? "تواصل معنا" : "Contact");
  for (const label of links) await expect(footer).toContainText(label);
  const emailLink = footer.locator('a[href="mailto:ahmed.mohamed@menuun.com"]');
  await expect(emailLink).toHaveCount(1);
  await expect(emailLink).toHaveAccessibleName(language === "ar" ? "إرسال بريد إلكتروني" : "Send email");
  await expect(emailLink.locator("svg")).toBeVisible();
  const whatsappLink = footer.locator('a[href="https://wa.me/966549598318"]');
  await expect(whatsappLink).toHaveCount(1);
  await expect(whatsappLink).toHaveAccessibleName(language === "ar" ? "التواصل عبر واتساب" : "Contact us on WhatsApp");
  await expect(whatsappLink.locator("svg")).toBeVisible();
  await expect(footer.locator('a[href="/terms"]')).toHaveCount(1);
  await expect(footer.locator('a[href="/privacy"]')).toHaveCount(1);
  await expect(footer).not.toContainText("ahmed.mohamed@menuun.com");
  await expect(footer).not.toContainText("+966 54 959 8318");
  await expect(footer).toContainText(/© \d{4} Menuun/);
}

test.describe("Menuun customer-facing brand surfaces", () => {
  test("homepage renders the approved Menuun brand and footer in Arabic and English", async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator('header img[alt="Menuun — منيو رقمي للمطاعم والكافيهات"]')).toBeVisible();
    await expectFooterContract(page, "ar");
    await expect(page.locator("body")).not.toContainText("Menu V3");

    await page.goto(`${BASE_URL}/?lang=en`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator('header img[alt="Menuun"]')).toBeVisible();
    await expectFooterContract(page, "en");
    await expect(page.locator("body")).not.toContainText("Menu V3");
  });

  test("login renders the Menuun identity and footer in Arabic and English", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("img", { name: /Menuun.*منيو رقمي للمطاعم والكافيهات/ })).toBeVisible();
    await expectFooterContract(page, "ar");
    await expect(page.locator("body")).not.toContainText("Menu V3");

    await page.goto(`${BASE_URL}/login?lang=en`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("img", { name: "Menuun" })).toBeVisible();
    await expectFooterContract(page, "en");
    await expect(page.locator("body")).not.toContainText("Menu V3");
  });
});
