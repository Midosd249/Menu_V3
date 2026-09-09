import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const platform = await readFile(new URL("../src/lib/menu/platform.ts", import.meta.url), "utf8");
const admin = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");
const orders = await readFile(new URL("../src/lib/menu/orders.ts", import.meta.url), "utf8");
const migration = await readFile(new URL("../migrations/20260909001000_order_archive_operations.sql", import.meta.url), "utf8");

test("platform admin exposes scoped order operations", () => {
  assert.match(platform, /requirePlatformAdmin\(userId\)/);
  assert.match(platform, /export const getPlatformOrders/);
  assert.match(platform, /export const updatePlatformOrderStatus/);
  assert.match(platform, /export const archivePlatformOrder/);
  assert.match(platform, /o\.archived_at is null/);
});

test("platform admin UI provides customer contact and safe archive controls", () => {
  assert.match(admin, /label: "الطلبات"/);
  assert.match(admin, /اتصال/);
  assert.match(admin, /WhatsApp/);
  assert.match(admin, /mailto:/);
  assert.match(admin, /إزالة من لوحة التشغيل/);
  assert.match(admin, /أرشفة آمنة/);
});

test("owner operations do not surface archived orders", () => {
  assert.match(orders, /where o\.archived_at is null/);
  assert.match(orders, /o\.archived_at is null and o\.status = 'new'/);
});

test("order archive is reversible soft-delete at the data layer", () => {
  assert.match(migration, /add column if not exists archived_at timestamptz/);
  assert.match(migration, /where archived_at is null/);
  assert.doesNotMatch(migration, /drop table|delete from/i);
});
