import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

const css = await readFile(new URL("../src/colors.css", import.meta.url), "utf8");

const requiredRoles = [
  "surface-canvas",
  "surface-primary",
  "surface-secondary",
  "surface-elevated",
  "surface-inverse",
  "content-primary",
  "content-secondary",
  "content-muted",
  "content-inverse",
  "border-subtle",
  "border-strong",
  "action-primary",
  "action-primary-hover",
  "action-primary-foreground",
  "action-secondary",
  "action-secondary-hover",
  "action-secondary-foreground",
  "focus-ring",
  "status-success",
  "status-warning",
  "status-danger",
  "status-info",
  "disabled-surface",
  "disabled-content",
  "disabled-border",
  "interactive-hover",
  "interactive-active",
  "interactive-selected",
];

const themes = ["essential", "editorial", "noir", "heritage", "gallery"];

function parseHex(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255);
}

function linearize(channel) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [r, g, b] = parseHex(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("semantic color contract declares every required role", () => {
  for (const role of requiredRoles) {
    assert.match(css, new RegExp(`--color-${role}\\s*:`), `missing semantic role: ${role}`);
  }
});

test("all protected themes adapt semantic meaning without redefining status semantics", () => {
  for (const theme of themes) {
    assert.match(css, new RegExp(`data-menu-theme="${theme}"`), `missing adapter for ${theme}`);
  }

  assert.match(css, /--color-status-success:\s*#2f6b4f/);
  assert.match(css, /--color-status-warning:\s*#8a5a1f/);
  assert.match(css, /--color-status-danger:\s*#9a3b32/);
  assert.match(css, /--color-status-info:\s*#315f7a/);

  for (const status of ["success", "warning", "danger", "info"]) {
    const themeStatusDefinitions = css.match(new RegExp(`--color-status-${status}\\s*:`, "g")) ?? [];
    assert.equal(themeStatusDefinitions.length, 1, `status.${status} must remain semantic and theme-independent`);
  }
});

test("default critical palette meets WCAG AA contrast targets", () => {
  assert.ok(contrast("#171411", "#f3eee6") >= 4.5);
  assert.ok(contrast("#7f3f2b", "#fffaf4") >= 4.5);
  assert.ok(contrast("#2f6b4f", "#fffdf9") >= 4.5);
  assert.ok(contrast("#8a5a1f", "#fffdf9") >= 4.5);
  assert.ok(contrast("#9a3b32", "#fffdf9") >= 4.5);
  assert.ok(contrast("#315f7a", "#fffdf9") >= 4.5);
  assert.ok(contrast("#c79a67", "#0b0a09") >= 3);
});

test("interaction safety rules are explicit", () => {
  assert.match(css, /:focus-visible[^{]*\{/);
  assert.match(css, /outline:\s*2px\s+solid\s+var\(--color-focus-ring\)/);
  assert.match(css, /aria-disabled/);
  assert.match(css, /:disabled/);
  assert.match(css, /prefers-contrast:\s*more/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /::placeholder/);
});


const platformThemeCss = await readFile(new URL("../src/platform-theme.css", import.meta.url), "utf8");
const themeToggleSource = await readFile(new URL("../src/components/theme-toggle.tsx", import.meta.url), "utf8");
const rootSource = await readFile(new URL("../src/routes/__root.tsx", import.meta.url), "utf8");

test("platform dark palette meets WCAG AA text contrast on all core surfaces", () => {
  const pairs = [
    ["#FFF7ED", "#0F1115"],
    ["#FFF7ED", "#171B22"],
    ["#D0D5DD", "#0F1115"],
    ["#D0D5DD", "#171B22"],
    ["#A7AFBA", "#0F1115"],
    ["#A7AFBA", "#171B22"],
    ["#FF5A1F", "#0F1115"],
    ["#FF5A1F", "#171B22"],
    ["#1FD1A5", "#0F1115"],
    ["#1FD1A5", "#171B22"],
    ["#0F1115", "#FF5A1F"],
    ["#0F1115", "#1FD1A5"],
  ];
  for (const [foreground, background] of pairs) {
    assert.ok(
      contrast(foreground, background) >= 4.5,
      `contrast failed for ${foreground} on ${background}: ${contrast(foreground, background).toFixed(2)}:1`,
    );
  }
});

test("platform theme is scoped away from restaurant-owned public menu themes", async () => {
  assert.match(platformThemeCss, /data-platform-theme="dark"/);
  assert.match(platformThemeCss, /:not\(:has\(\.menu-public-shell\)\)/);
  assert.match(platformThemeCss, /:not\(\.menu-public-shell\)/);
  for (const themeFile of [
    "../src/theme-essential.css",
    "../src/theme-signal-table.css",
    "../src/theme-noir.css",
    "../src/theme-heritage.css",
    "../src/theme-gallery.css",
  ]) {
    const source = await readFile(new URL(themeFile, import.meta.url), "utf8");
    assert.doesNotMatch(source, /data-platform-theme/, `${themeFile} must remain independent of platform mode`);
  }
});

test("platform theme preference follows the language preference storage pattern", () => {
  assert.match(themeToggleSource, /const STORAGE_KEY = "menu-theme"/);
  assert.match(themeToggleSource, /localStorage\.getItem\(STORAGE_KEY\)/);
  assert.match(themeToggleSource, /localStorage\.setItem\(STORAGE_KEY, nextDark \? "dark" : "light"\)/);
  assert.match(themeToggleSource, /prefers-color-scheme:\s*dark/);
  assert.match(themeToggleSource, /Switch to dark mode/);
  assert.match(themeToggleSource, /التبديل إلى الوضع الداكن/);
  assert.match(rootSource, /localStorage\.getItem\("menu-theme"\)/);
  assert.match(rootSource, /data-platform-theme/);
});

test("platform chrome toggle is present on Studio, marketing, auth, pricing and legal routes", async () => {
  for (const path of [
    "../src/components/studio-shell.tsx",
    "../src/routes/index.tsx",
    "../src/routes/login.tsx",
    "../src/routes/pricing.tsx",
    "../src/routes/terms.tsx",
    "../src/routes/privacy.tsx",
  ]) {
    const source = await readFile(new URL(path, import.meta.url), "utf8");
    assert.match(source, /ThemeToggle/, `${path} must expose the platform theme toggle`);
    assert.match(source, /data-platform-chrome/, `${path} must opt into platform theme tokens`);
  }
});
