import test from "node:test";
import assert from "node:assert/strict";
import { COMMERCIAL_FEATURES, COMMERCIAL_PLANS, getAnnualDiscountPercent, getCommercialPrice } from "./commercial-catalog.ts";

test("commercial plans mirror the approved monthly and annual catalog", () => {
  assert.deepEqual(
    COMMERCIAL_PLANS.map((plan) => [plan.code, plan.monthlyPriceSar, plan.annualPriceSar, plan.maxBranches, plan.maxProducts, plan.maxTeamMembers]),
    [
      ["free", 0, 0, 1, 50, 3],
      ["starter", 49, 490, 3, 300, 10],
      ["pro", 149, 1490, 10, null, 25],
    ],
  );
});

test("annual pricing saves two monthly payments on paid plans", () => {
  assert.equal(getAnnualDiscountPercent(COMMERCIAL_PLANS[1]), 16.67);
  assert.equal(getAnnualDiscountPercent(COMMERCIAL_PLANS[2]), 16.67);
  assert.equal(getCommercialPrice(COMMERCIAL_PLANS[1], "monthly"), 49);
  assert.equal(getCommercialPrice(COMMERCIAL_PLANS[1], "annual"), 490);
  assert.equal(getCommercialPrice(COMMERCIAL_PLANS[2], "annual"), 1490);
});

test("commercial catalog has one recommended plan and bilingual copy", () => {
  assert.equal(COMMERCIAL_PLANS.filter((plan) => plan.recommended).length, 1);
  assert.deepEqual(COMMERCIAL_PLANS.map((plan) => plan.code), ["free", "starter", "pro"]);
  assert.equal(COMMERCIAL_FEATURES.ar.length, COMMERCIAL_FEATURES.en.length);
  assert.ok(COMMERCIAL_FEATURES.ar.length >= 5);
});

test("commercial plan limits are ordered and Pro products are explicitly unlimited", () => {
  assert.deepEqual(COMMERCIAL_PLANS.map((plan) => plan.maxBranches), [1, 3, 10]);
  assert.deepEqual(COMMERCIAL_PLANS.map((plan) => plan.maxTeamMembers), [3, 10, 25]);
  assert.deepEqual(COMMERCIAL_PLANS.map((plan) => plan.maxProducts), [50, 300, null]);
});
