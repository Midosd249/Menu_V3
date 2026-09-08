import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Heritage removes every decorative menu number", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /editorial-selection[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /editorial-category[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /editorial-hours[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /editorial-card-index[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /editorial-product-number[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /editorial-kicker span:nth-child\(2\)[\s\S]*display:\s*none\s*!important/);
});

test("Heritage homepage keeps a clear heading", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /editorial-section-heading[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) auto/);
  assert.match(styles, /editorial-section-heading h2[\s\S]*line-height:\s*1\.3/);
});

test("Heritage featured cards keep price in normal document flow", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /editorial-featured-card \.editorial-card-price[\s\S]*position:\s*static\s*!important/);
  assert.match(styles, /editorial-featured-card \.editorial-card-price[\s\S]*white-space:\s*nowrap\s*!important/);
  assert.match(styles, /editorial-featured-card \.editorial-card-price[\s\S]*unicode-bidi:\s*isolate\s*!important/);
  assert.match(styles, /editorial-featured-card \.editorial-card-title[\s\S]*overflow-wrap:\s*anywhere/);
});

test("Heritage category products place price on its own row below the description", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /editorial-product-card[\s\S]*grid-template-columns:\s*minmax\(6\.9rem, 27%\)\s+minmax\(0, 1fr\)/);
  assert.match(styles, /editorial-product-copy[\s\S]*display:\s*grid\s*!important/);
  assert.match(styles, /editorial-product-copy[\s\S]*grid-template-rows:\s*auto auto auto auto/);
  assert.match(styles, /editorial-product-topline[\s\S]*display:\s*contents\s*!important/);
  assert.match(styles, /editorial-product-name[\s\S]*grid-row:\s*1/);
  assert.match(styles, /editorial-product-description[\s\S]*grid-row:\s*2/);
  assert.match(styles, /editorial-product-price[\s\S]*grid-row:\s*3/);
  assert.match(styles, /editorial-product-price[\s\S]*position:\s*static\s*!important/);
  assert.match(styles, /editorial-product-price[\s\S]*direction:\s*ltr\s*!important/);
  assert.match(styles, /editorial-product-price[\s\S]*unicode-bidi:\s*isolate\s*!important/);
  assert.match(styles, /editorial-product-tags[\s\S]*grid-row:\s*4/);
});

test("Heritage action rail gives language a deliberate header position", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /editorial-actions-wrap[\s\S]*position:\s*relative\s*!important/);
  assert.match(styles, /editorial-actions-wrap[\s\S]*margin:\s*-1\.1rem auto 0\s*!important/);
  assert.match(styles, /editorial-lang-toggle[\s\S]*order:\s*-1\s*!important/);
  assert.match(styles, /editorial-lang-toggle button\[aria-pressed="true"\][\s\S]*background:\s*var\(--heritage-brass-final\)\s*!important/);
});

test("Heritage retains data-driven customer action ownership", async () => {
  const source = await readFile("src/components/public-action-links.tsx", "utf8");
  const actions = await readFile("src/lib/menu/public-actions.ts", "utf8");
  assert.match(source, /getPublicActions\(tenant, branch, lang\)/);
  assert.match(source, /data-action-key=\{action\.key\}/);
  assert.match(actions, /whatsapp \? \{ key: "whatsapp"/);
  assert.match(actions, /maps \? \{ key: "location"/);
  assert.match(actions, /phone \? \{ key: "phone"/);
  assert.match(actions, /instagram \? \{ key: "instagram"/);
});

test("Heritage mobile rows preserve readable spacing and wrapping", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*editorial-featured-grid[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*editorial-product-card[\s\S]*column-gap:\s*0\.75rem/);
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*editorial-product-description[\s\S]*line-height:\s*1\.5/);
});

test("Heritage retains the final cascade firewall", async () => {
  const styles = await readFile("src/theme-heritage-cascade.css", "utf8");
  assert.match(styles, /background-image:\s*none\s*!important/);
  assert.match(styles, /header::before[\s\S]*opacity:\s*0\s*!important/);
  assert.match(styles, /main ul > li > button[\s\S]*border-radius:\s*0\s*!important/);
});
