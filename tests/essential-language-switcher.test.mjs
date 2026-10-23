import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Essential language selector has explicit, correctly scoped contrast states", async () => {
  const styles = await readFile("src/theme-essential.css", "utf8");

  assert.match(
    styles,
    /^html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle\s*\{[^}]*background:\s*var\(--essential-surface\)/ms,
  );
  assert.match(
    styles,
    /^html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle button\s*\{[^}]*color:\s*var\(--essential-muted\)/ms,
  );
  assert.match(
    styles,
    /^html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle button\[aria-pressed="true"\]\s*\{[^}]*background:\s*var\(--essential-ink\)[^}]*color:\s*var\(--essential-surface\)/ms,
  );
  assert.match(
    styles,
    /^html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle button:focus-visible\s*\{[^}]*outline:/m,
  );
  assert.match(
    styles,
    /^html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle button:hover:not\(\[aria-pressed="true"\]\)/m,
  );
  assert.match(
    styles,
    /^html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle button\[aria-pressed="true"\]:hover/m,
  );

  assert.doesNotMatch(
    styles,
    /header html\[data-menu-theme="essential"\] \.menu-public-shell header \.menu-lang-toggle/,
  );

  const genericHover = styles.indexOf(
    'html[data-menu-theme="essential"] .menu-public-shell header button:hover,',
  );
  const selectorSurface = styles.indexOf(
    'html[data-menu-theme="essential"] .menu-public-shell header .menu-lang-toggle {',
  );
  assert.ok(genericHover >= 0 && selectorSurface > genericHover, "selector state rules must follow generic hero hover/focus rules");
});
