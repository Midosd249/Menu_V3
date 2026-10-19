import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const upsellPanel = fs.readFileSync(new URL("src/components/public-upsell-panel.tsx", root), "utf8");
const publicMenu = fs.readFileSync(new URL("src/components/public-menu.tsx", root), "utf8");
const signalTable = fs.readFileSync(new URL("src/components/templates/signal-table.tsx", root), "utf8");
const taste = fs.readFileSync(new URL("src/components/templates/taste.tsx", root), "utf8");

test("public upsell requests the existing product-details flow instead of scrolling to the top", () => {
  assert.match(upsellPanel, /requestPublicMenuProductDetails\(item\.recommendedProductId\)/);
  assert.doesNotMatch(upsellPanel, /window\.scrollTo/);
  assert.match(upsellPanel, /eventType: "upsell_click"/);
});

test("each canonical public-menu details owner resolves requested IDs against currently visible products", () => {
  for (const source of [publicMenu, signalTable, taste]) {
    assert.match(source, /listenForPublicMenuProductDetails/);
    assert.match(source, /visible\.find[\s\S]{0,100}productId/);
  }
  assert.match(publicMenu, /trackProduct\(product\)/);
  assert.match(signalTable, /selectProduct\(product\)/);
  assert.match(taste, /openProduct\(product\)/);
  assert.match(publicMenu, /options=\{menu\.productOptions\?\.\[selected\.id\]\}/);
  assert.match(publicMenu, /offer=\{menu\.productOffers\?\.\[selected\.id\]\}/);
  assert.match(publicMenu, /group\.minSelect/);
});

test("the product-details event carries the selected product ID once and supports listener cleanup", async () => {
  const originalWindow = globalThis.window;
  const target = new EventTarget();
  Object.defineProperty(globalThis, "window", { configurable: true, value: target });
  try {
    const { requestPublicMenuProductDetails, listenForPublicMenuProductDetails } = await import("../src/lib/menu/public-menu-events.ts");
    const received = [];
    const stop = listenForPublicMenuProductDetails((productId) => received.push(productId));

    requestPublicMenuProductDetails("product-recommended-1");
    assert.deepEqual(received, ["product-recommended-1"]);

    stop();
    requestPublicMenuProductDetails("product-recommended-2");
    assert.deepEqual(received, ["product-recommended-1"]);
  } finally {
    if (originalWindow === undefined) delete globalThis.window;
    else Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
  }
});
