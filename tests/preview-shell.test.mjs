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
