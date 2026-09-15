import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync("migrations/20260916010000_customer_lifecycle_access_policy.sql", "utf8");
const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
const platform = readFileSync("src/lib/menu/platform-onboarding.ts", "utf8");
const login = readFileSync("src/routes/login.tsx", "utf8");
const studio = readFileSync("src/lib/menu/studio.tsx", "utf8");

test("new tenant creation is denied without active platform approval", () => {
  assert.match(migration, /before insert on menu_v3\.tenants/);
  assert.match(migration, /l\.status = 'qualified'/);
  assert.match(migration, /lo\.approved_at is not null/);
  assert.match(migration, /lo\.used_at is null/);
  assert.match(migration, /lo\.revoked_at is null/);
  assert.match(migration, /lo\.expires_at > now\(\)/);
  assert.match(migration, /CUSTOMER_APPROVAL_REQUIRED/);
});

test("approved onboarding is bound to the requested email address", () => {
  assert.match(platform, /select lo\.id, lo\.lead_id, lo\.expires_at, lo\.used_at, lo\.revoked_at, l\.business_name, l\.city, l\.contact_phone, l\.contact_email/);
  assert.match(platform, /accountEmail !== leadEmail/);
  assert.match(platform, /استخدم الحساب المرتبط بالبريد الإلكتروني في طلب الخدمة/);
});

test("self-service onboarding no longer provisions a tenant", () => {
  assert.match(onboarding, /getMyCustomerAccessStatus/);
  assert.doesNotMatch(onboarding, /createRestaurant\(/);
  assert.doesNotMatch(onboarding, /seedStarterItems/);
  assert.doesNotMatch(onboarding, /updateTenant/);
  assert.match(onboarding, /مساحة العميل بانتظار الاعتماد/);
  assert.match(onboarding, /Request service|طلب الخدمة/);
});

test("an authenticated account without a tenant still cannot enter Studio", () => {
  assert.match(studio, /Navigate to=.*onboarding/);
  assert.match(studio, /if \(state\.status === "empty"\)/);
});

test("login sign-up remains an account creation surface, while workspace creation is separately gated", () => {
  assert.match(login, /authClient\.signUp\.email/);
  assert.match(login, /navigate\(\{ to: "\/studio"/);
  assert.match(onboarding, /getMyCustomerAccessStatus/);
});
