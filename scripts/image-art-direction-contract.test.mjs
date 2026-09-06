import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const css = fs.readFileSync(new URL("src/image-art-direction.css", root), "utf8");
const docs = fs.readFileSync(new URL("docs/image-art-direction.md", root), "utf8");
const publicMenu = fs.readFileSync(new URL("src/components/public-menu.tsx", root), "utf8");

test("shared image art direction exposes stable focal-point and role contracts", () => {
  assert.match(css, /img\.object-cover/);
  assert.match(css, /img\[data-media-role\]/);
  assert.match(css, /object-fit:\s*cover/);
  assert.match(css, /--media-focal-x/);
  assert.match(css, /--media-focal-y/);
  assert.match(css, /--media-mobile-focal-x/);
  assert.match(css, /--media-mobile-focal-y/);
  assert.match(css, /prefers-reduced-data/);
});

test("art direction documents responsive, accessibility, fallback, and licensing rules", () => {
  for (const phrase of [
    "stable geometry",
    "loading=\"lazy\"",
    "alt text",
    "Decorative imagery",
    "Tenant-uploaded imagery",
    "competitor-owned",
    "five protected themes",
  ]) assert.match(docs, new RegExp(phrase.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")));
});

test("current public menu keeps the safe lazy-loading baseline for dish media", () => {
  assert.match(publicMenu, /loading=\"lazy\"/);
  assert.match(publicMenu, /decoding=\"async\"/);
  assert.match(publicMenu, /fetchPriority=\"low\"/);
});
