import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/colors.css", import.meta.url), "utf8");

const requiredRoles = [
  "--internal-app-background",
  "--internal-surface",
  "--internal-surface-elevated",
  "--internal-surface-subtle",
  "--internal-primary",
  "--internal-primary-hover",
  "--internal-primary-muted",
  "--internal-on-primary",
  "--internal-secondary",
  "--internal-accent",
  "--internal-accent-muted",
  "--internal-on-surface",
  "--internal-on-muted",
  "--internal-border",
  "--internal-border-strong",
  "--internal-focus-ring",
  "--internal-success",
  "--internal-success-surface",
  "--internal-on-success",
  "--internal-warning",
  "--internal-warning-surface",
  "--internal-on-warning",
  "--internal-danger",
  "--internal-danger-surface",
  "--internal-on-danger",
  "--internal-info",
  "--internal-info-surface",
  "--internal-on-info",
  "--internal-disabled",
  "--internal-disabled-surface",
  "--internal-disabled-border",
  "--internal-overlay",
];

const hex = (value) => {
  const match = value.match(/^#([0-9a-f]{6})$/i);
  assert.ok(match, `Expected a six-digit hex color: ${value}`);
  const channels = [0, 2, 4].map((index) => Number.parseInt(match[1].slice(index, index + 2), 16) / 255);
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};

const contrast = (foreground, background) => {
  const foregroundLum = hex(foreground);
  const backgroundLum = hex(background);
  const [lighter, darker] = [foregroundLum, backgroundLum].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

test("W8 internal visual system defines the complete semantic role layer", () => {
  for (const role of requiredRoles) assert.ok(css.includes(`${role}:`), `Missing internal role ${role}`);
  assert.match(css, /body:has\(\[role="banner"\]\)/);
  assert.match(css, /body:has\(aside\[aria-label="تنقل إدارة المنصة"\]\)/);
});

test("W8 internal palette meets the required contrast targets", () => {
  const pairs = [
    ["#1d2421", "#fbf8f2", 4.5, "primary text on surface"],
    ["#36403b", "#fbf8f2", 4.5, "secondary text on surface"],
    ["#5e655f", "#fbf8f2", 4.5, "muted text on surface"],
    ["#246044", "#fbf8f2", 4.5, "success on surface"],
    ["#7a5218", "#fbf8f2", 4.5, "warning on surface"],
    ["#9a3b32", "#fbf8f2", 4.5, "danger on surface"],
    ["#2d5c76", "#fbf8f2", 4.5, "info on surface"],
    ["#ffffff", "#1f2522", 4.5, "on-primary on primary"],
    ["#8b642e", "#fbf8f2", 3, "accent UI on surface"],
  ];
  for (const [foreground, background, minimum, label] of pairs) {
    assert.ok(contrast(foreground, background) >= minimum, `${label} contrast is below ${minimum}: ${contrast(foreground, background).toFixed(2)}`);
  }
});

test("W8 internal visual layer is isolated from Public Menu theme adapters", () => {
  const internalStart = css.indexOf("/*\n * W8 — Internal Visual System");
  assert.ok(internalStart > 0, "W8 internal layer marker is missing");
  const publicLayer = css.slice(0, internalStart);
  for (const theme of ["essential", "editorial", "noir", "heritage", "gallery"]) {
    assert.match(publicLayer, new RegExp(`data-menu-theme=\\\"${theme}\\\"`), `Missing protected ${theme} adapter`);
  }
  const internalLayer = css.slice(internalStart);
  assert.doesNotMatch(internalLayer, /html\[data-menu-theme=/, "W8 must not introduce Public Menu theme selectors");
  assert.doesNotMatch(internalLayer, /\.menu-public-shell/, "W8 must not target Public Menu shell selectors");
});

test("W8 preserves semantic status separation from the primary brand color", () => {
  const internalBlock = css.slice(css.indexOf("/*\n * W8 — Internal Visual System"));
  assert.match(internalBlock, /--internal-success:\s*#246044/);
  assert.match(internalBlock, /--internal-warning:\s*#7a5218/);
  assert.match(internalBlock, /--internal-danger:\s*#9a3b32/);
  assert.match(internalBlock, /--internal-info:\s*#2d5c76/);
  assert.match(internalBlock, /\.status-success/);
  assert.match(internalBlock, /\.status-warning/);
  assert.match(internalBlock, /\.status-danger/);
  assert.match(internalBlock, /\.status-info/);
});

test("W8 keeps interaction and responsive safeguards in the internal layer", () => {
  const internalBlock = css.slice(css.indexOf("/*\n * W8 — Internal Visual System"));
  assert.match(internalBlock, /:focus-visible/);
  assert.match(internalBlock, /prefers-contrast: more/);
  assert.match(internalBlock, /prefers-reduced-motion: reduce/);
  assert.match(internalBlock, /nav\[aria-label="تنقل مساحة العمل على الهاتف"\]/);
  assert.match(internalBlock, /min-height: 2\.75rem/);
});
