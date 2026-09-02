# Menu V3 — Execution Checkpoint

Date: 2026-09-03
Canonical repository: `Midosd249/Menu_V3`
Source of truth: `main`

## Verified in this execution

- Level 0: closed.
- Level 1: closed.
- Level 2: implemented; historical E2E caveats remain as documented in `MASTER_CONTEXT_MENU_V3.md`.
- Level 3: still in progress; core public ordering + Owner operations are implemented.
- Orders backend now returns complete order-item snapshots to Owner, including selected variant/modifier details.
- Order status audit now records `from_status` and `to_status` for real status transitions.
- Initial public order creation records `null -> new` in `order_status_events`.
- Owner Active metric is informational instead of pretending to be a filter.
- Owner loading effects were consolidated to avoid the previous duplicate initial load pattern.
- Current-user React hooks were made unconditional to satisfy Rules of Hooks while preserving auth-disabled dev fallback behavior.
- App-data token parsing keeps the existing secure implementation and now documents the intentional malformed-token fallback instead of using an empty catch block.

## GitHub Quality verification

Latest verified successful workflow:
- Run: `33684563283`
- Commit: `2f005d9af4aa1a26e8aad7138c927e97c473c9fa`
- Workflow: `Menu V3 Quality`
- Result: SUCCESS
- Generate route tree: success
- Typecheck: success
- Tests: success
- Lint: success
- Tests: 32 passed, 0 failed in the verified run.

Important: an earlier accidental replacement of `src/lib/app-data/client.server.ts` was immediately restored from the exact parent version and the lint fix was applied safely. The final successful workflow is on the restored implementation.

## Latest main commits in this execution

- `2f005d9af4aa1a26e8aad7138c927e97c473c9fa` — fix(lint): preserve app-data implementation and close empty catch
- `d14715723462b8c30aec8f95925169824e254e7f` — intermediate bad stub commit; DO NOT use as source of truth
- `a5dc2442a40839750d8e2b1314e02986cbe7103c` — auth hooks fix
- `fedcb71990604e8a084dcf09973b3f5e5cfce2d9` — serializable Owner order payload
- `5d3607e36d6ffc4db7b13a1399bdaab1c6d1efef` — orders cleanup
- `a4a49cb43de241463bbab4ce6779eea1b7b1b019` — Owner detail/operational improvements
- `40e93a06bff9eb9838eec0f4479090872da8cae5` — order detail/status transition implementation

## Remaining Level 3 closure work

1. Run a real public customer order against the existing published demo tenant/branch/product; do not invent data.
2. Verify the created order appears in Owner.
3. Verify Owner status update writes the correct status event.
4. Verify production deployment from the final main commit and inspect runtime logs.
5. Regression-check `/admin`, Studio, public menu, auth redirects, and branches.
6. Verify Supabase live order tables/status events after the real E2E flow.
7. Only after those checks: mark Level 3 closed.
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
