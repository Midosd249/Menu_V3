import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Editorial QR rendering keeps item numbers separated from readable Arabic names", async () => {
  const styles = await readFile("src/theme-qr-final-fixes.css", "utf8");
  assert.match(styles, /editorial-product-topline[\s\S]*grid-template-columns:\s*auto\s+minmax\(0,\s*1fr\)\s+auto/);
  assert.match(styles, /editorial-product-topline[\s\S]*column-gap:\s*0\.65rem/);
  assert.match(styles, /editorial-product-name[\s\S]*word-break:\s*normal/);
  assert.match(styles, /editorial-product-name[\s\S]*hyphens:\s*none/);
});

test("Noir QR rendering uses the configured restaurant cover", async () => {
  const template = await readFile("src/components/templates/fine-dining-hospitality.tsx", "utf8");
  const styles = await readFile("src/theme-noir-hardening.css", "utf8");
  assert.match(template, /MenuMedia src=\{tenant\.coverUrl\}/);
  assert.match(template, /className="noir-template-hero-image"/);
  assert.doesNotMatch(template, /className="noir-template-featured"/);
  assert.doesNotMatch(styles, /noir-template-menu > \.menu-public-shell > main > section:has\(> #featured-heading\)[\s\S]*display:\s*none !important/);
  assert.match(styles, /noir-template-menu > \.menu-public-shell section:has\(> #featured-heading\)[\s\S]*display:\s*block !important/);
});

test("Taste QR rendering exposes the configured restaurant logo in the hero", async () => {
  const template = await readFile("src/components/templates/taste.tsx", "utf8");
  const styles = await readFile("src/theme-qr-final-fixes.css", "utf8");
  assert.match(template, /tenant\.logoUrl/);
  assert.match(template, /className="taste-hero-logo"/);
  assert.match(styles, /taste-hero-logo[\s\S]*object-fit:\s*contain/);
});
