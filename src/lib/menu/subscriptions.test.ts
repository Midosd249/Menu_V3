import test from "node:test";
import assert from "node:assert/strict";
import { PlanLimitError, assertLimit } from "./subscriptions";

test("plan limit accepts a resource below its cap", () => {
  assert.doesNotThrow(() => assertLimit(2, 3, "branches"));
});

test("plan limit rejects a resource at its cap", () => {
  assert.throws(
    () => assertLimit(3, 3, "branches"),
    (error: unknown) => error instanceof PlanLimitError && error.resource === "branches" && error.current === 3 && error.max === 3,
  );
});

test("plan limit rejects an over-limit resource", () => {
  assert.throws(() => assertLimit(51, 50, "products"), /PLAN_LIMIT:products:51:50/);
});

test("plan limit validates numeric inputs", () => {
  assert.throws(() => assertLimit(Number.NaN, 50, "products"), /INVALID_PLAN_LIMIT/);
  assert.throws(() => assertLimit(0, Number.POSITIVE_INFINITY, "products"), /INVALID_PLAN_LIMIT/);
});
