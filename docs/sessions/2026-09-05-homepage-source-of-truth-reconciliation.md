# Session — Homepage Source-of-Truth Reconciliation

Date: 2026-09-05
Status: IN_PROGRESS

## Objective
Verify that the live project shown from the marketing homepage is the same tenant used by the owner dashboard, and ensure dashboard changes can reach the public menu without a static demo bypass.

## Evidence
- Repository: `Midosd249/Menu_V3`; canonical branch remains `main`.
- Homepage route `src/routes/index.tsx` uses the public slug `nafas` for the live-menu CTA/card.
- Production database project: `ublxptcqefujkbeepylc`.
- `menu_v3.tenants` contains `id=demo-nafas`, `slug=nafas`, Arabic name `نَفَس`, English name `Nafas`, published state, Editorial theme, and one active branch.
- `demo-nafas.owner_user_id` is `lyFgwXjJpkPirr0inS1TxvJbM09yXKXp`, which resolves in `menu_v3."user"` to `midosd2.mm@gmail.com`.
- `menu_v3.tenant_members` gives that same user the `owner` role for `demo-nafas`.
- The tenant was previously inactive; it was activated so the published public loader can serve the real record.
- Before the fix, `src/lib/menu/public.ts` returned static `DEMO_MENU` whenever the requested slug was `nafas`, so Studio/database changes could not appear in the homepage-linked public menu.

## Implementation
- Removed the hard-coded `nafas` short-circuit from `src/lib/menu/public.ts`.
- Kept the existing public loader, mapping, caching, validation, branch scoping, product options, analytics, and lead handling intact.
- No database schema/migration change was introduced.

## Continuity
Updated:
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- `SESSION_PROTOCOL.md`
- `README.md`

## Verification
- Database identity/ownership/branch state directly queried.
- Repository source inspected for homepage slug and public-loader behavior.
- Final deployment/browser reflection remains UNKNOWN until CI passes and the branch is released.

## Remaining
1. Run CI on `fix/homepage-demo-source-of-truth`.
2. Review the final diff.
3. Merge to `main` only after applicable quality gates pass.
4. Verify one real dashboard edit on `demo-nafas` appears at `/m/nafas`.

## Important constraint
Do not start another theme or unrelated refactor as part of this task.
