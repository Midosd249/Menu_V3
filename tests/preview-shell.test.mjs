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

test("Editorial template uses dedicated semantic regions and a single action hierarchy", async () => {
  const source = await readFile("src/components/templates/contemporary-restaurant.tsx", "utf8");
  assert.match(source, /data-editorial-root="true"/);
  assert.match(source, /className="editorial-hero"/);
  assert.match(source, /className="editorial-actions-wrap"/);
  assert.match(source, /<PublicActionLinks\s/);
  assert.match(source, /className="editorial-search"/);
  assert.match(source, /className="editorial-product-card"/);
  assert.match(source, /className="editorial-cart-trigger"/);
  assert.match(source, /isPublicMenuLocaleAvailable\(menu, "en"\)/);
});

test("Editorial refinement prevents hero logo hijacking, unstable card transforms, and scroll-driven reveal", async () => {
  const styles = await readFile("src/theme-editorial.css", "utf8");
  const template = await readFile("src/components/templates/contemporary-restaurant.tsx", "utf8");
  assert.match(styles, /\.editorial-brand-logo[\s\S]*position:\s*relative\s*!important/);
  assert.match(styles, /\.editorial-product-card[\s\S]*transform:\s*none\s*!important/);
  assert.match(styles, /\.editorial-product-image[\s\S]*animation:\s*none\s*!important/);
  assert.doesNotMatch(styles, /animation-timeline:\s*view\(/);
  assert.match(styles, /editorial-cart-trigger[\s\S]*z-index:\s*40/);
  assert.match(styles, /editorial-dialog\s*,[\s\S]*editorial-cart[\s\S]*border:/);
  assert.match(template, /fixed inset-0 z-\[60\]/);
  assert.match(template, /fixed inset-0 z-\[70\]/);
  assert.match(styles, /safe-area-inset-bottom/);
});

test("language switching preserves route search state and makes missing English content explicit", async () => {
  const toggle = await readFile("src/components/lang-toggle.tsx", "utf8");
  assert.match(toggle, /currentSearch[\s\S]*lang:\s*next\s*===\s*"en"/);
  assert.match(toggle, /englishAvailable\s*=\s*true/);
  assert.match(toggle, /disabled=\{!englishAvailable\}/);
  const route = await readFile("src/routes/m.$slug.tsx", "utf8");
  assert.match(route, /lang:\s*z\.enum\(\["ar",\s*"en"\]\)\.optional\(\)/);
  assert.match(route, /resolvePublicMenuLocale/);
});

test("theme testing access remains server-time-bound while the production catalog is free", async () => {
  const access = await readFile("src/lib/theme/testing-access.ts", "utf8");
  const registry = await readFile("src/lib/theme/registry.ts", "utf8");
  assert.match(access, /MENU_THEME_TESTING_OVERRIDE/);
  assert.match(access, /MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT/);
  assert.match(access, /expiry\s*>\s*now/);
  assert.match(registry, /isPremiumTheme\(_key: ThemeKey\): boolean/);
  assert.match(registry, /return false/);
});
