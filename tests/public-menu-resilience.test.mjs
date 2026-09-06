import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("shared menu media falls back when an image request fails", async () => {
  const source = await readFile("src/components/menu/primitives.tsx", "utf8");
  assert.match(source, /useState/);
  assert.match(source, /if \(!src \|\| failed\)/);
  assert.match(source, /onError=\{\(\) => setFailed\(true\)\}/);
});

test("public menu does not present an hours label when no schedule exists", async () => {
  const source = await readFile("src/components/public-menu.tsx", "utf8");
  assert.match(source, /\{hours\.length \? <section[\s\S]*Opening hours/);
  assert.match(source, /const status = openNow\(hours\)/);
  assert.match(source, /status == null/);
});
