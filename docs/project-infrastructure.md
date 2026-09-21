# Menu V3 — Project Infrastructure Identity

## Canonical Backend

**Verified on 2026-09-06 by direct Supabase project inspection.**

- Product: Menu V3
- Repository: `Midosd249/Menu_V3`
- Branch/source of truth: `main`
- Supabase project ref: `ublxptcqefujkbeepylc`
- Supabase project URL: `https://ublxptcqefujkbeepylc.supabase.co`
- Supabase region: `ap-northeast-2` (Seoul)
- Supabase status at verification: `ACTIVE_HEALTHY`
- Menu V3 database schema: `menu_v3`

## Separation Rule

Menu V3 runs inside the same Supabase project as legacy application data but uses the dedicated `menu_v3` schema. The legacy `public` schema must not be assumed to be the Menu V3 canonical surface.

Do not substitute:
- the former Menu/V2 Supabase project;
- a previous sandbox project;
- legacy `public` tables;
- another Supabase project;

for the Menu V3 backend unless repository/database evidence explicitly requires it.

## Current Menu V3 Data Boundary

The canonical Menu V3 menu domain is under `menu_v3`, including tenant, membership, branch, category, product, option/modifier, hours, event, order, and subscription-related structures as present in the live project/repository.

## Operational Rule

Any future database investigation, migration verification, RLS review, RPC review, data-flow analysis, cache correctness check, or Owner → Public runtime test for Menu V3 must begin by resolving this project identity and the `menu_v3` schema.

If a future source conflicts with this identity, mark the conflict `UNKNOWN` and verify against the live Supabase project and repository before changing code or configuration.

## Security Note

Supabase Security Advisor warnings observed during verification are tracked separately. They are not to be treated as confirmed vulnerabilities until the relevant function definitions, grants, RLS policies, and intended access paths are reviewed.
