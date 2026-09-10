import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const recovery = readFileSync("src/lib/menu/onboarding-recovery.ts", "utf8");
const onboarding = readFileSync("src/routes/onboarding.tsx", "utf8");

test("onboarding recovery is server-authorized and repairs orphaned ownership", () => {
  assert.match(recovery, /authMiddleware/);
  assert.match(recovery, /owner_user_id = \$\{context\.userId\}/);
  assert.match(recovery, /access_role = 'tenant_owner'/);
  assert.match(recovery, /is_active = true/);
  assert.match(recovery, /on conflict \(tenant_id, user_id\) do update/);
});

test("onboarding retries once after recovering a previously-created tenant", () => {
  assert.match(onboarding, /ensureOwnerMembership/);
  assert.match(onboarding, /let created = await createRestaurant/);
  assert.match(onboarding, /created = await createRestaurant/);
  assert.match(onboarding, /repaired\.data\.repaired/);
});

test("onboarding uses business-neutral wording", () => {
  assert.match(onboarding, /جهّز منيو منشأتك/);
  assert.match(onboarding, /اسم المنشأة بالعربية/);
  assert.match(onboarding, /Business name in Arabic/);
});
