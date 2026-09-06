import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const rootRoute = fs.readFileSync(new URL("src/routes/__root.tsx", root), "utf8");
const typography = fs.readFileSync(new URL("src/typography.css", root), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("package.json", root), "utf8"));

const ARABIC_ASSETS = ["400", "500", "600", "700"];
const LATIN_ASSETS = ["400", "500", "600", "700"];

function assertPinnedFontAsset(fontFamily, weight) {
  const familyPath = fontFamily === "IBM Plex Sans Arabic" ? "ibm-plex-sans-arabic" : "ibm-plex-sans";
  const subset = fontFamily === "IBM Plex Sans Arabic" ? "arabic" : "latin";
  const pattern = new RegExp(
    `https://cdn\\.jsdelivr\\.net/fontsource/fonts/${familyPath}@5\\.3\\.0/${subset}-${weight}-normal\\.woff2`,
  );
  assert.match(typography, pattern);
}

test("shared typography loads pinned IBM Plex Arabic and Latin families", () => {
  assert.match(rootRoute, /typographyCss/);
  assert.doesNotMatch(rootRoute, /fonts\.googleapis\.com/);
  assert.doesNotMatch(rootRoute, /fonts\.gstatic\.com/);

  for (const weight of [400, 500, 600, 700]) {
    assertPinnedFontAsset("IBM Plex Sans Arabic", weight);
    assertPinnedFontAsset("IBM Plex Sans", weight);
  }

  assert.equal(ARABIC_ASSETS.length, 4);
  assert.equal(LATIN_ASSETS.length, 4);
  assert.match(typography, /font-display:\s*swap/);
  assert.match(typography, /--type-display-family/);
  assert.match(typography, /--type-body-family/);
  assert.match(typography, /font-synthesis:\s*none/);
});

test("typography preserves semantic weights and bidi isolation", () => {
  assert.match(typography, /--type-heading-weight:\s*700/);
  assert.match(typography, /--type-body-weight:\s*400/);
  assert.match(typography, /--type-button-weight:\s*600/);
  assert.match(typography, /font-variant-numeric:\s*tabular-nums/);
  assert.match(typography, /unicode-bidi:\s*isolate/);
});

test("typography implementation does not add a font package dependency", () => {
  const dependencyNames = Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies });
  assert.equal(dependencyNames.some((name) => /plex|font/i.test(name)), false);
});
