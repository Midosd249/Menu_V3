F2 UPDATE — 2026-11-02

- **IMPLEMENTED ON BRANCH:** `feat/f2-production-safe-migrations`, based on F1 architecture commit `b42229bcab316f1d85d2ff189754ec56ad434c15`.
- **CHANGE:** application build no longer invokes the custom PostgreSQL migration runner.
- **SAFETY:** explicit migration target plus exact host/database/user match; Vercel execution is rejected; Production requires a confirmation phrase; concurrent runner invocations are serialized by PostgreSQL advisory lock.
- **DEPLOYMENT CONTROL:** `vercel.json` uses `**: false` as the minimatch default, with `main: true` and `preview/*: true` exceptions.
- **VERCEL EVIDENCE:** the initial `*` wildcard did not match the slash-containing feature branch and created Preview `dpl_CMdCq6E2gEz3UR2bjJN782UMDHUj` (READY) for commit `5ce4a7108c9adb383931af0557375be78caf5884`. Build logs show the artifact-only build command and no migration-runner output. The wildcard was corrected; no additional deployment was observed for the corrected HEAD. PR-triggered behavior remains pending.
- **PRESERVED:** PGlite runtime migrations, `menu_v3._migrations`, and per-file transactions. No SQL migration or database was changed.
- **VERIFICATION:** local/sandbox execution is blocked; GitHub Quality/W9 remain pending exact-head verification; do not claim success until both run on the final PR head. No production migration, merge, or Production deployment occurred.

---
# Menuun Development History — Evidence Register

**Program:** F-Series  
**Purpose:** Preserve major product and engineering milestones without relying on chat memory.  
**Baseline:** 2026-11-02  
**Rule:** This is a curated milestone register, not a claim to reproduce every commit. Git history remains authoritative.

## 1. How to maintain this history

For each material milestone, record:

- Date (UTC where known).
- Phase/feature identifier.
- PR number and title.
- Tested code SHA.
- Merge SHA.
- Main SHA after merge, if verified.
- CI run IDs and exact result.
- Deployment ID/SHA/state only when directly verified.
- Database migration names and target only when evidenced.
- Owner-side browser/device confirmation separately from automated evidence.
- Remaining UNKNOWN/BLOCKED items.
- Links to incident reports, ADRs, and detailed task closeouts.

Never infer merge from an open PR, deployment from a green Vercel check, or real-device success from CI.

## 2. Verified baseline milestones

### 2026-10-23 — QR table ordering
- **VERIFIED:** PR #411, `feat(orders): connect public menu to table QR ordering`, is merged.
- **Merge SHA:** `f6e888ded688ba682b3c5862719b76adb96a5f21`.
- **Tested head recorded in PR:** `d38f6e2265de861d1a63cc614aa37b595b692b3a`.
- **CI evidence recorded in PR:** Quality run `39902102483` PASS; W9 Orders QA run `39902102479` PASS.
- **Scope recorded:** server-side opaque token resolution, tenant/branch validation, trusted table ID persistence, table-aware idempotency, Studio table management, token rotation, table labels, private/no-store behavior for token-bound pages, and regression coverage.
- **Database side effect:** PR record states migration `20261023120000_restaurant_tables_and_qr_tokens.sql` had already been applied to the connected Supabase project by a prior Vercel Preview build. This must remain visible in the database change history; do not claim Preview was database-isolated for that run.
- **Limitation:** PR record explicitly does not claim real-device QA or prove that production serves the merged commit.

### 2026-10-23 — Essential language selector
- **VERIFIED:** main's latest inspected commit `5a84d31282383e191472bcd3fc7d5b62417e90ca` is titled `fix(theme): repair Essential language selector state rules (#413)`.
- **VERIFIED:** prior commit `5ea83557946ed4b73ba8552175b9c795bfd5b813` addressed selector contrast.
- **Scope:** scoped selector state/contrast rules and regression contracts, as described by commit messages.
- **Limitation:** this history entry does not make a new visual/device claim beyond the recorded Git evidence and owner-side confirmations held separately.

### 2026-10-22 — Subscription lifecycle remediation
- **VERIFIED in Git history:** commits include `9c575927be4d3ef08fa37dca0e0d89ce8e9beae9` for trial expiry and atomic admin audit changes, followed by `74ddc7af44e0472e132416496579b523c847f6a0` for trials with missing expiry timestamps.
- **Scope from commit descriptions:** expiry handling, transactional audit behavior, and regression contract.
- **Limitation:** consult the PR and exact workflow runs before making a new verification claim.

### 2026-10-21 — Team invitation recovery
- **VERIFIED in Git history:** commit `624764b789c7ad2bb228871f8c1fe908bfa28db5` records invitation-context recovery after email verification.
- **Scope from commit description:** preserve invitation context through signup/verification and recover access safely.
- **Limitation:** current behavior should be treated as implemented history, not re-tested by this history document.

### 2026-10-16 — Pricing contrast and CI debugging
- **VERIFIED:** repository contains `docs/incidents/PR-402-pricing-contrast-and-ci-debugging.md`.
- **Purpose:** detailed retrospective of multiple CI/browser causes, fixes, and prevention rules.
- **Rule:** read this incident report before changing the same test/runner/browser infrastructure.

## 3. Current repository checkpoint

- **VERIFIED:** inspected main SHA: `5a84d31282383e191472bcd3fc7d5b62417e90ca`.
- **VERIFIED:** default branch is `main`.
- **VERIFIED:** PR #411 is merged; older continuity documents at the top of `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, and `SESSION_PROTOCOL.md` still described it as open/in progress. F0 reconciles the current checkpoint while preserving historical entries below.
- **UNKNOWN:** current production deployment SHA/state was not re-queried for this F0 documentation task.
- **UNKNOWN:** current live backup/restore evidence was not collected as part of F0.

## 4. Architecture and operational evolution

This section is a living register. Add an entry when an architectural decision or operating rule changes materially.

| Date | Decision/change | Evidence | Status |
|---|---|---|---|
| 2026-11-02 | Establish F-Series roadmap and phase IDs | F0 documentation branch | In progress until reviewed/merged |
| Historical | Release-only Vercel policy | `docs/release-only-vercel-workflow.md`, `AGENTS.md` | Existing repository policy |
| Historical | Custom migration runner and ledger | `scripts/migrate.mjs`, continuity decision | Existing implementation/decision; F2 safety work pending |

## 5. Do not repeat without evidence

- Do not reopen completed QR table ordering, Essential selector, invitation, subscription, or theme work merely because an old continuity file says it is pending.
- Do not re-run broad visual audits without a concrete new scope or regression.
- Do not repeat CI retries without inspecting exact SHA, failed step, logs, and changed conditions.
- Do not create another generic architecture document if F1 has already produced a maintained equivalent.
- Do not treat provider advisor notices as confirmed vulnerabilities without analyzing exposure and access paths.
- Do not repeat production database inspections or mutations without a concrete question and read-only-first approach.

## 6. Next history entries

Future entries should link to:
- PR and merge commit.
- Relevant test/CI runs.
- Migration ledger evidence where relevant.
- Production deployment evidence where relevant.
- Incident/ADR/architecture docs.
- Owner-side verification, clearly separated from automated checks.