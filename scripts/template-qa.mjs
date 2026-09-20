#!/usr/bin/env node
/**
 * Browser QA gate for the public template preview.
 *
 * Usage:
 *   node scripts/template-qa.mjs [preview-url] [--all-themes]
 *
 * The gate is intentionally environment-agnostic: point it at a deployed
 * preview or a local build preview. It checks the rendered document rather than
 * React implementation details, so it can catch routing, hydration, RTL,
 * responsive overflow, accessible-name, theme resolution, and runtime-console regressions.
 */
import { chromium } from "playwright";

const args = process.argv.slice(2);
const allThemes = args.includes("--all-themes") || process.env.TEMPLATE_QA_ALL_THEMES === "1";
const baseUrl = args.find((value) => !value.startsWith("--")) || process.env.TEMPLATE_QA_URL;
if (!baseUrl) {
  console.error("usage: node scripts/template-qa.mjs <preview-url> [--all-themes]");
  process.exit(2);
}

const parsed = new URL(baseUrl);
const requestedTheme = parsed.searchParams.get("theme") || "editorial";
const themes = allThemes ? ["essential", "editorial", "noir", "heritage", "gallery"] : [requestedTheme];
const viewports = [
  { name: "small-mobile-320", width: 320, height: 800 },
  { name: "small-mobile-360", width: 360, height: 800 },
  { name: "small-mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-landscape-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failures = 0;
try {
  for (const theme of themes) {
    const languages = theme === "editorial" ? ["ar", "en"] : ["ar"];
    for (const language of languages) {
      const targetUrl = new URL(parsed);
      targetUrl.searchParams.set("theme", theme);
      targetUrl.searchParams.set("lang", language);
      console.log(`THEME ${theme} · LANG ${language}`);

      for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));

      const response = await page.goto(targetUrl.toString(), { waitUntil: "domcontentloaded", timeout: 45000 });
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
        const productCards = [...document.querySelectorAll(".signal-product-card")].map((card) => {
          const media = card.querySelector(".signal-product-image");
          const copy = card.querySelector(".signal-product-copy");
          const title = card.querySelector(".signal-product-name");
          const description = card.querySelector(".signal-product-description");
          const price = card.querySelector(".signal-product-price");
          const action = card.closest(".signal-product-card-wrap")?.querySelector(".signal-quick-add");
          const mediaRect = media?.getBoundingClientRect();
          const copyRect = copy?.getBoundingClientRect();
          const titleRect = title?.getBoundingClientRect();
          const descriptionRect = description?.getBoundingClientRect();
          const priceRect = price?.getBoundingClientRect();
          const priceStyle = price ? getComputedStyle(price) : null;
          const cardRect = card.getBoundingClientRect();
          return {
            mediaSquare: Boolean(mediaRect && Math.abs(mediaRect.width - 92) <= 1 && Math.abs(mediaRect.height - 92) <= 1),
            copyProtected: Boolean(copyRect && copyRect.width >= 130 && getComputedStyle(copy).minInlineSize === "0"),
            titleReadableWidth: Boolean(titleRect && titleRect.width >= 130),
            priceBelowDescription: Boolean(!descriptionRect || !priceRect || priceRect.top >= descriptionRect.bottom - 1),
            priceNoWrap: Boolean(priceStyle?.whiteSpace === "nowrap" && price && price.scrollWidth <= price.clientWidth + 1),
            actionDoesNotOverlapCard: Boolean(!action?.getBoundingClientRect || !cardRect || action.getBoundingClientRect().top >= cardRect.bottom - 1),
          };
        });
        return {
          lang: html.getAttribute("lang"),
          dir: html.getAttribute("dir"),
          theme: html.dataset.menuTheme,
          background: getComputedStyle(html).getPropertyValue("--menu-background").trim(),
          overflow,
          unnamedButtons,
          unnamedLinks,
          dialogs,
          headingCount: document.querySelectorAll("h1, h2, h3, h4, h5, h6").length,
          productCards,
        };
      });

      const checks = [
        ["HTTP status", status >= 200 && status < 400, String(status)],
        ["resolved theme", result.theme === theme, result.theme || "missing"],
        ["theme tokens", result.background.length > 0, result.background || "missing"],
        ["document direction", language === "ar" ? result.dir === "rtl" : result.dir === "ltr", result.dir || "missing"],
        ["document language", result.lang === language, result.lang || "missing"],
        ["no horizontal overflow", result.overflow <= 1, `${result.overflow}px`],
        ["accessible button names", result.unnamedButtons === 0, String(result.unnamedButtons)],
        ["accessible link names", result.unnamedLinks === 0, String(result.unnamedLinks)],
        ["visible content headings", result.headingCount > 0, String(result.headingCount)],
        ["runtime console errors", consoleErrors.length === 0, String(consoleErrors.length)],
      ];

      if (theme === "editorial") {
        const cards = result.productCards;
        checks.push(
          ["SIGNAL TABLE product cards present", cards.length > 0, String(cards.length)],
          ["SIGNAL TABLE fixed square media", cards.every((card) => card.mediaSquare), String(cards.filter((card) => !card.mediaSquare).length)],
          ["SIGNAL TABLE protected text width", cards.every((card) => card.copyProtected && card.titleReadableWidth), String(cards.filter((card) => !card.copyProtected || !card.titleReadableWidth).length)],
          ["SIGNAL TABLE price below description", cards.every((card) => card.priceBelowDescription), String(cards.filter((card) => !card.priceBelowDescription).length)],
          ["SIGNAL TABLE price no-wrap", cards.every((card) => card.priceNoWrap), String(cards.filter((card) => !card.priceNoWrap).length)],
          ["SIGNAL TABLE action does not overlap", cards.every((card) => card.actionDoesNotOverlapCard), String(cards.filter((card) => !card.actionDoesNotOverlapCard).length)],
        );
      }

      for (const [name, ok, detail] of checks) {
        console.log(`${ok ? "PASS" : "FAIL"} ${theme} · ${viewport.name} · ${name} · ${detail}`);
        if (!ok) failures += 1;
      }

      if (consoleErrors.length > 0) {
        for (const [index, error] of consoleErrors.entries()) {
          console.error(`CONSOLE_ERROR ${theme} · ${viewport.name} · ${index + 1} · ${error}`);
        }
      }

      if (viewport.name === "mobile-390") {
        const reducedMotion = await page.emulateMedia({ reducedMotion: "reduce" }).then(() => true).catch(() => false);
        console.log(`${reducedMotion ? "PASS" : "FAIL"} ${theme} · ${language} · mobile-390 · reduced-motion emulation · ${reducedMotion ? "supported" : "unsupported"}`);
        if (!reducedMotion) failures += 1;
      }

        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

if (failures > 0) {
  console.error(`Template QA failed with ${failures} gate failure(s).`);
  process.exit(1);
}
console.log(`Template QA passed for ${themes.length} theme(s) across the full W7.10 viewport matrix; Editorial was verified in Arabic RTL and English LTR.`);
