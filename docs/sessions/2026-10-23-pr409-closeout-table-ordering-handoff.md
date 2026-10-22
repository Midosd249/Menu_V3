# 2026-10-23 — PR #409 closeout and Menuun table-ordering handoff

## Verified state

- PR #409, `fix(subscriptions): downgrade trials with missing expiry timestamps`, was squash-merged into `main`.
- Merge commit: `74ddc7af44e0472e132416496579b523c847f6a0`.
- Final PR head tested by GitHub Actions: `ace671285b1bc32cdd8e2a0bbfcc8da0d318a86a`.
- GitHub Actions Quality run `39852418404`: completed successfully on the final PR head.
- GitHub Actions W9 Orders QA run `39852418408`: completed successfully on the final PR head.
- The PR diff was limited to the subscription-expiry migration and its regression contract test.
- The migration UPDATE now handles both `trial_ends_at IS NULL` and `trial_ends_at <= now()`, matching the expiry guard.
- No production database migration was applied by this task. The Supabase migration ledger had not listed `20261022090000_enforce_trial_expiry_and_atomic_entitlement` when last inspected.
- No production deployment was performed or verified.
- No table-ordering implementation was started in this task.

## Evidence and limits

- PR: https://github.com/Midosd249/Menu_V3/pull/409
- Quality: https://github.com/Midosd249/Menu_V3/actions/runs/39852418404
- W9 Orders QA: https://github.com/Midosd249/Menu_V3/actions/runs/39852418408
- Vercel reported a Ready preview in the PR discussion. This is preview evidence only, not proof of production deployment.
- Local tests, local typecheck/lint/build, and interactive browser/device QA were not run in this connected session.
- GitHub Actions success applies to the tested PR head; do not describe it as proof that the production migration has been applied.

## Next authorized task: table-specific QR ordering

Start a fresh, evidence-led investigation of table-specific QR ordering in the current repository. The current code, live schema, tests, Git history, and current continuity documents take priority over this note.

Protect the existing public-menu journey as the highest-priority invariant. Do not require table context for normal published-menu visits, do not add a mandatory editable table selector to the public menu, and do not replace the existing cart, modifiers, order submission, confirmation, receipt, or themes.

Before implementation:
1. Verify current `main`, HEAD, recent history, open PRs, and relevant diffs.
2. Read `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, `README.md`, and current specialist/architecture/database/security/public-menu/theme/localization/QA docs.
3. Search the actual current code, migrations, live schema, RLS, grants, indexes, order contract, idempotency, QR handling, and tests for existing table capabilities.
4. Complete a read-only database/security review and map the actual order path across every supported template.
5. Establish the smallest safe technical contract and regression tests before changing code.
6. Implement only when repository evidence establishes the minimum necessary change; preserve tenant/branch isolation and existing security controls.
7. Run available checks, inspect the final diff, and update continuity with evidence.
8. Do not deploy or apply production migrations without a separate controlled release decision.

## Status

- PR #409: MERGED.
- Implementation verification: GitHub Quality and W9 passed on the final PR head.
- Production migration: NOT_APPLIED / UNKNOWN after the last read-only inspection.
- Production deployment: NOT_PERFORMED / NOT_VERIFIED.
- Table-specific QR ordering: NOT_STARTED.
- Exactly one next task: read-only bootstrap and architecture/security review for table-specific QR ordering.
