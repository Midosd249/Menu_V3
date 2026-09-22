import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const imageSource = await readFile("src/lib/menu/image.ts", "utf8");
const mediaSource = await readFile("src/components/menu/primitives.tsx", "utf8");
const studioSource = await readFile("src/components/studio-menu-workspace.tsx", "utf8");
const publicSource = await readFile("src/components/public-menu.tsx", "utf8");

test("image delivery contract normalizes only known Unsplash sources", async () => {
  const { getOptimizedImageUrl, getResponsiveImageSources } = await import("../src/lib/menu/image.ts");
  const raw = "https://images.unsplash.com/photo-example?ixid=test";
  const optimized = getOptimizedImageUrl(raw, { width: 640, quality: 76, fit: "crop" });
  assert.match(optimized ?? "", /[?&]w=640(?:&|$)/);
  assert.match(optimized ?? "", /[?&]q=76(?:&|$)/);
  assert.match(optimized ?? "", /[?&]fit=crop(?:&|$)/);
  assert.match(optimized ?? "", /[?&]auto=format(?:&|$)/);
  assert.match(getOptimizedImageUrl("https://example.com/image.jpg", { width: 640 }) ?? "", /^https:\/\/example\.com\/image\.jpg$/);
  assert.equal(getOptimizedImageUrl("data:image/webp;base64,abc", { width: 640 }), "data:image/webp;base64,abc");
  const responsive = getResponsiveImageSources(raw, { widths: [192, 320, 448], quality: 76, fit: "crop" });
  assert.match(responsive.src ?? "", /w=448/);
  assert.match(responsive.srcSet ?? "", /192w/);
  assert.match(responsive.srcSet ?? "", /320w/);
  assert.match(responsive.srcSet ?? "", /448w/);
  assert.equal(getResponsiveImageSources("https://example.com/image.jpg", { widths: [192, 320] }).srcSet, undefined);
});

test("shared MenuMedia exposes responsive image delivery controls", () => {
  assert.match(imageSource, /UNSPLASH_HOSTNAMES/);
  assert.match(mediaSource, /getResponsiveImageSources/);
  assert.match(mediaSource, /imageWidths/);
  assert.match(mediaSource, /imageWidth\?: number/);
});

test("Studio product thumbnails are lazy, dimensioned, and optimized", () => {
  assert.match(studioSource, /getOptimizedImageUrl\(product\.imageUrl/);
  assert.match(studioSource, /loading="lazy"/);
  assert.match(studioSource, /decoding="async"/);
  assert.match(studioSource, /width="48" height="48"/);
});

test("public product media remains lazy and no longer prefetches every Editorial product image", () => {
  assert.match(publicSource, /getResponsiveImageSources/);
  assert.match(publicSource, /loading="lazy"/);
  assert.match(publicSource, /decoding="async"/);
  assert.match(publicSource, /fetchPriority="low"/);
  assert.doesNotMatch(publicSource, /new Image\(\)/);
});
