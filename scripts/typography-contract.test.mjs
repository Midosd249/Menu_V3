import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const rootRoute = fs.readFileSync(new URL("src/routes/__root.tsx", root), "utf8");
const typography = fs.readFileSync(new URL("src/typography.css", root), "utf8");
const packageJson = JSON.parse(fs.readFileSync(new URL("package.json", root), "utf8"));

test("shared typography loads Arabic and Latin IBM Plex families", () => {
  assert.match(rootRoute, /typographyCss/);
  assert.match(rootRoute, /family=IBM\+Plex\+Sans:wght@400;500;600;700/);
  assert.match(rootRoute, /family=IBM\+Plex\+Sans\+Arabic:wght@400;500;600;700/);
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
