# Menu V3 — Execution Checkpoint

Date: 2026-09-03
Canonical repository: `Midosd249/Menu_V3`
Source of truth: `main`

## Current state

- Level 0: closed.
- Level 1: closed.
- Level 2: implemented; historical E2E caveats remain as documented in `MASTER_CONTEXT_MENU_V3.md`.
- Level 3: still in progress; public ordering + Owner operations are implemented and DB smoke-tested, but full browser E2E is not yet verified.

## Verified in this execution

- Orders backend returns complete order-item snapshots to Owner, including selected variant/modifier details.
- Order status audit records `from_status` and `to_status` for real status transitions.
- Initial public order creation path is designed to record `null -> new` in `order_status_events`.
- Owner Active metric is informational instead of pretending to be a filter.
- Owner loading effects were consolidated to avoid duplicate initial load behavior.
- Current-user React hooks are unconditional while preserving auth-disabled dev fallback behavior.
- App-data token parsing preserves the secure implementation and documents malformed-token fallback.
- Live Supabase schema was inspected for tenants, branches, products, orders, order_items, and order_status_events.
- A real-data DB smoke test used the existing published `mndy-alwtnya` tenant, `main-branch`, and existing product `8733c6ab-ebe9-4338-9cb0-db0107233534`; it successfully inserted an order + item + initial status event, transitioned `new -> confirmed`, verified the event, then removed all QA rows. Final QA row counts: zero.

## Critical issue found and fixed

The live database exposed a production-blocking trigger bug: the order tenant-consistency trigger used unqualified `branches`/`products` references. Because the trigger function did not inherit the migration's session search_path, PostgreSQL could resolve another table with the same name and fail with `operator does not exist: uuid = text` during order creation.

Fix:
- Supabase migration applied: `order_trigger_schema_qualification`.
- GitHub migration added: `migrations/0010_order_trigger_schema_qualification.sql`.
- Trigger functions now explicitly resolve `menu_v3.branches`, `menu_v3.orders`, and `menu_v3.products`, with an explicit function search_path.
- The corrected trigger path was re-tested successfully against live Supabase.

## GitHub Quality verification

Verified successful workflow before the latest DB-hardening commit:
- Run: `33684563283`
- Commit: `2f005d9af4aa1a26e8aad7138c927e97c473c9fa`
- Workflow: `Menu V3 Quality`
- Result: SUCCESS
- Generate route tree: success
- Typecheck: success
- Tests: 32 passed, 0 failed
- Lint: success

The DB-hardening commit is now on `main` as:
- `f0e7d43034c8c5491439b578877800b2b9be3967` — `fix(db): schema-qualify order tenant guards`

## Vercel

Latest production deployment for the DB-hardening commit:
- Deployment: `dpl_HLTeWcFz8iidMekxNquJx5aPx8SA`
- Commit: `f0e7d43034c8c5491439b578877800b2b9be3967`
- State at checkpoint update: BUILDING
- Build had started normally and cloned `main` at the corrected commit.
- Do not mark production verified until this deployment reaches READY and runtime checks pass.

## Remaining Level 3 closure work

1. Verify the latest GitHub Actions run for commit `f0e7d43034c8c5491439b578877800b2b9be3967`.
2. Verify the latest Vercel deployment reaches READY and inspect build/runtime logs.
3. Execute the strongest available real public customer order E2E against the existing published tenant; do not invent restaurant/product data.
4. Verify the resulting order is visible in Owner and that Owner status updates create the correct audit event.
5. Regression-check `/admin`, Studio, public menu, auth redirects, and branches.
6. Verify Supabase order/order-item/status-event state after E2E.
7. Only after all checks pass: mark Level 3 closed.
8. Then begin Level 4 — Client SaaS & Commercial Platform.

## Architecture contract

- Studio owns menu/product/design/branch editing.
- Owner owns orders + customer prospects/leads.
- `/admin` remains legacy/platform-admin compatibility.
- `/m/:slug` is public customer menu + ordering.
- Do not rebuild from scratch.
- Do not trust client tenant_id.
- Do not use localStorage as published source of truth.
- Do not bypass authorization/security.
- Build success is not product correctness.

See `MASTER_CONTEXT_MENU_V3.md` for the full roadmap and durable project architecture.
