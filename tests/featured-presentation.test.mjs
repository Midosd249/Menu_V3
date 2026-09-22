import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const presentationSource = await readFile("src/lib/menu/presentation.ts", "utf8");
const rendererPaths = [
  "src/components/public-menu.tsx",
  "src/components/templates/fast-casual.tsx",
  "src/components/templates/specialty-cafe.tsx",
  "src/components/templates/taste.tsx",
  "src/components/templates/signal-table.tsx",
  "src/components/templates/contemporary-restaurant.tsx",
];

test("featured presentation is bounded without changing product truth", async () => {
  const { getFeaturedProducts, MAX_FEATURED_PRESENTATION_ITEMS } = await import("../src/lib/menu/presentation.ts");
  const products = Array.from({ length: 30 }, (_, index) => ({
    id: String(index + 1),
    isFeatured: true,
  }));
  const featured = getFeaturedProducts(products);
  assert.equal(MAX_FEATURED_PRESENTATION_ITEMS, 6);
  assert.equal(featured.length, 6);
  assert.equal(products.length, 30);
  assert.equal(products.every((product) => product.isFeatured), true);
  assert.deepEqual(featured.map((product) => product.id), ["1", "2", "3", "4", "5", "6"]);
});

test("featured presentation helper preserves non-featured products for normal discovery", async () => {
  const { getFeaturedProducts } = await import("../src/lib/menu/presentation.ts");
  const products = [
    { id: "featured-1", isFeatured: true },
    { id: "normal-1", isFeatured: false },
    { id: "featured-2", isFeatured: true },
  ];
  assert.deepEqual(getFeaturedProducts(products).map((product) => product.id), ["featured-1", "featured-2"]);
  assert.deepEqual(products.map((product) => product.id), ["featured-1", "normal-1", "featured-2"]);
});

test("all protected public renderer families use the bounded featured helper", async () => {
  for (const path of rendererPaths) {
    const source = await readFile(path, "utf8");
    assert.match(source, /getFeaturedProducts\(visible\)/, path);
    assert.doesNotMatch(source, /visible\.filter\(\(product\) => product\.isFeatured\)/, path);
    assert.doesNotMatch(source, /visible\.filter\(\(p\) => p\.isFeatured\)/, path);
  }
});

test("presentation helper defines the six-item ceiling in one place", () => {
  assert.match(presentationSource, /MAX_FEATURED_PRESENTATION_ITEMS = 6/);
  assert.match(presentationSource, /\.filter\(\(product\) => product\.isFeatured\)\.slice\(0, MAX_FEATURED_PRESENTATION_ITEMS\)/);
});
