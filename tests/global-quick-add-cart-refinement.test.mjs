import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = fs.readFileSync("src/routes/__root.tsx", "utf8");
const refinement = fs.readFileSync("src/quick-add-compact-refinement.css", "utf8");
const publicMenu = fs.readFileSync("src/components/public-menu.tsx", "utf8");
const contemporary = fs.readFileSync("src/components/templates/contemporary-restaurant.tsx", "utf8");
const fineDining = fs.readFileSync("src/components/templates/fine-dining-hospitality.tsx", "utf8");

test("compact quick-add layer is loaded after the existing public theme layers", () => {
  assert.match(root, /import quickAddCompactRefinementCss from "\.\.\/quick-add-compact-refinement\.css\?url";/);
  assert.match(root, /heritageCascadeCss },\n\s{6}\{ rel: "stylesheet", href: quickAddCompactRefinementCss \}/);
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

test("Quick Add is positioned against the card/media in both shared renderers", () => {
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
  assert.match(fineDining, /PublicMenuView/);
  assert.doesNotMatch(publicMenu, /<button[^>]*>[\s\S]*<button[^>]*className="public-menu-quick-add/);
  assert.doesNotMatch(contemporary, /<button[^>]*>[\s\S]*<button[^>]*className="public-menu-quick-add/);
});

test("compact action preserves reduced-motion behavior", () => {
  assert.match(refinement, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(refinement, /transition: none !important;/);
});
