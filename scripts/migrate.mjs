#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { pendingMigrations } from "./migration-plan.mjs";
import { validateMigrationEnvironment } from "./migration-safety.mjs";

const POSTGRES_SCHEMA = "menu_v3";
const ADVISORY_LOCK_NAMESPACE = 7312026;
const ADVISORY_LOCK_ID = 1;

const { databaseUrl, target, connectionMode, identity } = validateMigrationEnvironment(process.env);
console.log(
  `[migrate] target=${target} mode=${connectionMode} host=${identity.host} port=${identity.port} database=${identity.database} user=${identity.user}`,
);

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

async function main() {
  let entries;
  try {
    entries = await readdir(migrationsDir);
  } catch (err) {
    if (err?.code === "ENOENT") {
      console.log("[migrate] no migrations/ directory — nothing to do.");
      return;
    }
    throw err;
  }

  if (pendingMigrations(entries, []).length === 0) {
    console.log("[migrate] no migrations — nothing to do.");
    return;
  }

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    options: `-c search_path=${POSTGRES_SCHEMA},public`,
    max: 1,
    connectionTimeoutMillis: 15000,
  });
  let client;
  let lockAcquired = false;
  try {
    client = await pool.connect();
    const lock = await client.query(
      "SELECT pg_try_advisory_lock($1, $2) AS locked",
      [ADVISORY_LOCK_NAMESPACE, ADVISORY_LOCK_ID],
    );
    if (!lock.rows[0]?.locked) {
      throw new Error("Another migration runner currently holds the database migration lock.");
    }
    lockAcquired = true;

    await client.query(`CREATE SCHEMA IF NOT EXISTS ${POSTGRES_SCHEMA}`);
    await client.query(`SET search_path TO ${POSTGRES_SCHEMA}, public`);
    await client.query(
      "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
    );
    const applied = (await client.query("SELECT name FROM _migrations")).rows.map((r) => r.name);

    let count = 0;
    for (const { name } of pendingMigrations(entries, applied)) {
      const sql = await readFile(join(migrationsDir, name), "utf8");
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
      } catch (err) {
        console.error(`[migrate] error applying ${name}`);
        try {
          await client.query("ROLLBACK");
        } catch {
          // Preserve the original migration error.
        }
        throw err;
      }
      console.log(`[migrate] applied ${name}`);
      count += 1;
    }
    console.log(count ? `[migrate] done — ${count} migration(s) applied.` : "[migrate] up to date.");
  } finally {
    if (client) {
      if (lockAcquired) {
        try {
          await client.query("SELECT pg_advisory_unlock($1, $2)", [
            ADVISORY_LOCK_NAMESPACE,
            ADVISORY_LOCK_ID,
          ]);
        } catch {
          console.error("[migrate] advisory lock release failed; closing the database session.");
        }
      }
      client.release();
    }
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[migrate] failed:", err?.message || err);
  for (const key of ["code", "detail", "hint", "position", "where"]) {
    if (err?.[key] != null) console.error(`[migrate]   ${key}: ${err[key]}`);
  }
  process.exit(1);
});
