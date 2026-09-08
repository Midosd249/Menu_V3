import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("global public-menu price layer is loaded after theme layers", async () => {
  const root = await readFile("src/routes/__root.tsx", "utf8");
  assert.match(root, /priceConsistencyCss from "\.\.\/theme-price-consistency\.css\?url"/);
  assert.match(root, /quickAddCompactRefinementCss[\s\S]*priceConsistencyCss/);
});

test("global price layer keeps public prices in a stable bidi-safe grid", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");
  assert.match(styles, /grid-template-areas:[\s\S]*"name price"[\s\S]*"description description"/);
  assert.match(styles, /direction:\s*ltr/);
  assert.match(styles, /unicode-bidi:\s*isolate/);
  assert.match(styles, /white-space:\s*nowrap/);
  assert.match(styles, /font-variant-numeric:\s*tabular-nums/);
});

test("global price layer does not style quick-add controls as prices", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");
  assert.match(styles, /:not\(\.public-menu-quick-add\):not\(\.public-menu-options-action\)/);
});
