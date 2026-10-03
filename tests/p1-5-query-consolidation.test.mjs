import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const orders = await readFile(new URL("../src/lib/menu/orders.ts", import.meta.url), "utf8");
const platform = await readFile(new URL("../src/lib/menu/platform.ts", import.meta.url), "utf8");

test("P1.5 orders dashboard aggregates order items once for the bounded page", () => {
  const source = orders.slice(orders.indexOf("export const getOrdersDashboard"));
  assert.match(source, /page_orders as \(/);
  assert.match(source, /item_agg as \(/);
  assert.match(source, /join page_orders p on p\.id = oi\.order_id/);
  assert.match(source, /group by oi\.order_id/);
  assert.match(source, /limit 100/);
  assert.doesNotMatch(source, /select count\(\*\) from order_items oi where oi\.order_id = o\.id/);
  assert.doesNotMatch(source, /from order_items oi where oi\.order_id = o\.id\), '\[\]'::jsonb/);
});

test("P1.5 platform orders aggregates order items once for the bounded page", () => {
  const source = platform.slice(platform.indexOf("export const getPlatformOrders"));
  assert.match(source, /page_orders as \(/);
  assert.match(source, /item_agg as \(/);
  assert.match(source, /join page_orders p on p\.id = oi\.order_id/);
  assert.match(source, /group by oi\.order_id/);
  assert.match(source, /limit 200/);
  assert.doesNotMatch(source, /select count\(\*\) from order_items oi where oi\.order_id = o\.id/);
  assert.doesNotMatch(source, /from order_items oi where oi\.order_id = o\.id\), '\[\]'::jsonb/);
});

test("P1.5 platform dashboard removes per-tenant correlated count subqueries", () => {
  const source = platform.slice(platform.indexOf("export const getPlatformDashboard"), platform.indexOf("export const getPlatformCustomerNotifications"));
  assert.match(source, /branch_counts as \(/);
  assert.match(source, /product_counts as \(/);
  assert.match(source, /order_counts as \(/);
  assert.match(source, /member_counts as \(/);
  assert.match(source, /plan_codes as \(/);
  assert.match(source, /left join branch_counts/);
  assert.match(source, /left join product_counts/);
  assert.match(source, /left join order_counts/);
  assert.match(source, /left join member_counts/);
  assert.match(source, /left join plan_codes/);
  assert.doesNotMatch(source, /select count\(\*\)::int from branches b where b\.tenant_id = t\.id/);
  assert.doesNotMatch(source, /select count\(\*\)::int from products p where p\.tenant_id = t\.id/);
  assert.doesNotMatch(source, /select count\(\*\)::int from orders o where o\.tenant_id = t\.id/);
  assert.doesNotMatch(source, /select count\(\*\)::int from tenant_members tm where tm\.tenant_id = t\.id/);
});
