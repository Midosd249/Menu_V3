import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(new URL("../../migrations/20260913010000_upsell_recommendations.sql", import.meta.url), "utf8");
const source = readFileSync(new URL("./upsell.ts", import.meta.url), "utf8");

test("R8.4 migration preserves tenant/branch scoped approval and observational events", () => {
  assert.match(migration, /create table if not exists menu_upsell_recommendations/);
  assert.match(migration, /branch_id text not null references branches/);
  assert.match(migration, /unique \(tenant_id, branch_id, source_product_id, recommended_product_id\)/);
  assert.match(migration, /upsell_impression/);
  assert.match(migration, /upsell_click/);
});

test("R8.4 server contract contains independent co-view, co-cart and completed-order evidence", () => {
  assert.match(source, /event_type = 'product_view'/);
  assert.match(source, /status <> 'cancelled'/);
  assert.match(source, /status = 'completed'/);
  assert.match(source, /menu_upsell_recommendations/);
  assert.match(source, /approved_by/);
});
