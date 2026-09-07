import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Gallery Most Popular uses the semantic Featured section and stable image/content regions", async () => {
  const styles = await readFile("src/theme-public-quality-recovery.css", "utf8");

  assert.match(styles, /data-menu-theme="gallery"[\s\S]*section:has\(> #featured-heading\)/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*grid-template-rows:\s*minmax\(0,\s*auto\)\s+minmax\(5\.35rem,\s*auto\)/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*> :last-child[\s\S]*min-height:\s*5\.35rem/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*> :last-child > :first-child[\s\S]*-webkit-line-clamp:\s*2/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*> :last-child > :last-child[\s\S]*direction:\s*ltr/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*> :last-child > :last-child[\s\S]*unicode-bidi:\s*isolate/);
});

test("Heritage keeps image, copy, and SAR price in stable non-overlapping regions", async () => {
  const styles = await readFile("src/theme-public-quality-recovery.css", "utf8");

  assert.match(styles, /data-menu-theme="heritage"[\s\S]*grid-template-columns:\s*minmax\(6\.25rem,\s*31%\)\s+minmax\(0,\s*1fr\)/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*> :last-child[\s\S]*overflow:\s*hidden/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*> :last-child > :first-child[\s\S]*overflow-wrap:\s*anywhere/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*> :last-child > :nth-child\(3\)[\s\S]*direction:\s*ltr/);
  assert.match(styles, /data-menu-theme="heritage"[\s\S]*> :last-child > :nth-child\(3\)[\s\S]*unicode-bidi:\s*isolate/);
});

test("Public theme recovery preserves mobile safe-area clearance and reduced motion", async () => {
  const styles = await readFile("src/theme-public-quality-recovery.css", "utf8");

  assert.match(styles, /data-menu-theme="heritage"[\s\S]*padding-bottom:\s*calc\(8\.5rem \+ env\(safe-area-inset-bottom,\s*0px\)\)/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(styles, /z-index:\s*9\d\d/);
  assert.doesNotMatch(styles, /setTimeout\(/);
});

test("Public theme recovery is loaded after existing theme hardening", async () => {
  const source = await readFile("src/routes/__root.tsx", "utf8");

  assert.match(source, /import publicThemeQualityRecoveryCss from "\.\.\/theme-public-quality-recovery\.css\?url"/);
  assert.match(source, /href: galleryHardeningCss \},\s*\{ rel: "stylesheet", href: publicThemeQualityRecoveryCss \}/);
});
