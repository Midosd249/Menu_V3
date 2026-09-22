#!/usr/bin/env node
/**
 * Deterministic Phase 6 performance fixture.
 *
 * Usage:
 *   node scripts/golden-performance-fixture.mjs
 *
 * The fixture is synthetic and contains no customer PII. It models the
 * verified incident shape: 30 image-bearing products, all Featured, mixed
 * content, and a legacy Base64 cover comparison. The canonical mode uses
 * the current decoupled cover path.
 */
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, createReadStream } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = join(root, "fixtures/performance/golden-public-menu-30.json");
const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
const outputPath = process.env.GOLDEN_FIXTURE_OUTPUT || ".grok/golden-performance-baseline.json";
const width = Number(process.env.GOLDEN_FIXTURE_VIEWPORT_WIDTH || 390);
const height = Number(process.env.GOLDEN_FIXTURE_VIEWPORT_HEIGHT || 844);

if (
  fixture.expected.productCount !== 30 ||
  fixture.expected.imageBearingProductCount !== 30 ||
  fixture.expected.featuredProductCount !== 30 ||
  fixture.products.length !== 30
) {
  throw new Error("Golden fixture must contain exactly 30 image-bearing Featured products.");
}

const mime = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function legacyCoverDataUrl() {
  const prefix = "data:image/svg+xml;base64,";
  const base = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#344331"/><text x="60" y="320" fill="#fff" font-size="64">Golden Cover</text><!--';
  const suffix = "--></svg>";
  const targetRawPadding = 174923;
  const raw = base + "G".repeat(targetRawPadding) + suffix;
  return prefix + Buffer.from(raw, "utf8").toString("base64");
}

const legacyCover = legacyCoverDataUrl();

function renderPage(legacy) {
  const cover = legacy ? legacyCover : "/assets/homepage/menu-cover.webp";
  const products = fixture.products.map((product, index) => {
    const image = `${product.imagePath}?golden-product=${encodeURIComponent(product.id)}`;
    return `
      <article class="product">
        <img src="${image}" alt="${escapeHtml(product.nameEn)}" width="320" height="220"
          ${index < 2 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'}
          decoding="async">
        <div class="copy" dir="auto">
          <h2>${escapeHtml(product.nameAr)}</h2>
          <p>${escapeHtml(product.nameEn)}</p>
          ${product.descriptionAr ? `<p class="description">${escapeHtml(product.descriptionAr)}</p>` : ""}
          <strong>${product.price} SAR</strong>
        </div>
      </article>`;
  }).join("");

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Golden 30 Product Performance Fixture</title>
<style>
  :root{font-family:system-ui,sans-serif;background:#f6f0e5;color:#1f261e}
  *{box-sizing:border-box}
  body{margin:0}
  header{min-height:320px;display:grid;align-content:end;padding:24px;background:#344331}
  header img{position:absolute;inset:0;width:100%;height:320px;object-fit:cover;opacity:.45}
  header .hero-copy{position:relative;z-index:1;color:white;max-width:900px}
  main{max-width:980px;margin:0 auto;padding:24px}
  .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
  .product{background:white;border-radius:18px;overflow:hidden;border:1px solid #ddd;min-height:360px}
  .product img{display:block;width:100%;height:220px;object-fit:cover;background:#eee}
  .copy{padding:14px}
  h1{margin:0 0 8px;font-size:32px} h2{margin:0 0 6px;font-size:20px}
  p{margin:4px 0;line-height:1.5}.description{min-height:48px}
  @media(max-width:640px){.grid{grid-template-columns:1fr}header{min-height:280px}header img{height:280px}}
</style>
</head>
<body>
<header>
  <img src="${cover}" alt="" width="1200" height="600" ${legacy ? "" : 'loading="eager"'} decoding="async">
  <div class="hero-copy"><h1>${escapeHtml(fixture.tenant.nameAr)}</h1><p>${escapeHtml(fixture.tenant.nameEn)} · 30 products · all Featured</p></div>
</header>
<main><section class="grid">${products}</section></main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function serveAsset(pathname, response) {
  const relative = pathname.replace(/^\/assets\//, "");
  const assetRoot = resolve(join(root, "public"));
  const filePath = normalize(join(assetRoot, relative));
  if (!filePath.startsWith(assetRoot) || !existsSync(filePath)) {
    response.writeHead(404); response.end("not found"); return;
  }
  response.writeHead(200, {
    "content-type": mime[extname(filePath).toLowerCase()] || "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", "http://127.0.0.1");
  if (url.pathname.startsWith("/assets/")) {
    serveAsset(url.pathname, response);
    return;
  }
  if (url.pathname === "/golden/30-product") {
    const legacy = url.searchParams.get("cover") === "legacy";
    const html = renderPage(legacy);
    response.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-golden-fixture": "golden-public-menu-30",
      "x-golden-cover-mode": legacy ? "legacy-base64" : "current-decoupled",
    });
    response.end(html);
    return;
  }
  response.writeHead(404); response.end("not found");
});

await new Promise((resolveServer) => server.listen(0, "127.0.0.1", resolveServer));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

async function runAudit(mode) {
  const output = join(root, `.grok/golden-performance-${mode}.json`);
  const env = {
    ...process.env,
    PERFORMANCE_AUDIT_OUTPUT: output,
    PERFORMANCE_AUDIT_VIEWPORT_WIDTH: String(width),
    PERFORMANCE_AUDIT_VIEWPORT_HEIGHT: String(height),
    PERFORMANCE_AUDIT_SCROLL_ALL: "1",
  };
  await new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, ["scripts/performance-audit.mjs", `${baseUrl}/golden/30-product?cover=${mode}`], {
      cwd: root,
      env,
      stdio: "inherit",
    });
    child.once("error", rejectRun);
    child.once("exit", (code) => code === 0 ? resolveRun() : rejectRun(new Error(`performance audit failed for ${mode}: exit ${code}`)));
  });
  return JSON.parse(await readFile(output, "utf8"));
}

try {
  const current = await runAudit("current");
  const legacy = await runAudit("legacy");
  const baseline = {
    schemaVersion: 1,
    fixture: fixture.fixtureId,
    fixtureShape: fixture.expected,
    viewport: { width, height },
    canonicalMode: "current",
    measuredAt: new Date().toISOString(),
    current,
    legacy,
    comparison: {
      documentDecodedBytesSaved: legacy.document.decodedBytes - current.document.decodedBytes,
      documentEncodedBytesSaved: legacy.document.encodedBytes - current.document.encodedBytes,
      documentTransferBytesSaved: legacy.document.transferBytes - current.document.transferBytes,
      imageRequestCountDelta: current.transfer.images.requestCount - legacy.transfer.images.requestCount,
      imageTransferBytesDelta: current.transfer.images.transferBytes - legacy.transfer.images.transferBytes,
    },
    interpretation: [
      "Current mode models the post-Phase-3 decoupled cover contract.",
      "Legacy mode is a diagnostic comparison only and is not a production path.",
      "Numeric performance values are evidence, not hard budgets; CI environment and cache state can affect timings.",
    ],
  };
  await writeFile(resolve(outputPath), JSON.stringify(baseline, null, 2) + "\n", "utf8");
  console.log(JSON.stringify(baseline, null, 2));
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
