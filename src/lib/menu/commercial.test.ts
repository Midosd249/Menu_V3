import test from "node:test";
import assert from "node:assert/strict";
import { COMMERCIAL_FEATURES, COMMERCIAL_PLANS } from "./commercial-catalog.ts";

test("commercial plans mirror the verified subscription catalog", () => {
  assert.deepEqual(
    COMMERCIAL_PLANS.map((plan) => [plan.code, plan.monthlyPriceSar, plan.maxBranches, plan.maxProducts, plan.maxTeamMembers]),
    [
      ["free", 0, 1, 50, 3],
      ["starter", 99, 3, 300, 10],
      ["pro", 199, 10, 1000, 25],
    ],
  );
});

test("commercial catalog has one recommended plan and bilingual copy", () => {
  assert.equal(COMMERCIAL_PLANS.filter((plan) => plan.recommended).length, 1);
  assert.deepEqual(COMMERCIAL_PLANS.map((plan) => plan.code), ["free", "starter", "pro"]);
  assert.equal(COMMERCIAL_FEATURES.ar.length, COMMERCIAL_FEATURES.en.length);
  assert.ok(COMMERCIAL_FEATURES.ar.length >= 5);
});

test("commercial plan limits are positive and monotonic", () => {
  for (const resource of ["maxBranches", "maxProducts", "maxTeamMembers"] as const) {
    assert.ok(COMMERCIAL_PLANS.every((plan) => plan[resource] > 0));
    assert.deepEqual(COMMERCIAL_PLANS.map((plan) => plan[resource]), [...COMMERCIAL_PLANS.map((plan) => plan[resource])].sort((a, b) => a - b));
  }
});
