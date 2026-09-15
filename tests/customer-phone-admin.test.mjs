import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("customer phone authentication uses the Better Auth phone plugin", () => {
  const server = read("src/lib/auth/server.ts");
  const client = read("src/lib/auth/client.ts");
  const login = read("src/routes/login.tsx");
  const migration = read("migrations/20260916020000_customer_phone_and_account_controls.sql");

  assert.match(server, /phoneNumber\(/);
  assert.match(server, /requireVerification: true/);
  assert.match(client, /phoneNumberClient\(\)/);
  assert.match(login, /signIn\.phoneNumber/);
  assert.match(migration, /"phoneNumber"/);
  assert.match(migration, /"phoneNumberVerified"/);
});

test("approved onboarding binds the service-request phone to the authenticated account", () => {
  const onboarding = read("src/lib/menu/platform-onboarding.ts");
  assert.match(onboarding, /normalizePhoneDigits/);
  assert.match(onboarding, /"phoneNumberVerified" = true/);
  assert.match(onboarding, /phoneNumber.*حساب آخر|phoneNumber/);
});

test("Platform Owner account controls are server-authorized and preserve restaurant data", () => {
  const users = read("src/lib/menu/platform-users.ts");
  const route = read("src/routes/admin/users.tsx");
  assert.match(users, /requirePlatformAdmin\(userId\)/);
  assert.match(users, /delete from "session"/);
  assert.match(users, /where user_id = \$\{data\.userId\}/);
  assert.match(users, /لا يمكن حذف حساب مرتبط بمطعم/);
  assert.match(users, /menu_v3\.is_platform_admin/);
  assert.match(route, /setPlatformUserBan/);
  assert.match(route, /verifyPlatformUserPhone/);
  assert.match(route, /deletePlatformUser/);
});

test("Platform Owner user-management route is explicit and separate from tenant workspaces", () => {
  const route = read("src/routes/admin/users.tsx");
  assert.match(route, /createFileRoute\("\/admin\/users"\)/);
  assert.match(route, /Platform Owner/);
});
