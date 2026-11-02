const DATABASE_URL_KEYS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "SUPABASE_DB_URL",
  "POSTGRES_URL_NON_POOLING",
];

export function resolveDatabaseUrl(env = process.env) {
  for (const key of DATABASE_URL_KEYS) {
    const value = env[key]?.trim();
    if (value) return value;
  }
  return "";
}

function decodeUrlPart(value, label) {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new Error(`The configured database URL contains an invalid encoded ${label}.`);
  }
}

/**
 * Validate the operator-selected migration target before opening a connection.
 * The expected host, database, and user identify the intended PostgreSQL target
 * without printing or persisting the connection string or password.
 */
export function validateMigrationEnvironment(env = process.env) {
  if (env.VERCEL === "1" || env.VERCEL_ENV) {
    throw new Error("Database migrations must not run inside Vercel builds or deployments.");
  }

  const target = env.MIGRATION_TARGET?.trim();
  if (!["local", "staging", "production"].includes(target)) {
    throw new Error("MIGRATION_TARGET must be explicitly set to local, staging, or production.");
  }

  const databaseUrl = resolveDatabaseUrl(env);
  if (!databaseUrl) {
    throw new Error("A PostgreSQL connection URL is required for an explicit migration run.");
  }

  let parsed;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    throw new Error("The configured PostgreSQL connection URL is invalid.");
  }
  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    throw new Error("The migration connection URL must use postgres:// or postgresql://.");
  }

  const databasePath = parsed.pathname.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
  const identity = {
    host: parsed.hostname.toLowerCase(),
    database: decodeUrlPart(databasePath, "database name"),
    user: decodeUrlPart(parsed.username, "username"),
  };

  const expected = {
    host: env.MIGRATION_EXPECTED_HOST?.trim().toLowerCase(),
    database: env.MIGRATION_EXPECTED_DATABASE?.trim(),
    user: env.MIGRATION_EXPECTED_USER?.trim(),
  };
  for (const key of Object.keys(expected)) {
    if (!expected[key]) {
      throw new Error(`MIGRATION_EXPECTED_${key.toUpperCase()} is required to identify the target database.`);
    }
    if (identity[key] !== expected[key]) {
      throw new Error(`Configured database ${key} does not match MIGRATION_EXPECTED_${key.toUpperCase()}.`);
    }
  }

  if (
    target === "production" &&
    env.MIGRATION_CONFIRM_PRODUCTION !== "APPLY_PRODUCTION_MIGRATIONS"
  ) {
    throw new Error(
      "Production migrations require MIGRATION_CONFIRM_PRODUCTION=APPLY_PRODUCTION_MIGRATIONS.",
    );
  }

  return { target, databaseUrl, identity };
}
