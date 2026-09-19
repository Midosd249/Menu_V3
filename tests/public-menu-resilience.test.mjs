import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("shared menu media falls back when an image request fails", async () => {
  const source = await readFile("src/components/menu/primitives.tsx", "utf8");
  assert.match(source, /useState/);
  assert.match(source, /if \(!src \|\| failed\)/);
  assert.match(source, /onError=\{\(\) => setFailed\(true\)\}/);
});

test("public menu hides the hours status chip when no schedule exists", async () => {
  const source = await readFile("src/components/public-menu.tsx", "utf8");
  assert.match(source, /\{hours\.length \? <span[\s\S]*Open now/);
  assert.doesNotMatch(source, /status == null \? label\(lang, "ساعات العمل", "Opening hours"\)/);
  assert.match(source, /\{hours\.length \? <section[\s\S]*Opening hours/);
});

const publicServer = read("src/lib/menu/public.ts");
assert.match(publicServer, /resolveAnonymousSession\(sql, result\.data\.tenant\.id\)/);
const demo = read("src/lib/menu/demo.ts");
assert.match(demo, /nameEn: "Double Espresso"[\\s\\S]*imageUrl: "\/homepage\/menu-dish\\.webp"/);
const image = read("src/lib/menu/image.ts");
assert.match(image, /MAX_IMAGE_DATA_URL_LENGTH = 450_000/);
assert.match(image, /image\/webp/);
const owner = read("src/lib/menu/owner.ts");
assert.match(owner, /coverUrl: z\.string\(\)\.trim\(\)\.max\(450_000\)/);
assert.match(owner, /imageUrl: z\.string\(\)\.trim\(\)\.max\(450_000\)/);
