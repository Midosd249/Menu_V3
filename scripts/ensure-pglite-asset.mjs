#!/usr/bin/env node
/**
 * Ensure PGlite's runtime files are present in the TanStack Start/Vercel
 * server-function bundle. PGlite 0.5.x requires three runtime artifacts:
 * pglite.data, pglite.wasm and initdb.wasm.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const pgliteDist = join(root, "node_modules", "@electric-sql", "pglite", "dist");
const serverFunction = join(root, ".vercel", "output", "functions", "__server.func");
const serverLibs = join(serverFunction, "_libs");

const assets = [
  ["pglite.data", "pglite.data"],
  ["pglite.wasm", "pglite.wasm"],
  ["initdb.wasm", "initdb.wasm"],
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
  console.log(
    `[pglite] copied ${sourceName} -> .vercel/output/functions/__server.func/_libs/${targetName}`,
  );
}

// PGlite's default data directory is relative to the running server-function
// directory. Vite preview executes the Vercel function bundle from
// `.vercel/output/functions/__server.func`, so the database file must also be
// available at that directory's root. Keep the `_libs` copies above because
// they are part of the existing deployment asset contract.
const dataSource = join(pgliteDist, "pglite.data");
const dataTarget = join(serverFunction, "pglite.data");
copyFileSync(dataSource, dataTarget);
console.log("[pglite] copied pglite.data -> .vercel/output/functions/__server.func/pglite.data");
