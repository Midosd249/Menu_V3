import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(path, "utf8");

test("preview routes do not create a second menu shell", async () => {
  const route = await read("src/routes/m.$slug.tsx");
  const branchRoute = await read("src/routes/m.$slug.$branch.tsx");
  const publicMenu = await read("src/components/public-menu.tsx");
  assert.match(route, /PublicMenuView/);
  assert.match(branchRoute, /PublicMenuView/);
  assert.doesNotMatch(route, /menu-public-shell.*return/);
  assert.doesNotMatch(branchRoute, /menu-public-shell.*return/);
  assert.match(publicMenu, /menu-public-shell/);
});

test("published public routes do not add a route-level presentation shell", async () => {
  const route = await read("src/routes/m.$slug.tsx");
  const branchRoute = await read("src/routes/m.$slug.$branch.tsx");
  assert.doesNotMatch(route, /className=.*menu-public-shell/);
  assert.doesNotMatch(branchRoute, /className=.*menu-public-shell/);
});

test("theme controller does not clear tokens between theme changes", async () => {
  const controller = await read("src/components/menu-theme-controller.tsx");
  assert.doesNotMatch(controller, /return \(\) =>[\s\S]*removeProperty/);
});

test("public menu keeps an always-available cart entry point and shared quick actions", async () => {
  const template = await read("src/components/public-menu.tsx");
  assert.match(template, /ShoppingBag/);
  assert.match(template, /cartOpen/);
  assert.match(template, /public-action-links/);
});

test("preview menu cards keep a time-based visible final state", async () => {
  const styles = await read("src/theme-refinements-v2.css");
  assert.doesNotMatch(styles, /animation-timeline:\s*view\(/);
});

test("Essential owns one public renderer instead of duplicate template chrome", async () => {
  const template = await read("src/components/templates/small-menu.tsx");
  assert.match(template, /PublicMenuView/);
  assert.doesNotMatch(template, /<header/);
});

test("Essential refinement has deterministic light canvas, safe-area clearance, and documented overlay priority", async () => {
  const styles = await read("src/theme-essential.css");
  assert.match(styles, /background:\s*var\(--paper\)/);
  assert.match(styles, /safe-area-inset-bottom/);
  assert.match(styles, /z-index:\s*20/);
  assert.match(styles, /z-index:\s*40/);
});

test("Essential keeps touch targets and readable product hierarchy", async () => {
  const styles = await read("src/theme-essential.css");
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /product-card/);
});

test("Editorial template uses dedicated semantic regions and a single action hierarchy", async () => {
  const template = await read("src/components/templates/contemporary-restaurant.tsx");
  const styles = await read("src/theme-editorial.css");
  assert.match(template, /editorial-hero/);
  assert.match(template, /editorial-actions/);
  assert.match(styles, /editorial-hero/);
});

test("Editorial refinement prevents hero logo hijacking, unstable card transforms, and scroll-driven reveal", async () => {
  const styles = await read("src/theme-refinements-v2.css");
  assert.doesNotMatch(styles, /header\s+img/);
  assert.doesNotMatch(styles, /animation-timeline:\s*view\(/);
  assert.match(styles, /editorial-menu-card/);
});

test("language switching preserves route search state and makes missing English content explicit", async () => {
  const toggle = await read("src/components/lang-toggle.tsx");
  assert.match(toggle, /currentSearch[\s\S]*lang:\s*next\s*===\s*"en"/);
  assert.match(toggle, /englishAvailable\s*=\s*true/);
  assert.match(toggle, /disabled=\{!englishAvailable\}/);
  const route = await read("src/routes/m.$slug.tsx");
  assert.match(route, /lang:\s*z\.enum\(\["ar",\s*"en"\]\)\.optional\(\)/);
  assert.match(route, /resolvePublicMenuLocale/);
});

test("theme testing access remains server-time-bound while the production catalog is free", async () => {
  const access = await read("src/lib/theme/testing-access.ts");
  const registry = await read("src/lib/theme/registry.ts");
  assert.match(access, /MENU_THEME_TESTING_OVERRIDE/);
  assert.match(access, /MENU_THEME_TESTING_OVERRIDE_EXPIRES_AT/);
  assert.match(access, /expiry\s*>\s*now/);
  assert.match(registry, /isPremiumTheme\(_key: ThemeKey\): boolean/);
  assert.match(registry, /return false/);
});
