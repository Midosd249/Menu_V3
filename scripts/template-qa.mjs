#!/usr/bin/env node
/**
 * Browser QA gate for the public template preview.
 *
 * Usage:
 *   node scripts/template-qa.mjs [url]
 *
 * The gate is intentionally environment-agnostic: point it at a deployed
 * preview or a local build preview. It checks the rendered document rather than
 * React implementation details, so it can catch routing, hydration, RTL,
 * responsive overflow, accessible-name, and runtime-console regressions.
 */
import { chromium } from "playwright";

const baseUrl = process.argv[2] || process.env.TEMPLATE_QA_URL;
if (!baseUrl) {
  console.error("usage: node scripts/template-qa.mjs <preview-url>");
  process.exit(2);
}

const parsed = new URL(baseUrl);
const target = parsed.searchParams.has("theme")
  ? parsed
  : new URL("/themes/preview?theme=editorial", parsed.origin);

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failures = 0;
try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    const response = await page.goto(target, { waitUntil: "domcontentloaded", timeout: 45000 });
    const status = response?.status() ?? 0;
    await page.waitForTimeout(1200);

    const result = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      const overflow = Math.max(body.scrollWidth - html.clientWidth, 0);
      const unnamedButtons = [...document.querySelectorAll("button")].filter((button) => {
        const label = button.getAttribute("aria-label") || button.textContent?.trim();
        return !label;
      }).length;
      const unnamedLinks = [...document.querySelectorAll("a")].filter((link) => {
        const label = link.getAttribute("aria-label") || link.textContent?.trim();
        return !label;
      }).length;
      const dialogs = [...document.querySelectorAll('[role="dialog"]')].map((dialog) => ({
        modal: dialog.getAttribute("aria-modal"),
        labelledBy: dialog.getAttribute("aria-labelledby"),
      }));
      return {
        lang: html.getAttribute("lang"),
        dir: html.getAttribute("dir"),
        overflow,
        unnamedButtons,
        unnamedLinks,
        dialogs,
        headingCount: document.querySelectorAll("h1, h2, h3, h4, h5, h6").length,
      };
    });

    const checks = [
      ["HTTP status", status >= 200 && status < 400, String(status)],
      ["RTL document direction", result.dir === "rtl", result.dir || "missing"],
      ["document language", result.lang === "ar" || result.lang === "en", result.lang || "missing"],
      ["no horizontal overflow", result.overflow <= 1, `${result.overflow}px`],
      ["accessible button names", result.unnamedButtons === 0, String(result.unnamedButtons)],
      ["accessible link names", result.unnamedLinks === 0, String(result.unnamedLinks)],
      ["visible content headings", result.headingCount > 0, String(result.headingCount)],
      ["runtime console errors", consoleErrors.length === 0, String(consoleErrors.length)],
    ];

    for (const [name, ok, detail] of checks) {
      console.log(`${ok ? "PASS" : "FAIL"} ${viewport.name} · ${name} · ${detail}`);
      if (!ok) failures += 1;
    }

    if (viewport.name === "mobile") {
      const reducedMotion = await page.emulateMedia({ reducedMotion: "reduce" }).then(() => true).catch(() => false);
      console.log(`${reducedMotion ? "PASS" : "FAIL"} mobile · reduced-motion emulation · ${reducedMotion ? "supported" : "unsupported"}`);
      if (!reducedMotion) failures += 1;
    }

    await page.close();
  }
} finally {
  await browser.close();
}

if (failures > 0) {
  console.error(`Template QA failed with ${failures} gate failure(s).`);
  process.exit(1);
}
console.log("Template QA passed for mobile, tablet, and desktop viewports.");
