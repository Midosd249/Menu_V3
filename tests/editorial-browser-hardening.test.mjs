import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Editorial browser hardening protects mobile geometry and mixed-direction values", async () => {
  const styles = await readFile("src/theme-editorial-hardening.css", "utf8");

  assert.match(styles, /editorial-hero[\s\S]*min-height:\s*min\(48dvh,\s*440px\)/);
  assert.match(styles, /editorial-hero[\s\S]*min-height:\s*min\(58dvh,\s*620px\)/);
  assert.match(styles, /editorial-featured-image[\s\S]*aspect-ratio:\s*4\s*\/\s*3\s*!important/);
  assert.match(styles, /editorial-product-image[\s\S]*height:\s*auto\s*!important/);
  assert.match(styles, /editorial-product-image[\s\S]*min-height:\s*0\s*!important/);
  assert.match(styles, /editorial-product-topline[\s\S]*grid-template-columns:\s*auto\s+minmax\(0,\s*1fr\)/);
  assert.match(styles, /editorial-product-price[\s\S]*unicode-bidi:\s*isolate/);
  assert.match(styles, /editorial-main[\s\S]*safe-area-inset-bottom/);
});

test("Editorial product cards reject legacy oversized mobile heights", async () => {
  const styles = await readFile("src/theme-editorial-hardening.css", "utf8");

  assert.match(styles, /editorial-product-card[\s\S]*min-height:\s*0\s*!important/);
  assert.match(styles, /editorial-product-card[\s\S]*grid-template-columns:\s*minmax\(7\.25rem,\s*34%\)\s+minmax\(0,\s*1fr\)/);
  assert.match(styles, /editorial-product-card[\s\S]*gap:\s*0\.85rem/);
  assert.match(styles, /editorial-product-card[\s\S]*transform:\s*none\s*!important/);
  assert.match(styles, /editorial-featured-card\.is-lead[\s\S]*aspect-ratio:\s*4\s*\/\s*3\s*!important/);
});

test("Editorial omits unknown opening status instead of inventing a state", async () => {
  const source = await readFile("src/components/templates/contemporary-restaurant.tsx", "utf8");

  assert.match(source, /if \(!h \|\| h\.isClosed\) return h\?\.isClosed \? false : null/);
  assert.match(source, /if \(!h\.opensAt \|\| !h\.closesAt\) return null/);
  assert.match(source, /status !== null \? <><span>/);
  assert.doesNotMatch(source, /status == null \? text\(lang, "ساعات العمل", "Opening hours"\)/);
});

test("Editorial hardening is loaded after the final Editorial theme stylesheet", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");
  assert.match(source, /import editorialThemeCss from "\.\.\/theme-editorial\.css\?url"/);
  assert.match(source, /import editorialHardeningCss from "\.\.\/theme-editorial-hardening\.css\?url"/);
  assert.match(source, /href: editorialThemeCss \},\s*\{ rel: "stylesheet", href: editorialHardeningCss \}/);
});
