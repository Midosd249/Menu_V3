import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Editorial Canvas protects mobile geometry and mixed-direction values", async () => {
  const styles = await readFile("src/theme-editorial-canvas.css", "utf8");
  assert.match(styles, /editorial-hero[\s\S]*min-height:\s*clamp\\(30rem, 72dvh, 47rem\\)/);
  assert.match(styles, /editorial-featured-image[\s\S]*aspect-ratio:4 \/ 3/);
  assert.match(styles, /editorial-product-image[\s\S]*min-height:\s*0/);
  assert.match(styles, /editorial-product-topline[\s\S]*grid-template-columns:\s*auto\s+minmax\\(0, 1fr\\)\s+auto/);
  assert.match(styles, /editorial-product-price[\s\S]*unicode-bidi:isolate/);
  assert.match(styles, /editorial-main[\s\S]*safe-area-inset-bottom/);
});

test("Editorial Canvas product cards reject legacy oversized mobile geometry", async () => {
  const styles = await readFile("src/theme-editorial-canvas.css", "utf8");
  assert.match(styles, /editorial-product-card[\s\S]*min-height:0/);
  assert.match(styles, /editorial-product-card[\s\S]*grid-template-columns:\s*minmax\\(7\\.25rem, 23%\\)\s+minmax\\(0, 1fr\\)/);
  assert.match(styles, /editorial-product-card[\s\S]*transform:none !important/);
  assert.match(styles, /editorial-featured-card[\s\S]*transform:none !important/);
});

test("Editorial omits unknown opening status instead of inventing a state", async () => {
  const source = await readFile("src/components/templates/contemporary-restaurant.tsx", "utf8");
  assert.match(source, /if \(!h \|\| h\.isClosed\) return h\?\.isClosed \? false : null/);
  assert.match(source, /if \(!h\.opensAt \|\| !h\.closesAt\) return null/);
  assert.match(source, /status !== null \? <><span>/);
  assert.doesNotMatch(source, /status == null \? text\(lang, "ساعات العمل", "Opening hours"\)/);
});

test("Editorial Canvas is the only Editorial stylesheet loaded by the root", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");
  assert.match(source, /import editorialCanvasCss from "\.\.\/theme-editorial-canvas\.css\?url"/);
  assert.doesNotMatch(source, /theme-editorial-atelier\.css\?url/);
  assert.doesNotMatch(source, /theme-editorial\.css\?url/);
  assert.match(source, /href: editorialCanvasCss/);
});

test("Editorial Canvas keeps semantic topbar, footer, search, and cart entry points", async () => {
  const source = await readFile("src/components/templates/contemporary-restaurant.tsx", "utf8");
  assert.match(source, /className="editorial-topbar"/);
  assert.match(source, /className="editorial-topbar-cart"/);
  assert.match(source, /id="editorial-search-input"/);
  assert.match(source, /className="editorial-footer"/);
  assert.match(source, /className="editorial-cart-trigger"/);
});
