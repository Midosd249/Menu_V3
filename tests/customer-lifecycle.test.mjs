import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const policyMigration = readFileSync("migrations/20260916010000_customer_lifecycle_access_policy.sql", "utf8");
const lifecycleMigration = readFileSync("migrations/20260916100000_customer_activation_lifecycle.sql", "utf8");
const retireMigration = readFileSync("migrations/20260916110000_retire_self_serve_workspace.sql", "utf8");
const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");
const registration = readFileSync("src/lib/auth/customer-registration.ts", "utf8");
const authServer = readFileSync("src/lib/auth/server.ts", "utf8");
const login = readFileSync("src/routes/login.tsx", "utf8");
const home = readFileSync("src/routes/index.tsx", "utf8");
const studio = readFileSync("src/lib/menu/studio.tsx", "utf8");
const studioOwner = readFileSync("src/lib/menu/owner.ts", "utf8");
const authMiddleware = readFileSync("src/lib/auth/middleware.ts", "utf8");
const authorization = readFileSync("src/lib/auth/authorization.server.ts", "utf8");
const lifecycle = readFileSync("src/lib/menu/customer-lifecycle.ts", "utf8");


test("new tenant creation remains denied without an approved lifecycle state", () => {
  assert.match(policyMigration, /before insert on menu_v3\.tenants/);
  assert.match(policyMigration, /CUSTOMER_APPROVAL_REQUIRED/);
  assert.match(lifecycleMigration, /l\.activation_status = 'approved'/);
  assert.match(lifecycleMigration, /l\.account_user_id = new\.owner_user_id/);
  assert.doesNotMatch(lifecycleMigration, /self_serve_registration_grants[\s\S]*used_at is null[\s\S]*return new/);
});

test("account-linked activation requests have explicit states and a unique account owner", () => {
  assert.match(lifecycleMigration, /activation_status in \('legacy', 'pending', 'action_required', 'approved', 'activated', 'rejected'\)/);
  assert.match(lifecycleMigration, /create unique index if not exists leads_account_user_unique_idx/);
  assert.match(lifecycle, /submitActivationRequest/);
  assert.match(lifecycle, /account_user_id/);
});

