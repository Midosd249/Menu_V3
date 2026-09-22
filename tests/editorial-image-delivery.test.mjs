import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const imageSource = await readFile("src/lib/menu/image.ts", "utf8");
const mediaSource = await readFile("src/components/menu/primitives.tsx", "utf8");
const editorialSource = await readFile("src/components/templates/contemporary-restaurant.tsx", "utf8");

test("responsive image delivery transforms only known Unsplash sources", async () => {
  const { getOptimizedImageUrl, getResponsiveImageSources } = await import("../src/lib/menu/image.ts");
  const raw = "https://images.unsplash.com/photo-example?ixid=test";
  const optimized = getOptimizedImageUrl(raw, { width: 448, quality: 76, fit: "crop" });
  assert.match(optimized ?? "", /[?&]w=448(?:&|$)/);
  assert.match(optimized ?? "", /[?&]q=76(?:&|$)/);
  assert.match(optimized ?? "", /[?&]fit=crop(?:&|$)/);
  assert.match(optimized ?? "", /[?&]auto=format(?:&|$)/);

  assert.equal(getOptimizedImageUrl("https://example.com/image.jpg", { width: 448 }), "https://example.com/image.jpg");
  assert.equal(getOptimizedImageUrl("data:image/webp;base64,abc", { width: 448 }), "data:image/webp;base64,abc");

  const responsive = getResponsiveImageSources(raw, { widths: [192, 320, 448], quality: 76, fit: "crop" });
  assert.match(responsive.src ?? "", /w=448/);
  assert.match(responsive.srcSet ?? "", /192w/);
  assert.match(responsive.srcSet ?? "", /320w/);
  assert.match(responsive.srcSet ?? "", /448w/);
  assert.equal(getResponsiveImageSources("https://example.com/image.jpg", { widths: [192, 320] }).srcSet, undefined);
});

test("MenuMedia exposes responsive delivery controls without changing fallback semantics", () => {
  assert.match(imageSource, /UNSPLASH_HOSTNAMES/);
  assert.match(mediaSource, /getResponsiveImageSources/);
  assert.match(mediaSource, /imageWidths/);
  assert.match(mediaSource, /sizes=\?/);
});

test("Signal Table uses bounded responsive media and only promotes first viewport images", () => {
  assert.match(editorialSource, /editorial-featured-image/);
  assert.match(editorialSource, /imageWidths=\{\[320, 480, 640, 960\]\}/);
  assert.match(editorialSource, /eager=\{index < 2\}/);
  assert.match(editorialSource, /editorial-product-image/);
  assert.match(editorialSource, /imageWidths=\{\[192, 320, 448\]\}/);
  assert.match(editorialSource, /eager=\{index < 2 && categoryIndex === 0 && categoryId === "all" && !query\}/);
});
