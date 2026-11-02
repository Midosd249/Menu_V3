# Deployment and Release Topology

**Status:** Source/configuration baseline — 2026-11-02  
**Baseline SHA:** `e5d7c89a73718f35e7accbae7933af36c366bbc1`

## Hosting
- Vercel is the hosting/release platform.
- `vercel.json` declares region `icn1`.
- TanStack Start is integrated with Vite and Nitro (see `vite.config.ts`).
- Exact function runtime/regions beyond project-level configuration are UNKNOWN in this source pass.

## Build commands
Current package scripts:
- `dev`: `with-app-env.mjs vite dev`.
- `build`: `with-app-env.mjs vite build` → `ensure-pglite-asset.mjs` → `npm run db:migrate`.
- `db:migrate`: `node scripts/migrate.mjs`.
- `build:dev`: Vite development-mode build (does not append explicit db:migrate in the script).
- `typecheck`: `tsc --noEmit`.
- `check:auth`: `scripts/check-auth-invariant.mjs`.
- `test`: repository Node test suite.

## Database selection
`src/lib/db.ts` chooses PostgreSQL when any supported URL exists; otherwise PGlite. PostgreSQL pool sets `search_path=menu_v3,public`, max pool size 2 per app instance. The migration runner separately creates a max-1 pool and uses the first configured DB URL.

## Release-only policy
Follow `docs/release-only-vercel-workflow.md`: local development and QA → CI quality gates → diff review → one coherent release batch → main → one production deployment → real-device QA. Preview is exception-only.

## Critical migration risk
The standard `build` script currently invokes `db:migrate`. Preview and Production environment target equality is UNKNOWN because secret values must not be read. Historical F0 evidence documents Preview builds running the migration runner. This is the principal F2 work item; no fix is implemented in F1.

## Environment separation
- Exact Preview vs Production database target: UNKNOWN.
- Separate staging Supabase project: UNKNOWN.
- Runtime environment variable values and secret classifications: not included here.
- Current production deployment SHA/state: UNKNOWN in this F1 pass.

## Release evidence discipline
A Git commit, green CI run, Preview READY, or HTTP 200 is not individually proof of current Production. Record deployment ID, target, state, and serving commit SHA from Vercel for each authorized release.
