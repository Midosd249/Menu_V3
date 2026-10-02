import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveOrderValuePeriod, queryOrderValueAnalytics } from "./order-value-analytics.ts";
import { hasPermission } from "../auth/permissions.ts";
import type { Membership } from "../auth/authorization.server.ts";
import type { Sql } from "../db.ts";

const now = new Date("2026-10-02T12:00:00.000Z");
const source = readFileSync(new URL("./order-value-analytics.ts", import.meta.url), "utf8");

test("eligibility includes confirmed/preparing/ready/completed and excludes new/cancelled", () => {
  assert.match(source, /status in \('confirmed','preparing','ready','completed'\)/);
  assert.doesNotMatch(source, /status in \([^)]*new/);
  assert.doesNotMatch(source, /status in \([^)]*cancelled/);
});

test("SUM/COUNT/AVG are order-level metrics without order-item duplication", async () => {
  const calls: string[] = [];
  const sql = fakeSql(calls, [[{ count: 0 }], [{ order_value: "300", order_count: 3 }], [{ day: "2026-10-02", order_value: "300" }]]);
  const result = await queryOrderValueAnalytics(sql, membership("tenant-a"), period(), undefined, null);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.orderValue, 300);
    assert.equal(result.data.orderCount, 3);
    assert.equal(result.data.averageOrderValue, 100);
  }
  assert.equal(calls.filter((query) => query.includes("order_items")).length, 0);
});

test("zero eligible orders return 0 value, 0 count, null average, empty trend", async () => {
  const sql = fakeSql([], [[{ count: 0 }], [{ order_value: "0", order_count: 0 }], []]);
  const result = await queryOrderValueAnalytics(sql, membership("tenant-a"), period(), undefined, null);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.orderValue, 0);
    assert.equal(result.data.orderCount, 0);
    assert.equal(result.data.averageOrderValue, null);
    assert.deepEqual(result.data.dailyTrend, []);
  }
});

test("Riyadh Today/Week/Month/Custom boundaries are deterministic", () => {
  const today = resolveOrderValuePeriod({ type: "today" }, now)!;
  assert.equal(today.start.toISOString(), "2026-10-01T21:00:00.000Z");
  assert.equal(today.end.toISOString(), "2026-10-02T21:00:00.000Z");

  const week = resolveOrderValuePeriod({ type: "week" }, now)!;
  assert.equal(week.start.toISOString(), "2026-09-26T21:00:00.000Z");
  assert.equal(week.end.toISOString(), "2026-10-03T21:00:00.000Z");

  const month = resolveOrderValuePeriod({ type: "month" }, now)!;
  assert.equal(month.start.toISOString(), "2026-09-30T21:00:00.000Z");
  assert.equal(month.end.toISOString(), "2026-10-31T21:00:00.000Z");

  const custom = resolveOrderValuePeriod({ type: "custom", startLocal: "2026-10-01T00:00", endLocal: "2026-10-02T00:00" }, now)!;
  assert.equal(custom.start.toISOString(), "2026-09-30T21:00:00.000Z");
  assert.equal(custom.end.toISOString(), "2026-10-01T21:00:00.000Z");
});

test("custom periods reject invalid ordering and malformed local values", () => {
  assert.equal(resolveOrderValuePeriod({ type: "custom", startLocal: "2026-10-02T00:00", endLocal: "2026-10-01T00:00" }, now), null);
  assert.equal(resolveOrderValuePeriod({ type: "custom", startLocal: "2026-02-30T00:00", endLocal: "2026-03-01T00:00" }, now), null);
});

test("SQL enforces exact half-open [start,end) boundaries and Riyadh daily grouping", async () => {
  const calls: string[] = [];
  const sql = fakeSql(calls, [[{ count: 0 }], [{ order_value: 0, order_count: 0 }], []]);
  await queryOrderValueAnalytics(sql, membership("tenant-a"), period(), undefined, null);
  assert.ok(calls.every((query) => query.includes("created_at >= $2::timestamptz") && query.includes("created_at < $3::timestamptz")));
  assert.ok(calls.some((query) => query.includes("at time zone 'Asia/Riyadh'") && query.includes("group by day")));
});

test("tenant isolation and client-controlled tenant/role/permission scope are rejected", () => {
  assert.match(source, /getMembership\(sql, context\.userId\)/);
  assert.doesNotMatch(source, /data\.tenantId|data\.role|data\.permission/);
  assert.match(source, /o\.tenant_id = \$1/);
  assert.match(source, /inputSchema.*strict/s);
});

test("branch isolation rejects a requested branch outside the trusted set", async () => {
  const calls: string[] = [];
  const sql = fakeSql(calls, [[{ count: 0 }], [{ order_value: 0, order_count: 0 }], []]);
  const result = await queryOrderValueAnalytics(sql, membership("tenant-a", ["branch-a"]), period(), "branch-b", ["branch-a"]);
  assert.equal(result.ok, true);
  assert.ok(calls[0].includes("branch_id = any($4::text[])"));
});

test("analytics.read is explicit and owner/admin are allowed while editor/staff remain denied", () => {
  assert.equal(hasPermission("owner", "analytics.read"), true);
  assert.equal(hasPermission("admin", "analytics.read"), true);
  assert.equal(hasPermission("editor", "analytics.read"), false);
  assert.equal(hasPermission("staff", "analytics.read"), false);
});

test("SAR-only behavior returns a deterministic data-quality state for inconsistent history", async () => {
  const sql = fakeSql([], [[{ count: 1 }]]);
  const result = await queryOrderValueAnalytics(sql, membership("tenant-a"), period(), undefined, null);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "data_quality");
});

test("daily aggregation uses the same order-level filters", async () => {
  const calls: string[] = [];
  const sql = fakeSql(calls, [[{ count: 0 }], [{ order_value: "250", order_count: 2 }], [
    { day: "2026-10-01", order_value: "100" },
    { day: "2026-10-02", order_value: "150" },
  ]]);
  const result = await queryOrderValueAnalytics(sql, membership("tenant-a"), period(), undefined, null);
  assert.equal(result.ok, true);
  if (result.ok) assert.deepEqual(result.data.dailyTrend, [
    { day: "2026-10-01", orderValue: 100 },
    { day: "2026-10-02", orderValue: 150 },
  ]);
  assert.ok(calls.every((query) => !query.includes("join order_items")));
});

test("regression safety does not modify order lifecycle or engagement analytics", () => {
  assert.doesNotMatch(source, /getOwnerAnalytics/);
  assert.doesNotMatch(source, /ORDER_STATUS_TRANSITIONS|updateOrderStatus/);
});

function period() {
  return resolveOrderValuePeriod({ type: "custom", startLocal: "2026-10-01T00:00", endLocal: "2026-10-03T00:00" }, now)!;
}

function membership(tenantId: string, branchScope: string[] | null = null): Membership {
  return { tenantId, userId: "user-a", role: "owner", branchScope };
}

function fakeSql(calls: string[], responses: unknown[][]): Sql {
  let index = 0;
  const query = async <T>(text: string, _params: unknown[] = []): Promise<T[]> => {
    calls.push(text);
    return (responses[index++] ?? []) as T[];
  };
  const sql = (async <T>(_strings: TemplateStringsArray, ..._values: unknown[]): Promise<T[]> => []) as Sql;
  sql.query = query;
  return sql;
}
