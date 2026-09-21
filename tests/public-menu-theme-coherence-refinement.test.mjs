import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("catalogue options CTA is hidden so item details remain the single entry point", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");
  assert.match(styles, /data-menu-theme\] \.menu-public-shell \.public-menu-options-action\s*\{[\s\S]*display:\s*none\s*!important/);
});

test("Heritage cart uses the shared bottom action position", async () => {
  const styles = await readFile("src/theme-price-consistency.css", "utf8");
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*\.public-menu-bottom-bar\s*\{[\s\S]*position:\s*fixed\s*!important/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*\.public-menu-bottom-bar\s*\{[\s\S]*bottom:\s*max\(0\.75rem/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*\.public-menu-bottom-bar\s*\{[\s\S]*z-index:\s*40\s*!important/);
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
