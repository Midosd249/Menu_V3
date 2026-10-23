import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Essential language selector overrides hero button colors with readable surface and explicit states", async () => {
  const styles = await readFile("src/theme-essential.css", "utf8");
  assert.match(styles, /html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle\s*\{[^}]*background:\s*var\(--essential-surface\)/s);
  assert.match(styles, /html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle button\s*\{[^}]*color:\s*var\(--essential-muted\)/s);
  assert.match(styles, /\.menu-lang-toggle button\[aria-pressed="true"\]\s*\{[^}]*background:\s*var\(--essential-ink\)[^}]*color:\s*var\(--essential-surface\)/s);
  assert.match(styles, /\.menu-lang-toggle button:focus-visible\s*\{[^}]*outline:/s);
  assert.match(styles, /html\[data-menu-theme="essential"\]/);
});
