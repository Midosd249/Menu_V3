import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

const read = (path) => readFileSync(path, "utf8");
const publicServer = read("src/lib/menu/public.ts");
assert.match(publicServer, /resolveAnonymousSession\(sql, result\.data\.tenant\.id\)/);
const demo = read("src/lib/menu/demo.ts");
assert.match(demo, /nameEn: "Double Espresso"[\s\S]*imageUrl: "\/homepage\/menu-dish\.webp"/);
assert.match(demo, /nameEn: "Nafas Latte"[\s\S]*imageUrl: image\("photo-1572442388796-11668a67e53d"\)/);
const image = read("src/lib/menu/image.ts");
assert.match(image, /MAX_IMAGE_DATA_URL_LENGTH = 450_000/);
assert.match(image, /image\/webp/);
const owner = read("src/lib/menu/owner.ts");
assert.match(owner, /coverUrl: z\.string\(\)\.trim\(\)\.max\(450_000\)/);
assert.match(owner, /imageUrl: z\.string\(\)\.trim\(\)\.max\(450_000\)/);


test("homepage menu proof uses canonical bilingual demo data and stable image media", async () => {
  const home = await readFile("src/routes/index.tsx", "utf8");
  const styles = await readFile("src/routes/index.css", "utf8");
  assert.match(home, /DEMO_MENU\.tenant\.nameAr/);
  assert.match(home, /DEMO_MENU\.tenant\.nameEn/);
  assert.match(home, /DEMO_PREVIEW_PRODUCTS/);
  assert.match(styles, /\.menuq-live-product-image[\s\S]*aspect-ratio:\s*4 \/ 3[\s\S]*object-fit:\s*cover/);
  assert.doesNotMatch(home, /<strong>نَفَس<\/strong>/);
});


test("featured cards keep explicit title and price markup with theme-owned surfaces", async () => {
  const source = await readFile("src/components/public-menu.tsx", "utf8");
  const essential = await readFile("src/theme-essential.css", "utf8");
  const noir = await readFile("src/theme-noir-hardening.css", "utf8");
  assert.match(source, /menu-featured-card-copy/);
  assert.match(source, /menu-featured-card-title/);
  assert.match(source, /menu-featured-card-price/);
  assert.match(essential, /section:has\(> #featured-heading\)[\s\S]*menu-featured-card-title[\s\S]*menu-featured-card-price/);
  assert.match(noir, /section:has\(> #featured-heading\)[\s\S]*menu-featured-card-title[\s\S]*menu-featured-card-price/);
  assert.doesNotMatch(essential, /section:first-child:has\(> h2\.text-sm\)/);
  assert.doesNotMatch(noir, /section:first-child:has\(> h2\.text-sm\)/);
});
