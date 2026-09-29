import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Menuun runtime brand assets are wired to the platform chrome", () => {
  const root = read("src/routes/__root.tsx");
  const home = read("src/routes/index.tsx");
  const footer = read("src/components/marketing-footer.tsx");
  const logo = read("src/components/menuun-logo.tsx");
  const favicon = read("public/favicon.svg");

  assert.match(root, /Menuun/);
  assert.match(root, /favicon\.svg/);
  assert.doesNotMatch(root, /__grok\/icon-180\.png/);

  assert.match(home, /MenuunLogo/);
  assert.match(home, /lang=\{lang\}/);
  assert.doesNotMatch(home, /<Link to="\/" className="font-semibold tracking-tight">\s*Menu V3\s*<\/Link>/);

  assert.match(footer, /MenuunLogo/);
  assert.doesNotMatch(footer, /<Link to="\/" className="font-display text-xl font-semibold">Menu V3<\/Link>/);

  assert.match(logo, /menuun-logo-ar\.svg/);
  assert.match(logo, /menuun-logo-en\.svg/);
  assert.match(logo, /منيو رقمي للمطاعم والكافيهات/);

  assert.match(favicon, /#0F1115/);
  assert.match(favicon, /<svg[^>]*viewBox="264 1741 1955 1885"/);
});
