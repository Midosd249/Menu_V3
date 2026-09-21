import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATION = readFileSync(
  join(ROOT, "migrations/0007_menu_v3_theme_engine_schema_fix.sql"),
  "utf8",
);

test("theme schema repair is skipped when the menu_v3 schema is absent", () => {
  assert.match(MIGRATION, /if to_regnamespace\('menu_v3'\) is not null then/);
  assert.match(MIGRATION, /execute \$migration\$/);
  assert.match(MIGRATION, /alter table menu_v3\.tenants/);
});
