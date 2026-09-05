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

test("published public routes do not add a route-level presentation shell", async () => {
  for (const path of ["src/routes/m.$slug.tsx", "src/routes/m.$slug.$branch.tsx"]) {
    const source = await readFile(path, "utf8");
    assert.doesNotMatch(source, /return <div className="menu-public-shell"/);
    assert.match(source, /createThemeBootstrapScript\(activeTheme/);
  }
});

test("theme controller does not clear tokens between theme changes", async () => {
  const source = await readFile("src/components/menu-theme-controller.tsx", "utf8");
  assert.match(source, /useLayoutEffect\(\(\) => \(\) => clearThemeTokens\(\), \[\]\)/);
  assert.doesNotMatch(source, /setThemeTokens\(key\);\n\s*return clearThemeTokens/);
});

test("public menu keeps an always-available cart entry point and shared quick actions", async () => {
  const source = await readFile("src/components/public-menu.tsx", "utf8");
  assert.match(source, /aria-label=\{label\(lang, "السلة", "Cart"\)\}/);
  assert.match(source, /setCartOpen\(true\)/);
  assert.match(source, /branch\.mapsUrl/);
  assert.match(source, /branch\.phone/);
});

test("preview menu cards keep a time-based visible final state", async () => {
  const styles = await readFile("src/styles.css", "utf8");
  assert.doesNotMatch(styles, /animation-timeline:\s*(view|scroll)\(/, "preview content must not depend on scroll-driven animation progress");
  assert.match(styles, /animation:\s*menu-fade-up\s+\.65s[^;]*both;/);
  assert.match(styles, /data-menu-theme-mode="preview"[\s\S]*?animation:\s*none\s*!important;[\s\S]*?opacity:\s*1\s*!important;/);
  assert.doesNotMatch(styles, /\.menu-public-shell\s*>\s*div\s*\{[^}]*min-height:\s*100dvh/, "direct preview children must not become full-screen layout layers");
});

test("Essential owns one public renderer instead of duplicate template chrome", async () => {
  const source = await readFile("src/components/templates/small-menu.tsx", "utf8");
  assert.match(source, /<PublicMenuView\s+menu=\{menu\}\s+preview=\{preview\}/);
  assert.doesNotMatch(source, /<header\b/);
  assert.doesNotMatch(source, /قائمة مختصرة/);
});

test("Essential refinement has deterministic light canvas, safe-area clearance, and documented overlay priority", async () => {
  const styles = await readFile("src/theme-essential.css", "utf8");
  assert.match(styles, /html\[data-menu-theme="essential"\]\s*\{[\s\S]*color-scheme:\s*light;/);
  assert.match(styles, /html\[data-menu-theme="essential"\]\s+body\s*\{[\s\S]*background:\s*#f7f3eb;/);
  assert.match(styles, /padding-bottom:\s*calc\(8\.25rem \+ env\(safe-area-inset-bottom, 0px\)\)/);
  assert.match(styles, /bottom:\s*max\(0\.75rem, env\(safe-area-inset-bottom, 0px\)\)/);
  assert.match(styles, /\.menu-public-shell > nav\.fixed[\s\S]*z-index:\s*40/);
  assert.doesNotMatch(styles, /z-index:\s*9999/);
  assert.doesNotMatch(styles, /animation-timeline:\s*view\(/);
});

test("Essential keeps touch targets and readable product hierarchy", async () => {
  const styles = await readFile("src/theme-essential.css", "utf8");
  assert.match(styles, /\.menu-public-shell > nav\.fixed[\s\S]*min-height:\s*2\.75rem/);
  assert.match(styles, /\.menu-public-shell > div\.sticky > div > div:last-child button[\s\S]*min-height:\s*2\.75rem/);
  assert.match(styles, /font-weight:\s*720/);
  assert.match(styles, /font-weight:\s*800/);
  assert.match(styles, /font-size:\s*0\.78rem/);
});
