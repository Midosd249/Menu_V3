import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const fixture = JSON.parse(fs.readFileSync(path.join(root, "fixtures/performance/golden-public-menu-30.json"), "utf8"));
const harness = fs.readFileSync(path.join(root, "scripts/golden-performance-fixture.mjs"), "utf8");
const audit = fs.readFileSync(path.join(root, "scripts/performance-audit.mjs"), "utf8");

test("golden fixture is deterministic and contains the required 30-product stress shape", () => {
  assert.equal(fixture.fixtureId, "golden-public-menu-30");
  assert.equal(fixture.products.length, 30);
  assert.equal(fixture.expected.productCount, 30);
  assert.equal(fixture.expected.imageBearingProductCount, 30);
  assert.equal(fixture.expected.featuredProductCount, 30);
  assert.equal(fixture.products.filter((product) => product.isFeatured).length, 30);
  assert.equal(fixture.products.filter((product) => product.imagePath).length, 30);
  assert.equal(fixture.products.filter((product) => !product.descriptionAr).length, 6);
  assert.equal(fixture.tenant.legacyCoverBytes, 233518);
});

test("golden fixture excludes diagnostic customer identity and preserves mixed presentation data", () => {
  const serialized = JSON.stringify(fixture);
  assert.doesNotMatch(serialized, /mido@hotmail\.com/i);
  assert.ok(fixture.products.some((product) => product.descriptionAr === null));
  assert.ok(new Set(fixture.products.map((product) => product.imageProvider)).size >= 3);
  assert.equal(fixture.expected.optionsContainerCount, 0);
});

test("golden harness runs canonical and legacy cover modes through the existing audit", () => {
  assert.match(harness, /golden-performance-\\\${mode}\.json/);
  assert.match(harness, /cover=\$\\{mode\}/);
  assert.match(harness, /PERFORMANCE_AUDIT_SCROLL_ALL: "1"/);
  assert.match(harness, /PERFORMANCE_AUDIT_VIEWPORT_WIDTH/);
  assert.match(harness, /legacyCoverDataUrl/);
  assert.match(harness, /current-decoupled/);
  assert.match(harness, /legacy-base64/);
});

test("performance audit exposes document and image evidence required by the golden fixture", () => {
  assert.match(audit, /transferBytes: Number\(navigation\.transferSize/);
  assert.match(audit, /encodedBytes: Number\(navigation\.encodedBodySize/);
  assert.match(audit, /decodedBytes: Number\(navigation\.decodedBodySize/);
  assert.match(audit, /initialImageRequestCount/);
  assert.match(audit, /finalImageRequestCount/);
  assert.match(audit, /PERFORMANCE_AUDIT_SCROLL_ALL/);
});
