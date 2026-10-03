import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const owner = fs.readFileSync("src/lib/menu/owner.ts", "utf8");
const ownerAnalytics = owner.slice(owner.indexOf("export const getOwnerAnalytics"), owner.indexOf("export const seedStarterItems", owner.indexOf("export const getOwnerAnalytics")));

const orderValue = fs.readFileSync("src/lib/menu/order-value-analytics.ts", "utf8");
const tenantsFn = orderValue.slice(
  orderValue.indexOf("export const getOwnerOrderValueAnalyticsTenants"),
  orderValue.indexOf("export const getOwnerOrderValueAnalytics ="),
);

test("P1.6 OwnerAnalytics uses one server-side database boundary", () => {
  const sqlCalls = ownerAnalytics.match(/await sql/g) ?? [];
  assert.equal(sqlCalls.length, 1, "OwnerAnalytics should use one authorized SQL boundary");
  assert.match(ownerAnalytics, /WITH scoped AS MATERIALIZED/);
  assert.match(ownerAnalytics, /jsonb_agg/);
  assert.match(ownerAnalytics, /tenant_id = \$\{member\.tenant_id\}/);
});

test("P1.6 analytics tenant discovery is set-based and avoids per-tenant membership/branch queries", () => {
  assert.doesNotMatch(tenantsFn, /for \(const tenant of tenantRows\)/);
  assert.doesNotMatch(tenantsFn, /getMembership\(sql, context\.userId, String\(tenant\.id\)\)/);
  assert.doesNotMatch(tenantsFn, /await sql[\\s\\S]{0,800}branches/);
  assert.match(tenantsFn, /analytics\.read/);
});

test("P1.6 does not introduce application caching for personalized analytics", () => {
  assert.doesNotMatch(ownerAnalytics, /Cache-Control/);
  assert.doesNotMatch(orderValue.slice(0, orderValue.indexOf("export const getOwnerOrderValueAnalyticsTenants")), /Cache-Control/);
});
