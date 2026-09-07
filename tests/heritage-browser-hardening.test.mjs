import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Heritage uses the new modern atelier visual direction", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");

  assert.match(styles, /--heritage-olive:\s*#46513c/);
  assert.match(styles, /--heritage-brass:\s*#a4773d/);
  assert.match(styles, /editorial-hero-media[\s\S]*width:\s*min\(48%,\s*34rem\)/);
  assert.match(styles, /editorial-brand-logo[\s\S]*width:\s*clamp\(4rem,\s*10vw,\s*5\.75rem\)\s*!important/);
  assert.match(styles, /editorial-brand-logo[\s\S]*object-fit:\s*contain\s*!important/);
});

test("Heritage product rows use one quiet stable geometry", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");

  assert.match(styles, /main ul > li > button[\s\S]*grid-template-columns:\s*minmax\(6\.9rem,\s*27%\)\s+minmax\(0,\s*1fr\)/);
  assert.match(styles, /main ul > li > button[\s\S]*border:\s*0\s*!important/);
  assert.match(styles, /main ul > li > button[\s\S]*border-radius:\s*0\s*!important/);
  assert.match(styles, /main ul > li > button > :first-child[\s\S]*aspect-ratio:\s*4\s*\/\s*3/);
  assert.doesNotMatch(styles, /nth-child\(even\)[\s\S]*border-radius/);
});

test("Heritage preserves bidi-safe prices and reduced motion", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");

  assert.match(styles, /nth-child\(3\)[\s\S]*direction:\s*ltr/);
  assert.match(styles, /nth-child\(3\)[\s\S]*unicode-bidi:\s*isolate/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /animation:\s*none\s*!important/);
});

test("Heritage becomes a stacked mobile art-directed hero", async () => {
  const styles = await readFile("src/theme-heritage-hardening.css", "utf8");

  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*editorial-hero-media[\s\S]*height:\s*48%/);
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*editorial-brand-logo[\s\S]*width:\s*4rem\s*!important/);
  assert.match(styles, /@media \(max-width:\s*700px\)[\s\S]*main ul > li > button[\s\S]*min-height:\s*6\.6rem/);
});

test("Heritage hardening remains the final Heritage stylesheet", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");
  assert.match(source, /import heritageThemeCss from "\.\.\/theme-heritage\.css\?url"/);
  assert.match(source, /import heritageHardeningCss from "\.\.\/theme-heritage-hardening\.css\?url"/);
  assert.match(source, /href: heritageThemeCss \},\s*\{ rel: "stylesheet", href: heritageHardeningCss \}/);
});
