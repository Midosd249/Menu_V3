import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const admin = readFileSync("src/routes/admin/onboarding.tsx", "utf8");
const server = readFileSync("src/lib/menu/platform-onboarding.ts", "utf8");
const migration = readFileSync("migrations/20260909230000_lead_onboarding.sql", "utf8");
const publicOnboarding = readFileSync("src/routes/onboarding/$token.tsx", "utf8");
const rootAdmin = readFileSync("src/routes/admin.tsx", "utf8");
const studio = readFileSync("src/lib/menu/studio.tsx", "utf8");
const adminAccess = readFileSync("src/lib/menu/admin.ts", "utf8");

test("platform onboarding workspace exposes the owner workflow", () => {
  assert.match(rootAdmin, /admin\/onboarding/);
  assert.match(admin, /اعتماد وإنشاء رابط|اعتماد العملاء الجدد/);
  assert.match(admin, /اتصال/);
  assert.match(admin, /WhatsApp/);
  assert.match(admin, /فتح المنيو/);
  assert.match(admin, /نسخ الرابط/);
});

test("lead onboarding is server-authorized and token based", () => {
  assert.match(server, /requirePlatformAdmin/);
  assert.match(server, /createHash\("sha256"\)/);
  assert.match(server, /randomBytes\(32\)/);
  assert.match(server, /expires_at/);
  assert.match(server, /activateLeadOnboarding/);
  assert.match(server, /registrationUrl/);
  assert.match(server, /\/onboarding\/\$\{token\}/);
});

test("lead onboarding schema keeps the token secret and preserves the lead tenant link", () => {
  assert.match(migration, /token_hash text not null unique/);
  assert.match(migration, /lead_id text not null references leads/);
  assert.match(migration, /tenant_id text references tenants/);
  assert.match(migration, /revoked_at timestamptz/);
});

test("customer onboarding creates a restaurant workspace and menu URL", () => {
  assert.match(publicOnboarding, /authClient\.signUp\.email/);
  assert.match(publicOnboarding, /activateLeadOnboarding/);
  assert.match(publicOnboarding, /فتح الاستوديو/);
  assert.match(publicOnboarding, /QR للمنيو/);
});

test("platform owners leave studio for the dedicated admin workspace", () => {
  assert.match(adminAccess, /getPlatformAdminAccess/);
  assert.match(studio, /getPlatformAdminAccess/);
  assert.match(studio, /state\.isPlatformAdmin/);
  assert.match(studio, /Navigate to=\"\/admin\"/);
  assert.match(studio, /Navigate to=\"\/onboarding\"/);
});
