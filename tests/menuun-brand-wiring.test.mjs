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
  const studio = read("src/components/studio-shell.tsx");
  const publicRoute = read("src/routes/m.$slug.tsx");
  const poweredBy = read("src/components/menuun-powered-by.tsx");

  assert.ok(root.includes("Menuun"));
  assert.ok(root.includes('href: "/favicon.svg"'));
  assert.ok(!root.includes("__grok/icon-180.png"));
  assert.ok(home.includes("MenuunLogo"));
  assert.ok(home.includes("lang={lang}"));
  assert.ok(!home.includes("Menu V3"));
  assert.ok(footer.includes("MenuunLogo"));
  assert.ok(footer.includes("ahmed.mohamed@menuun.com"));
  assert.ok(footer.includes("966549598318"));
  assert.ok(footer.includes("Pricing"));
  assert.ok(footer.includes("new Date().getFullYear()"));
  assert.ok(!footer.includes("Menu V3"));
  assert.ok(logo.includes("menuun-logo-ar.svg"));
  assert.ok(logo.includes("menuun-logo-en.svg"));
  assert.ok(logo.includes("منيو رقمي للمطاعم والكافيهات"));
  assert.ok(favicon.includes("#0F1115"));
  assert.ok(favicon.includes('viewBox="264 1741 1955 1885"'));
  assert.ok(studio.includes("MenuunLogo"));
  assert.ok(studio.includes('aria-label="Menuun"'));
  assert.ok(publicRoute.includes("MenuunPoweredBy"));
  assert.ok(poweredBy.includes("bg-[#0F1115]"));
  assert.ok(poweredBy.includes("مقدم من"));
  assert.ok(poweredBy.includes("Powered by"));
});

test("customer-facing brand surfaces no longer expose the retired Menu V3 name", () => {
  const surfaces = [
    "src/routes/index.tsx",
    "src/routes/login.tsx",
    "src/routes/onboarding.tsx",
    "src/routes/themes/index.tsx",
    "src/routes/invite.$token.tsx",
    "src/routes/studio/billing.tsx",
    "src/components/marketing-footer.tsx",
    "src/components/studio-shell.tsx",
    "src/components/studio-menu-workspace-page.tsx",
    "src/lib/menu/reports.ts",
    "src/lib/menu/platform.ts",
    "src/lib/menu/ai-whatsapp.ts",
    "src/lib/menu/billing-whatsapp.ts",
  ];
  for (const path of surfaces) assert.doesNotMatch(read(path), /Menu V3|MenuV3/i, path);
});
