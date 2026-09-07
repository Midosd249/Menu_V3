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
  assert.match(root, /heritageCascadeCss },\n      \{ rel: "stylesheet", href: quickAddCompactRefinementCss \}/);
});

test("quick-add keeps an accessible 44px interactive target while using a compact visual footprint", () => {
  assert.match(refinement, /width: 44px;/);
  assert.match(refinement, /height: 44px;/);
  assert.match(refinement, /min-height: 44px;/);
  assert.match(refinement, /font-size: 0;/);
  assert.match(refinement, /\.public-menu-quick-add > svg/);
  assert.match(refinement, /outline: 2px solid currentColor;/);
  assert.doesNotMatch(refinement, /public-menu-options-action/);
});

test("all five public themes receive distinct compact Quick Add treatments", () => {
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
