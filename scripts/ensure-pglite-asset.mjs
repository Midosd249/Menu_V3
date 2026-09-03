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
  const libTarget = join(serverLibs, targetName);
  const functionTarget = join(serverFunction, targetName);
  if (!existsSync(source)) {
    throw new Error(`Missing PGlite runtime asset: ${source}`);
  }
  copyFileSync(source, libTarget);
  copyFileSync(source, functionTarget);
  console.log(
    `[pglite] copied ${sourceName} -> .vercel/output/functions/__server.func/_libs/${targetName}`,
  );
  console.log(
    `[pglite] copied ${sourceName} -> .vercel/output/functions/__server.func/${targetName}`,
  );
}
