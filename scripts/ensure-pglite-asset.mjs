#!/usr/bin/env node
/**
 * Ensure PGlite's runtime files are present in the TanStack Start/Vercel
 * server-function bundle. Vite/Nitro bundles the JS module, but the PGlite
 * package keeps postgres.wasm and postgres.data as external runtime assets.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const pgliteDist = join(root, "node_modules", "@electric-sql", "pglite", "dist");
const serverLibs = join(
  root,
  ".vercel",
  "output",
  "functions",
  "__server.func",
  "_libs",
);

const assets = [
  ["postgres.data", "pglite.data"],
  ["postgres.wasm", "pglite.wasm"],
];

if (!existsSync(join(root, ".vercel", "output"))) {
  throw new Error(
    "TanStack Start did not produce .vercel/output; cannot install PGlite runtime assets.",
  );
}

mkdirSync(serverLibs, { recursive: true });

for (const [sourceName, targetName] of assets) {
  const source = join(pgliteDist, sourceName);
  const target = join(serverLibs, targetName);
  if (!existsSync(source)) {
    throw new Error(`Missing PGlite runtime asset: ${source}`);
  }
  copyFileSync(source, target);
  console.log(`[pglite] copied ${sourceName} -> .vercel/output/functions/__server.func/_libs/${targetName}`);
}
