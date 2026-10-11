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
test("public menu content no longer initializes anonymous sessions during SSR", () => {
  const attributionStart = publicServer.indexOf("export const getPublicMenuAttribution");
  assert.ok(attributionStart > 0);
  const publicHandler = publicServer.slice(publicServer.indexOf("export const getPublicMenu"), attributionStart);
  assert.doesNotMatch(publicHandler, /resolveAnonymousSession/);
  assert.match(publicServer.slice(attributionStart), /createServerFn\(\{ method: "POST" \}\)/);
  assert.match(publicServer.slice(attributionStart), /resolveAnonymousSession/);
  assert.match(publicServer.slice(attributionStart), /Cache-Control", "private, no-store"/);
});
const demo = read("src/lib/menu/demo.ts");
assert.match(demo, /const DEMO_TENANT_ID = "demo-nafas"/);
assert.match(demo, /nameEn:"Flat White"[\s\S]*imageUrl:"https:\/\/images\.unsplash\.com\/photo-1727080409436/);
assert.match(demo, /nameEn:"Zaatar manakish"[\s\S]*imageUrl:"https:\/\/as2\.ftcdn\.net\/jpg\/17\/59\/31\/01/);
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
  assert.match(home, /visibleDemoProducts/);
  assert.match(home, /DEMO_MENU\.products[\s\S]*?\.slice\(0, 4\)/);
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
});
