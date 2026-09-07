import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Heritage isolates hero media and bounds the brand logo", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");

  assert.match(styles, /editorial-hero-media[\s\S]*position:\s*absolute/);
  assert.match(styles, /editorial-hero-media[\s\S]*height:\s*100%/);
  assert.match(styles, /editorial-brand-logo[\s\S]*position:\s*relative\s*!important/);
  assert.match(styles, /editorial-brand-logo[\s\S]*width:\s*clamp\(4\.25rem,\s*17vw,\s*5\.75rem\)\s*!important/);
  assert.match(styles, /editorial-brand-logo[\s\S]*height:\s*clamp\(4\.25rem,\s*17vw,\s*5\.75rem\)\s*!important/);
  assert.match(styles, /editorial-brand-logo[\s\S]*object-fit:\s*contain\s*!important/);
});

test("Heritage product cards keep one stable geometry", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");

  assert.match(styles, /main ul > li > button[\s\S]*grid-template-columns:\s*minmax\(6\.75rem,\s*31%\)\s+minmax\(0,\s*1fr\)/);
  assert.match(styles, /main ul > li > button[\s\S]*border-radius:\s*0\.95rem\s*!important/);
  assert.match(styles, /main ul > li > button[\s\S]*transform:\s*none\s*!important/);
  assert.match(styles, /main ul > li > button > :first-child[\s\S]*aspect-ratio:\s*4\s*\/\s*3/);
  assert.doesNotMatch(styles, /nth-child\(even\)[\s\S]*border-radius/);
});

test("Heritage preserves bidi-safe price presentation and reduced motion", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");

  assert.match(styles, /nth-child\(3\)[\s\S]*direction:\s*ltr/);
  assert.match(styles, /nth-child\(3\)[\s\S]*unicode-bidi:\s*isolate/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /animation:\s*none\s*!important/);
});

test("Heritage hardening loads after the final Heritage stylesheet", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");
  assert.match(source, /import heritageThemeCss from "\.\.\/theme-heritage\.css\?url"/);
  assert.match(source, /import heritageHardeningCss from "\.\.\/theme-heritage-hardening\.css\?url"/);
  assert.match(source, /href: heritageThemeCss \},\s*\{ rel: "stylesheet", href: heritageHardeningCss \}/);
});
