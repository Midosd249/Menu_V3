import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const admin = readFileSync("src/routes/admin/onboarding.tsx", "utf8");
const server = readFileSync("src/lib/menu/platform-onboarding.ts", "utf8");
const migration = readFileSync("migrations/20260909230000_lead_onboarding.sql", "utf8");
const publicOnboarding = readFileSync("src/routes/onboarding/$token.tsx", "utf8");
const rootAdmin = readFileSync("src/routes/admin.tsx", "utf8");

test("platform onboarding workspace exposes the owner workflow", () => {
  assert.match(rootAdmin, /admin\/onboarding/);
  assert.match(admin, /اعتماد وإنشاء رابط|اعتماد العملاء الجدد/);
  assert.match(admin, /اتصال/);
  assert.match(admin, /WhatsApp/);
  assert.match(admin, /رابط التسجيل/);
  assert.match(admin, /QR/);
});

test("lead onboarding is server-authorized and token based", () => {
  assert.match(server, /requirePlatformAdmin/);
  assert.match(server, /createHash\("sha256"\)/);
  assert.match(server, /randomBytes\(32\)/);
  assert.match(server, /expires_at/);
  assert.match(server, /activateLeadOnboarding/);
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
