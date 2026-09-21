import assert from "node:assert/strict";
import test from "node:test";
import { buildPaymentCheckoutRequest } from "./payment-boundary.ts";

test("payment boundary derives the amount from the canonical annual catalog", () => {
  assert.deepEqual(buildPaymentCheckoutRequest({ planCode: "pro", billingInterval: "annual" }), {
    planCode: "pro",
    billingInterval: "annual",
    amountSar: 1490,
    currency: "SAR",
  });
});

test("payment boundary rejects the free plan", () => {
  assert.throws(() => buildPaymentCheckoutRequest({ planCode: "free", billingInterval: "monthly" }), /PAYMENT_NOT_REQUIRED/);
});
