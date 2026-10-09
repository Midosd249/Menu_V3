import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const platformCss = await readFile(new URL("src/platform-theme.css", root), "utf8");
const homepageFixCss = await readFile(new URL("src/homepage-dark-mode-fix.css", root), "utf8");
const rootRoute = await readFile(new URL("src/routes/__root.tsx", root), "utf8");
const homepage = await readFile(new URL("src/routes/index.tsx", root), "utf8");
const footer = await readFile(new URL("src/components/marketing-footer.tsx", root), "utf8");

function luminance(hex) {
  const channels = hex.replace("#", "").match(/.{2}/g).map((part) => Number.parseInt(part, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("dark homepage menu demo is explicitly isolated from platform chrome overrides", () => {
  assert.match(homepage, /className="menuq-live-menu"/);
  assert.match(platformCss, /\.menuq-home \.menuq-live-menu,\s*html\[data-platform-theme="dark"\] \.menuq-home \.menuq-live-menu \*/);
  assert.match(homepageFixCss, /\.menuq-live-menu header\s*\{[^}]*background: #fffdf8 !important/s);
  assert.match(homepageFixCss, /\.menuq-live-menu aside\s*\{[^}]*background: #063f39 !important/s);
  assert.match(rootRoute, /homepageDarkModeFixCss/);
  for (const protectedTheme of ["essential", "signal-table", "noir", "heritage", "gallery"]) {
    const source = await readFile(new URL(`src/theme-${protectedTheme}.css`, root), "utf8");
    assert.doesNotMatch(source, /data-platform-theme/);
  }
});

test("dark homepage demo native text pairs meet WCAG AA normal-text contrast", () => {
  const pairs = [
    ["#17211d", "#fffdf8"],
    ["#505b55", "#fffdf8"],
    ["#0b5c50", "#fffdf8"],
    ["#ffffff", "#063f39"],
    ["#d0d5dd", "#171b22"],
    ["#fff7ed", "#171b22"],
  ];
  for (const [foreground, background] of pairs) {
    assert.ok(contrast(foreground, background) >= 4.5,
      `Contrast failed: ${foreground} on ${background} = ${contrast(foreground, background).toFixed(2)}:1`);
  }
});

test("dark homepage feature steps and shared footer use mapped dark text/surfaces", () => {
  assert.match(homepage, /STEPS\.map/);
  assert.match(homepageFixCss, /\.menuq-step p\s*\{[^}]*color: #d0d5dd/s);
  assert.match(homepageFixCss, /footer:not\(\.menuq-live-footer\)\s*\{[^}]*background: #171b22 !important/s);
  assert.match(homepageFixCss, /footer:not\(\.menuq-live-footer\) :is\(p, a, h2, span\)\s*\{[^}]*color: #d0d5dd/s);
  assert.match(footer, /text-ink\/55/);
});
