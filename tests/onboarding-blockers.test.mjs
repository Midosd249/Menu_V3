import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const login = readFileSync("src/routes/login.tsx", "utf8");
const registration = readFileSync("src/lib/auth/customer-registration.ts", "utf8");
const owner = readFileSync("src/lib/menu/owner.ts", "utf8");

test("signup phone is persisted before the verification handoff", () => {
  assert.match(login, /authClient\.signUp\.email\(\{ email, password, name, phoneNumber: validationResult\.data\.phone \}\)/);
  assert.doesNotMatch(login, /sessionStorage|savePendingRegistration|readPendingRegistrationPhone/);
  assert.match(login, /authClient\.sendVerificationEmail/);
  assert.match(login, /await navigate\(\{ to: "\/verify-email", replace: true \}\)/);
});

test("onboarding exposes recovery and exit paths when phone eligibility is missing", () => {
  const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
  assert.match(onboarding, /saveCustomerRegistrationPhone/);
  assert.match(onboarding, /حفظ الرقم والمتابعة/);
  assert.match(onboarding, /إعادة المحاولة/);
  assert.match(onboarding, /تسجيل الخروج والعودة لتسجيل الدخول/);
  assert.match(onboarding, /signOut\("\/login"\)/);
});

test("registration phone persistence only accepts the incomplete new-registration account", () => {
  assert.match(registration, /select "phoneNumber" as phone_number, "createdAt" as user_created_at/);
  assert.match(registration, /userRow\.phone_number != null/);
  assert.match(registration, /sessionCreatedAt >= userCreatedAt/);
  assert.match(registration, /NEW_REGISTRATION_SESSION_WINDOW_MS/);
  assert.match(registration, /code: "conflict"/);
});

test("duplicate phone remains rejected without disclosing account ownership", () => {
  assert.match(registration, /where "phoneNumber" = \$\{phone\} and "id" <> \$\{context\.userId\}/);
  assert.match(registration, /code: "conflict"/);
  const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
  assert.match(onboarding, /رقم الجوال مستخدم بالفعل/);
  assert.match(onboarding, /That phone number is already in use/);
  assert.doesNotMatch(login, /رقم الجوال مستخدم بالفعل/);
});

test("publish is guarded server-side by category and available-product readiness", () => {
  const publishBlock = owner.match(/export const updateTenant[\s\S]*?export const saveCategory/);
  assert.ok(publishBlock, "updateTenant block should exist");
  assert.match(publishBlock[0], /data\.isPublished === true/);
  assert.match(publishBlock[0], /from categories where tenant_id = \$\{member\.tenant_id\}/);
  assert.match(publishBlock[0], /from products where tenant_id = \$\{member\.tenant_id\} and is_available = true/);
  assert.match(publishBlock[0], /لا يمكن نشر المنيو قبل إضافة تصنيف واحد ومنتج متاح على الأقل/);
  assert.match(publishBlock[0], /Publish requires at least one category and one available product/);
  assert.match(publishBlock[0], /is_published = coalesce/);
});

test("publish with a category and available product still reaches the normal tenant update", () => {
  const publishBlock = owner.match(/export const updateTenant[\s\S]*?export const saveCategory/);
  assert.ok(publishBlock);
  const guardIndex = publishBlock[0].indexOf("if (data.isPublished === true)");
  const updateIndex = publishBlock[0].indexOf("is_published = coalesce");
  assert.ok(guardIndex >= 0 && updateIndex > guardIndex, "valid publish path must continue to the tenant update");
});

test("publish guard does not add branch-completeness requirements", () => {
  const publishBlock = owner.match(/export const updateTenant[\s\S]*?export const saveCategory/);
  assert.ok(publishBlock);
  assert.doesNotMatch(publishBlock[0], /branches where tenant_id/);
  assert.doesNotMatch(publishBlock[0], /address_ar/);
  assert.doesNotMatch(publishBlock[0], /maps_url/);
  assert.doesNotMatch(publishBlock[0], /branch.*phone/i);
});
