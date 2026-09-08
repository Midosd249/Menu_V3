import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = fs.readFileSync("src/routes/__root.tsx", "utf8");
const refinement = fs.readFileSync("src/quick-add-compact-refinement.css", "utf8");
const publicMenu = fs.readFileSync("src/components/public-menu.tsx", "utf8");
const contemporary = fs.readFileSync("src/components/templates/contemporary-restaurant.tsx", "utf8");

test("compact Quick Add layer is loaded after public theme layers", () => {
  const recovery = root.indexOf("href: publicThemeQualityRecoveryCss");
  const preview = root.indexOf("href: menuPreviewLayerCss");
  const quickAdd = root.indexOf("href: quickAddCompactRefinementCss");
  const price = root.indexOf("href: priceConsistencyCss");
  assert.ok(recovery >= 0);
  assert.ok(preview > recovery);
  assert.ok(quickAdd > preview);
  assert.ok(price > quickAdd);
});

test("Quick Add keeps a 44px hit target with a smaller icon-only visual", () => {
  assert.match(refinement, /position: absolute;/);
  assert.match(refinement, /z-index: 2;/);
  assert.match(refinement, /width: 44px;/);
  assert.match(refinement, /height: 44px;/);
  assert.match(refinement, /min-height: 44px;/);
  assert.match(refinement, /border: 0;/);
  assert.match(refinement, /background: transparent;/);
  assert.match(refinement, /font-size: 0;/);
  assert.match(refinement, /\.public-menu-quick-add > svg/);
  assert.match(refinement, /width: 22px;/);
  assert.match(refinement, /height: 22px;/);
  assert.match(refinement, /outline: 2px solid currentColor;/);
  assert.doesNotMatch(refinement, /public-menu-options-action/);
});

test("Quick Add is positioned against the card/media in shared and editorial renderers", () => {
  assert.match(refinement, /\.menu-public-shell main > section > div > article,\n\.menu-public-shell main ul > li > div,/);
  assert.match(refinement, /\.editorial-featured-card-wrap,\n\.editorial-product-card-wrap/);
  assert.match(refinement, /inset-inline-start: 0\.65rem;/);
  assert.match(refinement, /top: 0\.65rem;/);
  assert.match(refinement, /inset-inline-end: auto;/);
});

test("all five public themes receive the same compact action geometry", () => {
  for (const theme of ["essential", "editorial", "noir", "heritage", "gallery"]) {
    assert.match(refinement, new RegExp(`html\\[data-menu-theme=\\"${theme}\\"\\] \\.public-menu-quick-add`));
  }
});

test("Quick Add remains outside product-card navigation controls", () => {
  assert.match(publicMenu, /className="public-menu-quick-add/);
  assert.match(contemporary, /className="public-menu-quick-add editorial-quick-add/);
  assert.doesNotMatch(publicMenu, /<button[^>]*>[\s\S]*<button[^>]*className="public-menu-quick-add/);
  assert.doesNotMatch(contemporary, /<button[^>]*>[\s\S]*<button[^>]*className="public-menu-quick-add/);
});

test("compact action preserves reduced-motion behavior", () => {
  assert.match(refinement, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(refinement, /transition: none !important;/);
});
