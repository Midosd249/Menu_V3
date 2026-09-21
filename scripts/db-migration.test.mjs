import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DB = readFileSync(join(ROOT, "src/lib/db.ts"), "utf8");

test("PGlite records menu_v3 schema migrations without executing them", () => {
  assert.match(DB, /export function isPgliteIncompatibleMigration\(sql: string\): boolean/);
  assert.match(DB, /if \(isPgliteIncompatibleMigration\(sql\)\)/);
  assert.match(DB, /insert into _migrations \(name\) values \(\$1\)/);
});
