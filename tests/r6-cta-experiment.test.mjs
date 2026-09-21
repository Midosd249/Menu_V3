import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const publicSource = fs.readFileSync("src/lib/menu/public.ts", "utf8");
const actionSource = fs.readFileSync("src/components/public-action-links.tsx", "utf8");
const migration = fs.readFileSync("migrations/20260912001000_experiment_variant_tracking.sql", "utf8");

test("R6 uses the canonical public event recorder", () => {
  assert.match(publicSource, /insert into menu_events/);
  assert.match(publicSource, /ACTIVE_EXPERIMENT/);
  assert.match(publicSource, /getExperimentVariant\(data\.sessionId\)/);
  assert.match(publicSource, /tenants where slug = \$\{data\.slug\}/);
});

test("R6 treatment is limited to the existing WhatsApp action", () => {
  assert.match(actionSource, /action\.key === "whatsapp"/);
  assert.match(actionSource, /experimentVariant === "prominent"/);
  assert.match(actionSource, /font-semibold shadow-sm/);
  assert.doesNotMatch(actionSource, /fetch\(|axios|navigator\.sendBeacon/);
});

test("R6 migration preserves legacy events and validates variants", () => {
  assert.match(migration, /add column if not exists experiment_key/);
  assert.match(migration, /add column if not exists experiment_variant/);
  assert.match(migration, /experiment_variant is null or experiment_variant in/);
  assert.match(migration, /menu_events_experiment_idx/);
});
