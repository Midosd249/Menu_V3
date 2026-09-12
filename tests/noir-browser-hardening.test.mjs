import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Noir hardening keeps one presentation shell and stable product media", async () => {
  const template = await readFile("src/components/templates/fine-dining-hospitality.tsx", "utf8");
  const styles = await readFile("src/theme-noir-hardening.css", "utf8");

  assert.match(template, /className="noir-template-shell/);
  assert.match(template, /<PublicMenuView menu=\{menu\} preview=\{preview\}/);
  assert.doesNotMatch(template, /recordPublicEvent|getGuestSessionId/);
  assert.match(styles, /noir-template-menu > \.menu-public-shell > header[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /section:has\(> #featured-heading\)[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(styles, /transform:\s*none\s*!important/);
  assert.match(styles, /animation:\s*none\s*!important/);
});

test("Noir hardening preserves RTL/LTR and safe-area action space", async () => {
  const styles = await readFile("src/theme-noir-hardening.css", "utf8");

  assert.match(styles, /html\[dir="rtl"\]\[data-menu-theme="noir"\]/);
  assert.match(styles, /env\(safe-area-inset-bottom\)/);
  assert.match(styles, /noir-template-menu > \.menu-public-shell > nav\[aria-label="إجراءات المنيو"\]/);
  assert.match(styles, /noir-template-menu > \.menu-public-shell > nav\[aria-label="Menu actions"\]/);
});

test("Noir hardening is loaded after the existing Noir refinement layers", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");

  assert.match(source, /import noirThemeCss from "\.\.\/theme-noir\.css\?url"/);
  assert.match(source, /import themeRefinementsCss from "\.\.\/theme-refinements\.css\?url"/);
  assert.match(source, /import themeRefinementsV2Css from "\.\.\/theme-refinements-v2\.css\?url"/);
  assert.match(source, /import noirHardeningCss from "\.\.\/theme-noir-hardening\.css\?url"/);
  assert.match(source, /href: noirThemeCss \},\s*\{ rel: "stylesheet", href: themeRefinementsCss \},\s*\{ rel: "stylesheet", href: themeRefinementsV2Css \},\s*\{ rel: "stylesheet", href: noirHardeningCss \}/);
});

test("Noir does not trap shared modals inside the public content stacking context", async () => {
  const styles = await readFile("src/theme-refinements-v2.css", "utf8");

  assert.doesNotMatch(styles, /\.menu-public-shell > \* \{ position: relative; z-index: 1; \}/);
  assert.match(styles, /\.menu-public-shell > header,\s*html\[data-menu-theme="noir"\] \.menu-public-shell > main,\s*html\[data-menu-theme="noir"\] \.menu-public-shell > footer/);
  assert.match(styles, /\.menu-public-shell \[role="dialog"\][\s\S]*background: var\(--color-surface-primary\) !important/);
  assert.match(styles, /\.menu-public-shell \[role="dialog"\] \.text-ink[\s\S]*color: var\(--color-content-primary\) !important/);
});
