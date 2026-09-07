import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Heritage homepage removes decorative numbering and keeps a clear heading", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /editorial-selection[\s\S]*display:\s*none\s*!important/);
  assert.match(styles, /editorial-section-heading[\s\S]*grid-template-columns:\s*minmax\(0,1fr\)\s+auto/);
  assert.match(styles, /editorial-section-heading h2[\s\S]*line-height:\s*1\.3/);
});

test("Heritage featured cards keep price in normal document flow", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /editorial-featured-card \.editorial-card-price[\s\S]*position:\s*static\s*!important/);
  assert.match(styles, /editorial-featured-card \.editorial-card-price[\s\S]*white-space:\s*nowrap\s*!important/);
  assert.match(styles, /editorial-featured-card \.editorial-card-price[\s\S]*unicode-bidi:\s*isolate\s*!important/);
  assert.match(styles, /editorial-featured-card \.editorial-card-title[\s\S]*overflow-wrap:\s*anywhere/);
});

test("Heritage category products use separate title, price, and description cells", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /editorial-product-card[\s\S]*grid-template-columns:\s*minmax\(6\.9rem,27%\)\s+minmax\(0,1fr\)/);
  assert.match(styles, /editorial-product-topline[\s\S]*grid-template-columns:\s*minmax\(0,1fr\)\s+auto/);
  assert.match(styles, /editorial-product-price[\s\S]*position:\s*static\s*!important/);
  assert.match(styles, /editorial-product-price[\s\S]*direction:\s*ltr\s*!important/);
  assert.match(styles, /editorial-product-price[\s\S]*unicode-bidi:\s*isolate\s*!important/);
  assert.match(styles, /editorial-product-description[\s\S]*grid-column:\s*2/);
});

test("Heritage mobile rows preserve readable spacing and wrapping", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*editorial-featured-grid[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*editorial-product-card[\s\S]*column-gap:\s*\.75rem/);
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*editorial-product-description[\s\S]*line-height:\s*1\.5/);
});

test("Heritage retains the final cascade firewall", async () => {
  const styles = await readFile("src/theme-heritage-cascade.css", "utf8");
  assert.match(styles, /background-image:\s*none\s*!important/);
  assert.match(styles, /header::before[\s\S]*opacity:\s*0\s*!important/);
  assert.match(styles, /main ul > li > button[\s\S]*border-radius:\s*0\s*!important/);
});
