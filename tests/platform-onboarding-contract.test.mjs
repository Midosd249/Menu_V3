import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const admin = readFileSync("src/routes/admin/onboarding.tsx", "utf8");
const adminServer = readFileSync("src/lib/menu/admin.ts", "utf8");
const server = readFileSync("src/lib/menu/platform-onboarding.ts", "utf8");
const migration = readFileSync("migrations/20260909230000_lead_onboarding.sql", "utf8");
const lifecycleMigration = readFileSync("migrations/20260916100000_customer_activation_lifecycle.sql", "utf8");
const publicOnboarding = readFileSync("src/routes/onboarding/$token.tsx", "utf8");
const rootAdmin = readFileSync("src/routes/admin.tsx", "utf8");
const studio = readFileSync("src/lib/menu/studio.tsx", "utf8");
const publicHome = readFileSync("src/routes/index.tsx", "utf8");


test("platform onboarding exposes the unified activation review workflow", () => {
  assert.match(rootAdmin, /اعتماد العملاء الجدد/);
  assert.match(admin, /طلبات تفعيل العملاء|Customer Activation Requests/);
  assert.match(admin, /اعتماد الطلب|Approve request/);
  assert.match(admin, /طلب تعديل|Request changes/);
  assert.match(admin, /getAdminActivationRequests/);
  assert.match(adminServer, /reviewActivationRequest/);
});

test("new activation review never requires a registration link", () => {
  assert.doesNotMatch(admin, /approveLead\(\{ data: \{ leadId: selected\.id \}\}/);
  assert.doesNotMatch(admin, /نسخ رابط التسجيل/);
  assert.match(admin, /legacy/);
  assert.match(admin, /legacyApprove/);
});

test("legacy lead approval remains server-authorized and token based", () => {
  assert.match(server, /requirePlatformAdmin/);
  assert.match(server, /createHash\("sha256"\)/);
  assert.match(server, /randomBytes\(32\)/);
  assert.match(server, /expires_at/);
  assert.match(server, /activateLeadOnboarding/);
  assert.match(server, /registrationUrl/);
  assert.match(server, /\/onboarding\/\$\{token\}/);
});

test("legacy onboarding schema keeps the token secret and tenant link", () => {
  assert.match(migration, /token_hash text not null unique/);
  assert.match(migration, /lead_id text not null references leads/);
  assert.match(migration, /tenant_id text references tenants/);
  assert.match(migration, /revoked_at timestamptz/);
});

test("legacy registration link remains available as a fallback", () => {
  assert.match(publicOnboarding, /activateLeadOnboarding/);
  assert.match(publicOnboarding, /فتح الاستوديو/);
  assert.match(lifecycleMigration, /activate_legacy_customer_workspace/);
});

test("legacy lead activation is concurrency hardened", () => {
  assert.match(lifecycleMigration, /select \* into onboarding_row[\s\S]*for update/);
  assert.match(lifecycleMigration, /LEGACY_ONBOARDING_STATE_CHANGED/);
});

test("platform owners leave studio for the dedicated admin workspace", () => {
  assert.match(studio, /getPlatformAdminAccess/);
  assert.match(studio, /state\.isPlatformAdmin/);
  assert.match(studio, /Navigate to=.*admin/);
  assert.match(studio, /Navigate to=.*onboarding/);
});

test("public lead form keeps the form reference across the async submit", () => {
  assert.match(publicHome, /const formElement = event\.currentTarget/);
  assert.match(publicHome, /new FormData\(formElement\)/);
  assert.match(publicHome, /formElement\.reset\(\)/);
});
