# ADR-0003 — Require Session-Preserving Connections for Migrations

- **Status:** Accepted
- **Date:** 2026-11-02
- **Decision owner:** Menuun sole human owner
- **Related:** ADR-0001, ADR-0002, `scripts/migration-safety.mjs`, `scripts/migrate.mjs`, `docs/operations/MIGRATION_RUNBOOK.md`

## Context

The custom migration runner acquires a PostgreSQL session-level advisory lock with `pg_try_advisory_lock` and sets `search_path` on its client connection. These operations rely on session state persisting across statements and transaction boundaries.

Supabase documents that transaction-mode pooling returns the backend connection to the pool after each transaction and does not preserve session-level advisory locks or `SET` state. Supabase recommends direct connections for migrations and supports session mode as the alternative where direct IPv6 connectivity is unavailable.

## Decision

1. Explicit migration runs must use a session-preserving direct or session-mode PostgreSQL connection.
2. The operator must set `MIGRATION_CONNECTION_MODE=direct` or `session`.
3. The operator must provide `MIGRATION_EXPECTED_PORT`, and it must match the connection URL.
4. The standard Supabase transaction-pooler port `6543` is rejected.
5. The runbook requires operators to verify the connection mode from the provider's connection-string selection. The runner cannot infer every provider-specific pooling mode from an arbitrary hostname.
6. Application builds and Vercel deployment contexts remain prohibited from running migrations.

## Consequences

- The runner's advisory lock and session-level search path assumptions are protected against the standard Supabase transaction-pooler endpoint.
- Operators using IPv4-only networks can use Supavisor session mode instead of transaction mode.
- The connection mode is an operator assertion backed by the selected provider connection string; it is not cryptographically attested by PostgreSQL.
- No production or staging database was contacted or modified by this decision.

## Evidence

Supabase connection guidance: https://supabase.com/docs/guides/database/connecting-to-postgres  
PostgreSQL advisory-lock lifecycle: https://www.postgresql.org/docs/current/explicit-locking.html
