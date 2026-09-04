import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  "src/routes/studio/preview.tsx",
  "src/routes/themes/preview.tsx",
];

test("preview routes do not create a second menu shell", async () => {
  for (const path of routes) {
    const source = await readFile(path, "utf8");
    assert.equal(source.includes('className="menu-public-shell"'), false, `${path} must not wrap the menu in a nested shell`);
    assert.match(source, /<MenuThemeController\s/);
    assert.match(source, /<PublicMenuView\s/);
    assert.match(source, /<ContemporaryRestaurantTemplate\s/);
  }
});

test("preview menu cards keep a time-based visible final state", async () => {
  const styles = await readFile("src/styles.css", "utf8");
  assert.doesNotMatch(styles, /animation-timeline:\s*(view|scroll)\(/, "preview content must not depend on scroll-driven animation progress");
  assert.match(styles, /animation:\s*menu-fade-up\s+\.65s[^;]*both;/);
  assert.match(styles, /data-menu-theme-mode="preview"[\s\S]*?animation:\s*none\s*!important;[\s\S]*?opacity:\s*1\s*!important;/);
  assert.doesNotMatch(styles, /\.menu-public-shell\s*>\s*div\s*\{[^}]*min-height:\s*100dvh/, "direct preview children must not become full-screen layout layers");
});
