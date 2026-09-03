import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT = readFileSync(join(ROOT, "scripts/ensure-pglite-asset.mjs"), "utf8");

test("PGlite asset installer places runtime files at the Vercel function root", () => {
  assert.match(SCRIPT, /const serverFunction = join\(root, "\.vercel", "output", "functions", "__server\.func"\);/);
  assert.match(SCRIPT, /const functionTarget = join\(serverFunction, targetName\);/);
  assert.match(SCRIPT, /copyFileSync\(source, functionTarget\);/);
});
