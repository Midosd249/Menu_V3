import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routes = [
  "src/routes/studio/preview.tsx",
  "src/routes/themes/preview.tsx",
];

test("preview routes do not create a second menu shell", async () => {
  const studio = await readFile(routes[0], "utf8");
  assert.equal(studio.includes('className="menu-public-shell"'), false);
  assert.match(studio, /<MenuThemeController\s/);
  assert.match(studio, /<ThemeRenderer\s/);
  assert.doesNotMatch(studio, /<TasteTemplate\s/);
  assert.doesNotMatch(studio, /<ContemporaryRestaurantTemplate\s/);
  assert.doesNotMatch(studio, /<PublicMenuView\s/);

  const themes = await readFile(routes[1], "utf8");
  assert.equal(themes.includes('className="menu-public-shell"'), false);
  assert.match(themes, /<MenuThemeController\s/);
  assert.match(themes, /<ThemeRenderer\s/);
  assert.doesNotMatch(themes, /<ContemporaryRestaurantTemplate\s/);
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
  assert.match(source, /aria-label=\{label\(lang, `السلة،/);
  assert.match(source, /setCartOpen\(true\)/);
  assert.match(source, /branch\.mapsUrl/);
  assert.match(source, /branch\.phone/);
});

test("public menu keeps the lazy media baseline while Editorial prefetches product images", async () => {
  const source = await readFile("src/components/public-menu.tsx", "utf8");
  assert.match(source, /document\.documentElement\.dataset\.menuTheme === "editorial"/);
  assert.match(source, /new Image\(\)/);
  assert.match(source, /preload\.src = product\.imageUrl/);
  assert.match(source, /loading="lazy"/);
  assert.match(source, /fetchPriority="low"/);
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
  assert.match(styles, /bottom:\s*max\(0\.75rem, env\(safe-area-inset-bottom, 0px\)/);
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

test("SIGNAL TABLE owns dedicated semantic regions and one public action hierarchy", async () => {
  const source = await readFile("src/components/templates/signal-table.tsx", "utf8");
  assert.match(source, /data-signal-root="true"/);
  assert.match(source, /className="signal-hero"/);
  assert.match(source, /className="signal-actions-wrap"/);
  assert.match(source, /<PublicActionLinks\s/);
  assert.match(source, /className="signal-search"/);
  assert.match(source, /className="signal-product-card"/);
  assert.match(source, /className="signal-cart-trigger"/);
  assert.match(source, /isPublicMenuLocaleAvailable\(menu, "en"\)/);
});

test("SIGNAL TABLE replaces the Canvas presentation without scroll-driven animation", async () => {
  const styles = await readFile("src/theme-signal-table.css", "utf8");
  const template = await readFile("src/components/templates/signal-table.tsx", "utf8");
  assert.match(styles, /signal-brand-logo[\s\S]*object-fit:\s*contain/);
  assert.match(styles, /signal-product-card[\s\S]*min-inline-size:\s*0/);
  assert.doesNotMatch(styles, /animation-timeline:\s*view\(/);
  assert.doesNotMatch(styles, /counter-(reset|increment)/);
  assert.match(template, /fixed inset-0 z-\[60\]/);
  assert.match(template, /fixed inset-0 z-\[70\]/);
  assert.match(styles, /safe-area-inset-bottom/);
});

test("language switching preserves route search state and makes missing English content explicit", async () => {
  const toggle = await readFile("src/components/lang-toggle.tsx", "utf8");
  assert.match(toggle, /currentSearch[\s\S]*lang:\s*next\s*===\s*"en"/);
  assert.match(toggle, /englishAvailable\s*=\s*true/);
  assert.match(toggle, /englishDisabled\s*=\s*disabled\s*\|\|\s*!englishAvailable/);
  assert.match(toggle, /disabled=\{englishDisabled\}/);
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

test("W16 hardening keeps mobile content above the fixed action area and safe-area", async () => {
  const styles = await readFile("src/theme-w16-mobile-qr-hardening.css", "utf8");
  assert.match(styles, /main\s*\{[\s\S]*padding-bottom:\s*calc\(8rem \+ env\(safe-area-inset-bottom, 0px\)\)/);
  assert.match(styles, /nav\.fixed\s*\{[\s\S]*z-index:\s*40/);
  assert.match(styles, /scroll-margin-bottom:\s*calc\(6rem \+ env\(safe-area-inset-bottom, 0px\)/);
});

test("W16 hardening protects Arabic word boundaries, Noir hours contrast, and Gallery card height", async () => {
  const styles = await readFile("src/theme-w16-mobile-qr-hardening.css", "utf8");
  assert.match(styles, /word-break:\s*normal/);
  assert.match(styles, /hyphens:\s*none/);
  assert.match(styles, /data-menu-theme="noir"[\s\S]*hours-heading[\s\S]*#171411/);
  assert.match(styles, /data-menu-theme="gallery"[\s\S]*main ul > li > button[\s\S]*height:\s*100%/);
  assert.match(styles, /overflow:\s*visible/);
});

test("SIGNAL TABLE keeps the mobile language control visible and removes the old featured-selection block", async () => {
  const styles = await readFile("src/theme-signal-table.css", "utf8");
  const signal = await readFile("src/components/templates/signal-table.tsx", "utf8");
  assert.doesNotMatch(styles, /@media\(max-width:760px\)[\s\S]*?\.signal-topbar-lang\{display:none\}/);
  assert.doesNotMatch(signal, /className="signal-selection"/);
  assert.match(signal, /className="signal-topbar-lang"/);
});

test("W16 QR generation uses the configured production public origin and a stable language-control hook", async () => {
  const qr = await readFile("src/routes/studio/qr.tsx", "utf8");
  const toggle = await readFile("src/components/lang-toggle.tsx", "utf8");
  assert.match(qr, /getPublicOrigin/);
  assert.match(qr, /setOrigin\(getPublicOrigin\(\) \|\| window\.location\.origin\)/);
  assert.match(qr, /menuUrl\(origin, snapshot\.tenant\.slug, b\.slug\)/);
  assert.match(toggle, /menu-lang-toggle/);
  const signal = await readFile("src/components/templates/signal-table.tsx", "utf8");
  assert.match(signal, /SignalLanguageControl/);
  assert.match(signal, /data-language-switcher="true"/);
  assert.match(signal, /🇸🇦/);
  assert.match(signal, /🇬🇧/);
  assert.match(signal, /Switch to English/);
});

test("W16 removes the legacy Editorial volume label from the active refinement layer", async () => {
  const styles = await readFile("src/theme-refinements.css", "utf8");
  assert.doesNotMatch(styles, /VOL\.\s*03\s*[—-]\s*THE TABLE/);
});