test("customer onboarding never creates a tenant during signup or brand submission", () => {
  assert.match(login, /authClient\.signUp\.email/);
  assert.match(login, /saveCustomerRegistrationPhone/);
  assert.match(login, /navigate\(\{ to: "\/onboarding"/);
  assert.doesNotMatch(onboarding, /createRestaurant\(/);
  assert.doesNotMatch(onboarding, /createSelfServeWorkspace/);
  assert.match(onboarding, /submitActivationRequest/);
  assert.match(onboarding, /activateApprovedWorkspace/);
});

test("customer status survives logout/login through the account-linked request", () => {
  assert.match(onboarding, /getMyCustomerAccessStatus/);
  assert.match(onboarding, /قيد المراجعة/);
  assert.match(onboarding, /Pending/);
  assert.match(onboarding, /لا يمكن دخول الاستوديو قبل الاعتماد/);
});

test("admin review supports approve, reject, and action-required states", () => {
  const admin = readFileSync("src/routes/admin/onboarding.tsx", "utf8");
  const adminServer = readFileSync("src/lib/menu/admin.ts", "utf8");
  assert.match(admin, /reviewActivationRequest/);
  assert.match(admin, /اعتماد الطلب/);
  assert.match(admin, /طلب تعديل/);
  assert.match(admin, /رفض/);
  assert.match(adminServer, /decision: z\.enum\(\["approve", "reject", "action_required"\]\)/);
  assert.match(adminServer, /activation_status in \('pending', 'action_required', 'rejected'\)/);
});

test("workspace activation is atomic and idempotent", () => {
  assert.match(lifecycle, /activate_customer_workspace/);
  assert.match(lifecycleMigration, /from menu_v3\.leads[\s\S]*for update/);
  assert.match(lifecycleMigration, /insert into menu_v3\.tenants/);
  assert.match(lifecycleMigration, /insert into menu_v3\.tenant_members/);
  assert.match(lifecycleMigration, /insert into menu_v3\.branches/);
  assert.match(lifecycleMigration, /insert into menu_v3\.branch_hours/);
  assert.match(lifecycleMigration, /activation_status = 'activated'/);
});

test("legacy registration links remain a fallback and are hardened", () => {
  const platform = readFileSync("src/lib/menu/platform-onboarding.ts", "utf8");
  const legacyRoute = readFileSync("src/routes/onboarding/$token.tsx", "utf8");
  assert.match(platform, /activate_legacy_customer_workspace/);
  assert.match(platform, /accountEmail !== leadEmail/);
  assert.match(lifecycleMigration, /activate_legacy_customer_workspace/);
  assert.match(legacyRoute, /activateLeadOnboarding/);
  assert.match(lifecycleMigration, /LEGACY_ONBOARDING_STATE_CHANGED/);
});

test("signup no longer issues a workspace-creation grant", () => {
  assert.doesNotMatch(authServer, /createAuthMiddleware/);
  assert.doesNotMatch(authServer, /insert into self_serve_registration_grants/);
  assert.doesNotMatch(registration, /insert into self_serve_registration_grants/);
  assert.match(retireMigration, /drop function if exists menu_v3\.create_self_serve_workspace/);
});

test("Saudi phone capture and password confirmation remain part of account registration", () => {
  assert.match(login, /الاسم الكامل/);
  assert.match(login, /رقم الجوال/);
  assert.match(login, /تأكيد كلمة المرور/);
  assert.match(registration, /normalizePhoneDigits/);
  assert.match(login, /لا نستخدم SMS OTP/);
});

test("Studio remains gated by active tenant membership", () => {
  assert.match(studio, /Navigate to=.*onboarding/);
  assert.match(studio, /state\.status === "empty"/);
});

test("public CTA still opens account registration", () => {
  assert.match(home, /ابدأ مجانًا/);
  assert.match(home, /mode: "signup"/);
});

test("PH-01.4 login route sends authenticated users to Studio without rendering registration fields", () => {
  assert.match(login, /if \(user\) return <Navigate to="\/studio" \/>/);
  assert.match(login, /if \(user && invite\) return <Navigate to="\/invite\/\$token"/);
  assert.match(login, /authClient\.signIn\.email/);
  assert.match(login, /authClient\.signIn\.phoneNumber/);
  assert.doesNotMatch(login, /if \(user\)[\s\S]*render.*signup/i);
});

test("PH-01.4 Studio access resolves tenant membership from the verified session user", () => {
  assert.match(authMiddleware, /const userId = await requireUserId\(context\.bearerToken\)/);
  assert.match(studioOwner, /membershipOf\(sql, context\.userId\)/);
  assert.match(studioOwner, /where user_id = \$\{userId\} and is_active = true/);
  assert.match(studioOwner, /loadSnapshot\(sql, member\.tenant_id, member\.role\)/);
  assert.match(authorization, /where user_id = \$\{userId\} and is_active = true/);
});

test("PH-01.4 invalid or missing session remains fail-closed at the Studio boundary", () => {
  assert.match(studio, /if \(sessionError && !user\) return <ErrorState/);
  assert.match(studio, /if \(!user\) return <RedirectToSignIn \/>/);
  assert.match(authMiddleware, /assertSameSiteRequest\(\)/);
  assert.match(authMiddleware, /requireUserId\(context\.bearerToken\)/);
});

test("PH-01.4 tenant resources remain scoped to the resolved membership tenant", () => {
  assert.match(studioOwner, /where id = \$\{tenantId\} limit 1/);
  assert.match(studioOwner, /where tenant_id = \$\{tenantId\} order by created_at/);
  assert.match(studioOwner, /where tenant_id = \$\{tenantId\} order by sort_order, created_at/);
  assert.match(studioOwner, /where tenant_id = \$\{tenantId\} and is_active = true/);
  assert.match(authorization, /tenant_id = \$\{membership\.tenantId\}/);
});
