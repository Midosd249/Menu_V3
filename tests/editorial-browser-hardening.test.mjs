import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("SIGNAL TABLE protects mobile geometry and mixed-direction values", async () => {
  const styles = await readFile("src/theme-signal-table.css", "utf8");
  assert.match(styles, /signal-hero[\s\S]*grid-template-columns:/);
  assert.match(styles, /signal-featured-stage-image[\s\S]*aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(styles, /signal-product-image[\s\S]*aspect-ratio:\s*1 \/ 0\.78/);
  assert.match(styles, /signal-product-topline[\s\S]*grid-template-columns:\s*minmax\(0,1fr\) auto/);
  assert.match(styles, /signal-product-price[\s\S]*unicode-bidi:\s*isolate/);
  assert.match(styles, /signal-main[\s\S]*safe-area-inset-bottom/);
});

test("SIGNAL TABLE contains no product or category numbering", async () => {
  const source = await readFile("src/components/templates/signal-table.tsx", "utf8");
  const styles = await readFile("src/theme-signal-table.css", "utf8");
  for (const value of [source, styles]) {
    assert.doesNotMatch(value, /signal-(card-index|product-number)/);
    assert.doesNotMatch(value, /counter-(reset|increment)/);
    assert.doesNotMatch(value, /VOL\.\s*03|ISSUE\s*\/\s*03|N\s*\/\s*03/);
  }
});

test("SIGNAL TABLE owns the direct public menu route for the contemporary restaurant family", async () => {
  const route = await readFile("src/routes/m.$slug.tsx", "utf8");
  assert.match(route, /import \{ SignalTableTemplate \} from "@\/components\/templates\/signal-table"/);
  assert.match(route, /family === "contemporary-restaurant" \? <SignalTableTemplate/);
  assert.doesNotMatch(route, /<ContemporaryRestaurantTemplate/);
});

test("SIGNAL TABLE uses one presentation owner and preserves configured actions", async () => {
  const renderer = await readFile("src/components/theme-renderer.tsx", "utf8");
  const template = await readFile("src/components/templates/signal-table.tsx", "utf8");
  const root = await readFile("src/routes/__root.tsx", "utf8");
  assert.match(renderer, /SignalTableTemplate/);
  assert.doesNotMatch(renderer, /ContemporaryRestaurantTemplate/);
  assert.match(template, /<PublicActionLinks\s/);
  assert.match(template, /isPublicMenuLocaleAvailable\(menu, "en"\)/);
  assert.match(root, /theme-signal-table\.css\?url/);
  assert.doesNotMatch(root, /theme-editorial-canvas\.css\?url/);
});

test("SIGNAL TABLE order bar is conditional, safe-area aware, and not an empty-cart bubble", async () => {
  const template = await readFile("src/components/templates/signal-table.tsx", "utf8");
  const styles = await readFile("src/theme-signal-table.css", "utf8");
  assert.match(template, /!preview && cartCount \?/);
  assert.match(styles, /signal-cart-trigger[\s\S]*safe-area-inset-bottom/);
  assert.match(styles, /signal-main[\s\S]*padding-block-end:\s*calc\(7rem/);
});
