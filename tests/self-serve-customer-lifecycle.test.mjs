import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const home = await readFile(new URL("../src/routes/index.tsx", import.meta.url), "utf8");
const login = await readFile(new URL("../src/routes/login.tsx", import.meta.url), "utf8");
const onboarding = await readFile(new URL("../src/routes/onboarding.tsx", import.meta.url), "utf8");
const provisioning = await readFile(new URL("../src/lib/menu/self-serve-provisioning.ts", import.meta.url), "utf8");
const admin = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");
const adminUsers = await readFile(new URL("../src/routes/admin/users.tsx", import.meta.url), "utf8");
const migration = await readFile(new URL("../migrations/20260917160000_retire_legacy_customer_request_flows.sql", import.meta.url), "utf8");

test("new customer path is self-serve and does not expose approval UI", () => {
  assert.match(home, /mode: \"signup\"/);
  assert.doesNotMatch(home, /submitLead|request-service|إرسال الطلب|طلب عميل جديد/);
  assert.match(login, /authClient\.signUp\.email/);
  assert.match(login, /saveCustomerRegistrationPhone/);
  assert.match(onboarding, /provisionCustomerWorkspace/);
  assert.doesNotMatch(onboarding, /getMyCustomerAccessStatus|submitActivationRequest|activateApprovedWorkspace|قيد المراجعة|مركز اعتماد/);
  assert.doesNotMatch(provisioning, /CUSTOMER_APPROVAL_REQUIRED/);
});

test("Platform Admin keeps server-authorized customer controls", () => {
  assert.match(admin, /\/admin\/clients/);
  assert.match(admin, /\/admin\/users/);
  assert.doesNotMatch(admin, /طلبات الخدمات|العملاء المحتملون|serviceRequests|approveLead/);
  assert.match(adminUsers, /setPlatformUserBan/);
  assert.match(adminUsers, /deletePlatformUser/);
  assert.match(adminUsers, /verifyPlatformUserPhone/);
  assert.match(adminUsers, /changePlatformSubscriptionPlan/);
  assert.match(adminUsers, /setPlatformAccountFrozen/);
  assert.match(adminUsers, /setPlatformSubscriptionStatus/);
});

test("legacy request data is retired and no longer generated", () => {
  assert.match(migration, /drop trigger if exists tenants_platform_customer_request/);
  assert.match(migration, /delete from menu_v3\.customer_requests/);
  assert.match(migration, /delete from public\.service_requests/);
  assert.match(migration, /delete from menu_v3\.leads/);
  assert.match(migration, /CUSTOMER_WORKSPACE_PROVISIONING_REQUIRED/);
});
