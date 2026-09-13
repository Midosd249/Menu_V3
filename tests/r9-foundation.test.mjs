import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const migration = fs.readFileSync(path.join(root, "migrations/20260913020000_guest_intelligence_foundation.sql"), "utf8");
const server = fs.readFileSync(path.join(root, "src/lib/menu/retention-intelligence.ts"), "utf8");

assert.match(migration, /create table if not exists guest_profiles/i);
assert.match(migration, /identity_hash/i);
assert.match(migration, /consent_status/i);
assert.match(migration, /guest_profile_id/i);
assert.match(migration, /sync_guest_profile_from_order/i);
assert.match(server, /getRetentionOverview/);
assert.match(server, /status <> 'cancelled'/);
assert.match(server, /repeatOrderRate/);
assert.match(server, /evidence: totalOrders >= 20/);

console.log("R9 foundation checks passed.");
