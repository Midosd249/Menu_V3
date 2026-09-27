import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const login = readFileSync("src/routes/login.tsx", "utf8");
const registration = readFileSync("src/lib/auth/customer-registration.ts", "utf8");
const owner = readFileSync("src/lib/menu/owner.ts", "utf8");

test("failed phone persistence is resumable with the same email and credentials", () => {
  const signupBlock = login.match(/const result = await authClient\\.signUp\\.email\\([\\s\\S]*?await navigate\\(\\{ to: "\\/onboarding"/);
  assert.ok(signupBlock, "signup flow should remain a single resumable path");
  assert.match(signupBlock[0], /if \\(result\\.error\\)[\\s\\S]*authClient\\.signIn\\.email/);
  assert.match(signupBlock[0], /authClient\\.signIn\\.email\\(\\{ email, password \\}\\)/);
  assert.match(signupBlock[0], /saveCustomerRegistrationPhone\\(\\{ data: \\{ phone \\} \\}\\)/);
  assert.match(signupBlock[0], /phoneResult\\.ok/);
  assert.match(signupBlock[0], /navigate\\(\\{ to: "\\/onboarding"/);
});

test("registration phone persistence only accepts the incomplete new-registration account", () => {
  assert.match(registration, /select "phoneNumber", "createdAt" from "user"/);
  assert.match(registration, /"phoneNumber" is null/);
  assert.match(registration, /sessionCreatedAt >= userCreatedAt/);
  assert.match(registration, /NEW_REGISTRATION_SESSION_WINDOW_MS/);
  assert.match(registration, /code: "conflict"/);
});

test("genuinely duplicate phone remains rejected with a clear bilingual message", () => {
  assert.match(registration, /where "phoneNumber" = \\$\\{phone\\} and "id" <> \\$\\{context\\.userId\\}/);
  assert.match(login, /رقم الجوال مستخدم بالفعل/);
  assert.match(login, /Phone number is already in use/);
});

test("publish is guarded server-side by category and available-product readiness", () => {
  const publishBlock = owner.match(/export const updateTenant[\\s\\S]*?export const saveCategory/);
  assert.ok(publishBlock, "updateTenant block should exist");
  assert.match(publishBlock[0], /data\\.isPublished === true/);
  assert.match(publishBlock[0], /from categories where tenant_id = \\$\\{member\\.tenant_id\\}/);
  assert.match(publishBlock[0], /from products where tenant_id = \\$\\{member\\.tenant_id\\} and is_available = true/);
  assert.match(publishBlock[0], /لا يمكن نشر المنيو قبل إضافة تصنيف واحد ومنتج متاح على الأقل/);
  assert.match(publishBlock[0], /Publish requires at least one category and one available product/);
  assert.match(publishBlock[0], /is_published = coalesce/);
});

test("publish guard does not add branch-completeness requirements", () => {
  const publishBlock = owner.match(/export const updateTenant[\\s\\S]*?export const saveCategory/);
  assert.ok(publishBlock);
  assert.doesNotMatch(publishBlock[0], /branches where tenant_id/);
  assert.doesNotMatch(publishBlock[0], /address_ar/);
  assert.doesNotMatch(publishBlock[0], /maps_url/);
  assert.doesNotMatch(publishBlock[0], /branch.*phone/i);
});
