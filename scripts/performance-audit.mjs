#!/usr/bin/env node
/**
 * Reproducible browser performance measurement for the built public menu.
 *
 * Usage:
 *   node scripts/performance-audit.mjs [url]
 *
 * The gate is intentionally report-only for numeric performance budgets. It
 * captures a real baseline first; later G6 work may introduce evidence-based
 * budgets without guessing at thresholds.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const targetUrl = process.argv[2] || process.env.PERFORMANCE_AUDIT_URL;
const outputPath = process.env.PERFORMANCE_AUDIT_OUTPUT || ".grok/performance-audit.json";

if (!targetUrl) {
  console.error("usage: node scripts/performance-audit.mjs <preview-url>");
  process.exit(2);
}

let target;
try {
  target = new URL(targetUrl);
} catch {
  console.error(`invalid performance audit URL: ${targetUrl}`);
  process.exit(2);
}

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const response = await page.goto(target.toString(), {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(1200);

  const result = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource").map((entry) => {
      const resource = entry;
      const name = resource.name;
      const transferSize = Number(resource.transferSize || 0);
      const decodedBodySize = Number(resource.decodedBodySize || 0);
      const encodedBodySize = Number(resource.encodedBodySize || 0);
      const lowerName = name.split("?", 1)[0].toLowerCase();
      const isFont = /\.(woff2?|ttf|otf|eot)$/.test(lowerName);
      const isScript = resource.initiatorType === "script";
      const isImage = resource.initiatorType === "img" || resource.initiatorType === "image";
      return {
        name,
        initiatorType: resource.initiatorType,
        transferSize,
        decodedBodySize,
        encodedBodySize,
        isFont,
        isScript,
        isImage,
        cached: transferSize === 0 && decodedBodySize > 0,
      };
    });

    const navigation = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");
    const lcpEntries = [];
    const clsEntries = [];
    const inpEntries = [];

    try {
      const observer = new PerformanceObserver((list) => lcpEntries.push(...list.getEntries()));
      observer.observe({ type: "largest-contentful-paint", buffered: true });
      observer.disconnect();
    } catch {}

    try {
      const observer = new PerformanceObserver((list) => clsEntries.push(...list.getEntries()));
      observer.observe({ type: "layout-shift", buffered: true });
      observer.disconnect();
    } catch {}

    let inpSupported = false;
    try {
      const observer = new PerformanceObserver((list) => inpEntries.push(...list.getEntries()));
      observer.observe({ type: "event", buffered: true, durationThreshold: 40 });
      inpSupported = true;
      observer.disconnect();
    } catch {}

    const lcp = lcpEntries.reduce((max, entry) => Math.max(max, entry.startTime || 0), 0);
    const cls = clsEntries.reduce(
      (sum, entry) => sum + (entry.hadRecentInput ? 0 : Number(entry.value || 0)),
      0,
    );
    const interactions = new Map();
    for (const entry of inpEntries) {
      const interactionId = Number(entry.interactionId || 0);
      if (!interactionId) continue;
      const duration = Number(entry.duration || 0);
      interactions.set(interactionId, Math.max(interactions.get(interactionId) || 0, duration));
    }
    const interactionDurations = [...interactions.values()].sort((a, b) => a - b);
    const inp = interactionDurations.length
      ? interactionDurations[Math.min(interactionDurations.length - 1, Math.floor(interactionDurations.length * 0.98))]
      : null;

    const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);
    const js = resources.filter((item) => item.isScript);
    const images = resources.filter((item) => item.isImage);
    const fonts = resources.filter((item) => item.isFont);
    const cached = resources.filter((item) => item.cached);
    const lazyImages = [...document.images].filter((image) => image.loading === "lazy").length;

    return {
      measuredAt: new Date().toISOString(),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      navigation: navigation
        ? {
            dnsMs: Math.max(0, navigation.domainLookupEnd - navigation.domainLookupStart),
            connectionMs: Math.max(0, navigation.connectEnd - navigation.connectStart),
            requestMs: Math.max(0, navigation.responseStart - navigation.requestStart),
            responseMs: Math.max(0, navigation.responseEnd - navigation.responseStart),
            domContentLoadedMs: navigation.domContentLoadedEventEnd,
            loadEventMs: navigation.loadEventEnd,
          }
        : null,
      coreWebVitals: {
        lcpMs: lcp || null,
        cls,
        inpMs: inp,
        inpSupported,
      },
      transfer: {
        resourceCount: resources.length,
        js: {
          requestCount: js.length,
          transferBytes: sum(js, "transferSize"),
          decodedBytes: sum(js, "decodedBodySize"),
        },
        images: {
          requestCount: images.length,
          transferBytes: sum(images, "transferSize"),
          decodedBytes: sum(images, "decodedBodySize"),
        },
        fonts: {
          requestCount: fonts.length,
          transferBytes: sum(fonts, "transferSize"),
          decodedBytes: sum(fonts, "decodedBodySize"),
        },
      },
      media: {
        documentImageCount: document.images.length,
        lazyImageCount: lazyImages,
      },
      cache: {
        observable: true,
        resourcesWithBody: resources.filter((item) => item.decodedBodySize > 0).length,
        cachedResourceCount: cached.length,
        cachedTransferBytes: sum(cached, "transferSize"),
      },
      firstPaintMs: paint.find((entry) => entry.name === "first-paint")?.startTime || null,
      firstContentfulPaintMs:
        paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || null,
    };
  });

  const status = response?.status() ?? 0;
  const payload = {
    schemaVersion: 1,
    url: target.toString(),
    httpStatus: status,
    ok: status >= 200 && status < 400,
    ...result,
  };

  const absoluteOutput = resolve(outputPath);
  mkdirSync(dirname(absoluteOutput), { recursive: true });
  writeFileSync(absoluteOutput, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(payload, null, 2));

  if (!payload.ok) process.exitCode = 1;
} finally {
  await browser.close();
}
