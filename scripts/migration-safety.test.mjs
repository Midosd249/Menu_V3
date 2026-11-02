import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { validateMigrationEnvironment } from "./migration-safety.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const VERCEL = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
const MIGRATOR = readFileSync(join(ROOT, "scripts/migrate.mjs"), "utf8");

const validEnv = (overrides = {}) => ({
  MIGRATION_TARGET: "staging",
  MIGRATION_CONNECTION_MODE: "direct",
  MIGRATION_EXPECTED_HOST: "db.project-ref.supabase.co",
  MIGRATION_EXPECTED_PORT: "5432",
  MIGRATION_EXPECTED_DATABASE: "postgres",
  MIGRATION_EXPECTED_USER: "postgres",
  DATABASE_URL:
    "postgresql://postgres:secret-password@db.project-ref.supabase.co:5432/postgres?sslmode=require",
  ...overrides,
});

test("application build generates artifacts without invoking database migrations", () => {
  assert.equal(
    PACKAGE.scripts.build,
    "node scripts/with-app-env.mjs vite build && node scripts/ensure-pglite-asset.mjs",
  );
  assert.doesNotMatch(PACKAGE.scripts.build, /db:migrate/);
});

test("migration target and expected database identity are mandatory", () => {
  assert.throws(() => validateMigrationEnvironment({}), /MIGRATION_TARGET/);
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_TARGET: "preview" })),
    /MIGRATION_TARGET/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_EXPECTED_USER: "" })),
    /MIGRATION_EXPECTED_USER/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_EXPECTED_PORT: "" })),
    /MIGRATION_EXPECTED_PORT/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ DATABASE_URL: "" })),
    /connection URL is required/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ DATABASE_URL: "not-a-url" })),
    /connection URL is invalid/,
  );
});

test("migration connection must preserve PostgreSQL session state", () => {
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_CONNECTION_MODE: "" })),
    /MIGRATION_CONNECTION_MODE/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_CONNECTION_MODE: "transaction" })),
    /must be direct or session/,
  );
  assert.throws(
    () =>
      validateMigrationEnvironment(
        validEnv({
          DATABASE_URL:
            "postgresql://postgres:secret-password@aws.pooler.supabase.com:6543/postgres",
          MIGRATION_EXPECTED_HOST: "aws.pooler.supabase.com",
          MIGRATION_EXPECTED_PORT: "6543",
        }),
      ),
    /transaction-mode pooler port 6543 is not supported/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_EXPECTED_PORT: "5433" })),
    /port does not match/,
  );
});

test("migration target identity must match host, port, database, and user", () => {
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_EXPECTED_HOST: "other.supabase.co" })),
    /host does not match/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_EXPECTED_DATABASE: "other" })),
    /database does not match/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_EXPECTED_USER: "postgres.other" })),
    /user does not match/,
  );
});

test("migration runner refuses all Vercel build and deployment contexts", () => {
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ VERCEL: "1", VERCEL_ENV: "preview" })),
    /must not run inside Vercel/,
  );
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ VERCEL_ENV: "production" })),
    /must not run inside Vercel/,
  );
});

test("staging migrations require explicit target identity and session-preserving mode", () => {
  const result = validateMigrationEnvironment(validEnv());
  assert.equal(result.target, "staging");
  assert.equal(result.connectionMode, "direct");
  assert.deepEqual(result.identity, {
    host: "db.project-ref.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
  });
  assert.equal(result.identity.password, undefined);
});

test("production migrations require the exact operator confirmation", () => {
  assert.throws(
    () => validateMigrationEnvironment(validEnv({ MIGRATION_TARGET: "production" })),
    /MIGRATION_CONFIRM_PRODUCTION/,
  );
  const result = validateMigrationEnvironment(
    validEnv({
      MIGRATION_TARGET: "production",
      MIGRATION_CONFIRM_PRODUCTION: "APPLY_PRODUCTION_MIGRATIONS",
    }),
  );
  assert.equal(result.target, "production");
});

test("Vercel Git deployments are opt-in for preview/* and production main only", () => {
  assert.deepEqual(VERCEL.git.deploymentEnabled, {
    "**": false,
    main: true,
    "preview/*": true,
  });
});

test("migration runner serializes concurrent runs with a PostgreSQL advisory lock", () => {
  assert.match(MIGRATOR, /pg_try_advisory_lock\(\$1, \$2\)/);
  assert.match(MIGRATOR, /pg_advisory_unlock\(\$1, \$2\)/);
  assert.match(MIGRATOR, /validateMigrationEnvironment\(process\.env\)/);
});
