import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync("migrations/20260916010000_customer_lifecycle_access_policy.sql", "utf8");
const grantMigration = readFileSync("migrations/20260916060000_self_serve_registration_grant.sql", "utf8");
const atomicMigration = readFileSync("migrations/20260916070000_self_serve_workspace_atomic.sql", "utf8");
const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
const selfServe = readFileSync("src/lib/menu/self-serve-onboarding.ts", "utf8");
const registration = readFileSync("src/lib/auth/customer-registration.ts", "utf8");
const authServer = readFileSync("src/lib/auth/server.ts", "utf8");
const businessTypeMigration = readFileSync("migrations/20260916050000_self_serve_business_type.sql", "utf8");
const platform = readFileSync("src/lib/menu/platform-onboarding.ts", "utf8");
const login = readFileSync("src/routes/login.tsx", "utf8");
const home = readFileSync("src/routes/index.tsx", "utf8");
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

test("self-service onboarding preserves the legacy approval path", () => {
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

test("public CTA opens the self-serve registration flow", () => {
  assert.match(home, /ابدأ مجانًا/);
  assert.match(home, /mode: "signup"/);
});

test("registration captures full name, Saudi phone, password confirmation, and does not use SMS OTP", () => {
  assert.match(login, /الاسم الكامل/);
  assert.match(login, /رقم الجوال/);
  assert.match(login, /تأكيد كلمة المرور/);
  assert.match(login, /saveCustomerRegistrationPhone/);
  assert.match(login, /لا نستخدم SMS OTP/);
});

test("self-serve grant is issued only by the successful email-signup server hook", () => {
  assert.match(authServer, /ctx\.path !== "\/sign-up\/email"/);
  assert.match(authServer, /ctx\.context\.newSession\?\.user\.id/);
  assert.match(authServer, /insert into self_serve_registration_grants/);
  assert.doesNotMatch(registration, /insert into self_serve_registration_grants/);
  assert.match(grantMigration, /used_at is null/);
  assert.match(grantMigration, /set used_at = now\(\)/);
});

test("self-serve workspace creation requires the registered Saudi phone and consumes the grant atomically", () => {
  assert.match(registration, /normalizePhoneDigits/);
  assert.match(registration, /phoneNumber.*حساب آخر|phoneNumber/);
  assert.match(selfServe, /authMiddleware/);
  assert.match(selfServe, /9665/);
  assert.match(selfServe, /used_at is null/);
  assert.match(selfServe, /create_self_serve_workspace/);
  assert.match(atomicMigration, /insert into menu_v3\.tenants/);
  assert.match(atomicMigration, /insert into menu_v3\.tenant_members/);
  assert.match(atomicMigration, /insert into menu_v3\.branches/);
  assert.match(atomicMigration, /insert into menu_v3\.branch_hours/);
  assert.match(atomicMigration, /SELF_SERVE_GRANT_REQUIRED/);
  assert.match(atomicMigration, /CUSTOMER_PHONE_REQUIRED/);
});

test("business type is restricted to the six approved values and the primary branch is created", () => {
  assert.match(selfServe, /restaurant.*cafe.*bakery.*dessert.*food_truck.*other/);
  assert.match(businessTypeMigration, /business_type/);
  assert.match(businessTypeMigration, /restaurant.*cafe.*bakery.*dessert.*food_truck.*other/);
  assert.match(selfServe, /الفرع الرئيسي/);
});
