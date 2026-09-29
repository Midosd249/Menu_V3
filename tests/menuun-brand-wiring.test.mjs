import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Menuun runtime brand assets are wired to the platform chrome", () => {
  const root = read("src/routes/__root.tsx");
  const home = read("src/routes/index.tsx");
  const footer = read("src/components/marketing-footer.tsx");
  const logo = read("src/components/menuun-logo.tsx");
  const favicon = read("public/favicon.svg");

  assert.ok(root.includes("Menuun"));
  assert.ok(root.includes('href: "/favicon.svg"'));
  assert.ok(!root.includes("__grok/icon-180.png"));

  assert.ok(home.includes("MenuunLogo"));
  assert.ok(home.includes('lang={lang}'));
  assert.ok(!home.includes('className="font-semibold tracking-tight">\\n            Menu V3'));

  assert.ok(footer.includes("MenuunLogo"));
  assert.ok(!footer.includes('className="font-display text-xl font-semibold">Menu V3'));

  assert.ok(logo.includes("menuun-logo-ar.svg"));
  assert.ok(logo.includes("menuun-logo-en.svg"));
  assert.ok(logo.includes("منيو رقمي للمطاعم والكافيهات"));

  assert.ok(favicon.includes("#0F1115"));
  assert.ok(favicon.includes('viewBox="264 1741 1955 1885"'));
});
