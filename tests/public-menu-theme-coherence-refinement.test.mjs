import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("catalogue options CTA is hidden so item details remain the single entry point", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");
  assert.match(styles, /data-menu-theme\] \.menu-public-shell \.public-menu-options-action\s*\{[\s\S]*display:\s*none\s*!important/);
});

test("Heritage cart uses the shared bottom action position", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");
  const finalPolish = await readFile("src/theme-final-visual-polish.css", "utf8");
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*\.public-menu-bottom-bar\s*\{[\s\S]*position:\s*fixed\s*!important/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*\.public-menu-bottom-bar\s*\{[\s\S]*bottom:\s*max\(0\.75rem/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*\.public-menu-bottom-bar\s*\{[\s\S]*z-index:\s*40\s*!important/);
  assert.match(finalPolish, /data-menu-theme="heritage"[\s\S]*\.public-menu-bottom-bar\s*\{[\s\S]*margin-inline:\s*auto\s*!important/);
  assert.match(finalPolish, /data-menu-theme="heritage"[\s\S]*\.public-menu-bottom-bar\s*\{[\s\S]*justify-content:\s*center\s*!important/);
  assert.match(finalPolish, /public-menu-bottom-bar > button:first-child[\s\S]*justify-content:\s*center\s*!important/);
});

test("Heritage opening hours use a stable two-column schedule rhythm", async () => {
  const styles = await readFile("src/theme-final-visual-polish.css", "utf8");
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*\.editorial-hours-grid\s*\{[\s\S]*display:\s*grid\s*!important/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*\.editorial-hours-grid > div\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) auto\s*!important/);
  assert.match(styles, /editorial-hours-grid > div > \*:last-child[\s\S]*direction:\s*ltr\s*!important/);
});

test("Noir footer remains a dark surface for opening-hours content", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");
  assert.match(styles, /data-menu-theme="noir"[\s\S]*\.menu-public-shell footer\s*\{[\s\S]*background:\s*#171311\s*!important/);
  assert.match(styles, /data-menu-theme="noir"[\s\S]*\.menu-public-shell footer h2,[\s\S]*color:\s*#f6efe6\s*!important/);
});

test("product information wrappers cannot clip variable-length descriptions", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");
  assert.match(styles, /data-menu-theme\] \.menu-public-shell main > section:not\(:first-child\)[\s\S]*height:\s*auto\s*!important/);
  assert.match(styles, /data-menu-theme\] \.menu-public-shell main > section:not\(:first-child\)[\s\S]*overflow:\s*visible\s*!important/);
  assert.match(styles, /data-menu-theme\] \.menu-public-shell main > section:not\(:first-child\)[\s\S]*overflow-wrap:\s*anywhere/);
});

test("theme previews receive distinct premium cover-art directions without changing tenant cover data", async () => {
  const styles = await readFile("src/theme-final-visual-polish.css", "utf8");
  assert.match(styles, /data-menu-theme="essential"[\s\S]*data-menu-preview="true"[\s\S]*background-image:\s*url\(/);
  assert.match(styles, /data-menu-theme="editorial"[\s\S]*data-menu-preview="true"[\s\S]*background-image:\s*url\(/);
  assert.match(styles, /data-menu-theme="noir"[\s\S]*data-menu-preview="true"[\s\S]*background-image:\s*url\(/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*data-menu-preview="true"[\s\S]*background-image:\s*url\(/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*data-menu-preview="true"[\s\S]*background-image:\s*url\(/);
  assert.match(styles, /data-menu-preview="true" header > div:first-child img[\s\S]*opacity:\s*0\s*!important/);
});
