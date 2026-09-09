# Menu V3 — Project Continuity Master Plan

**Date:** 2026-09-09  
**Repository:** `Midosd249/Menu_V3`  
**Canonical branch:** `main`  
**Purpose:** durable handoff and execution contract so future sessions resume from verified repository state rather than stale chat memory or outdated task ledgers.

## 1. Source of Truth

Authoritative order:
1. Current repository code/configuration/tests on `main`.
2. Current Git history and diff/branch state.
3. Current GitHub Actions evidence.
4. Current live Supabase evidence when database behavior is relevant.
5. Current Vercel deployment/runtime evidence when deployment behavior is relevant.
6. Continuity/audit/research documentation reconciled against the above.
7. Chat memory, screenshots, old reports, and historical prompts are context only.

Use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, and `BLOCKED` explicitly.

## 2. Current Baseline

- VERIFIED: implementation baseline before this documentation task was `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.
- VERIFIED: P0 Public Order Hardening is complete and protected.
- VERIFIED: P1 implemented Production/Continuity Hardening is complete for its implemented scope; release-hygiene follow-ups remain.
- VERIFIED: P2 Growth & Differentiation is complete on `main`.
- VERIFIED: P2 Quality Gate `1174` passed.
- VERIFIED: current Vercel Production is READY and serves `a7b9fce63257a38eb80ac36a4ab0fb00d2e188ed`.
- VERIFIED: inspected Production runtime error/fatal query returned no entries for the 24-hour window.
- VERIFIED: canonical Supabase project ref is `ublxptcqefujkbeepylc`; schema is `menu_v3`.
- VERIFIED: inspected sensitive functions are not executable by `anon` or `authenticated` and inspected canonical tables have direct privileges closed to those roles.
- VERIFIED: five themes remain protected: Essential, Editorial, Noir, Heritage/Taste, Gallery.
- VERIFIED: Quick Add, Item Notes, Cart, canonical public rendering, authentication/authorization, tenant/branch isolation, and customer action surfaces remain protected.

## 3. Why This Plan Exists

The 2026-09-09 audit found implementation and Production had advanced beyond the continuity files. P2 was already complete and deployed while older records still described an earlier state. This is **continuity/documentation drift**, not an application regression.

Prevention rule: after every meaningful atomic task, reconcile current Git head and relevant CI/platform evidence before selecting the next task.

## 4. Milestone Ledger

| Milestone | Current status | Rule |
|---|---|---|
| G1–G7.2 | CLOSED / VERIFIED | Protected |
| Premium Theme System | CLOSED / VERIFIED / MERGED | Protected |
| W6–W13 | CLOSED / VERIFIED | Protected |
| W14 | CLOSED / VERIFIED / MERGED | Protected |
| W15 | CLOSED / VERIFIED | Protected |
| W16 | IN_PROGRESS | Human/device/accessibility evidence remains |
| W17-Q | CLOSED / VERIFIED / MERGED | Protected |
| P0 Public Order Hardening | CLOSED / VERIFIED | Protected |
| P1 Production/Continuity Hardening | CLOSED / VERIFIED for implemented scope | Hygiene follow-ups remain |
| P2 Growth & Differentiation | CLOSED / VERIFIED / DEPLOYED | Do not redo |

Historical roadmap entries do not automatically become active tasks.

## 5. Exact Next Execution Sequence

### Task A — W16 Human Device & Manual Accessibility Gate
**Status:** `IN_PROGRESS` and the single next task.

Objective: directly observe current Production on physical devices and close the remaining evidence gap without reopening completed implementation.

Checks:
- Real Android production menu.
- iOS when available.
- Small, standard, and large mobile widths where practical.
- Arabic RTL, English LTR, and mixed-direction content.
- Long product names and varied SAR prices.
- Missing/mixed images.
- Sparse/dense categories.
- Sold-out states where applicable.
- Product details, Quick Add, Item Notes, Cart open/closed, ordering flow.
- Sticky/floating actions, safe areas, scrolling, and fixed-layer visibility.
- Manual screen-reader/focus checks where supported.
- QR-camera scanning.
- Opera-specific behavior if included in the supported matrix.

Acceptance:
- Evidence is recorded by device/browser/viewport.
- Reproducible defects receive separate atomic tasks.
- Unknown observations remain `UNKNOWN` until directly observed.
- Completed themes and architecture are not reopened without evidence.

### Task B — P1-H1 package manifest / lockfile reconciliation
**Status:** `OPEN`.
- Reconcile `package.json` and `package-lock.json` in a writable npm environment.
- Run the complete quality gate afterward.
- No speculative dependency upgrades.

### Task C — P1-H2 GitHub main branch protection
**Status:** `OPEN / OWNER ACTION`.
- Enable required status checks and branch protection for `main`.
- Verify the resulting state directly.
- Current connector can inspect but cannot configure this setting.

### Task D — P2-H1 Analytics no-data UX
**Status:** `PROPOSED`.
- Current code inference: Local Visibility readiness is hidden when analytics has no events because the content is gated by `hasData`.
- Future change, if prioritized: render readiness independently from analytics event availability.
- Keep this separate from continuity and W16.

## 6. Release Discipline

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- Vercel is not the normal design iteration environment.
- Preview deployments are exception-only.
- Do not intentionally trigger repeated deployments.
- CI success is not deployment evidence.
- `DEPLOYED` requires direct Vercel evidence.
- Inspect Vercel capacity/usage before deployment decisions when relevant.

## 7. Specialist Routing

Principal Engineer is the single orchestration point.
- Design Agent: significant visual/layout/image/theme/site-consistency work.
- Research/Connected-Tools: consequential, unfamiliar, external-knowledge-dependent, security-sensitive, browser-specific, or major design work.
- QA/Regression: behavior changes and relevant browser/accessibility checks.
- Security/Data: auth, authz, RLS, tenant isolation, subscriptions, pricing, public writes, migrations.
- Release/Reliability: CI, Vercel, deployment, production runtime, rollback, release batches.

These are internal AI workflows, not human collaborators. The user is the sole human owner and primary developer.

## 8. Protected Architecture Rules

Never weaken authentication, authorization, tenant/branch isolation, RLS/security boundaries, server-authoritative identity/role/entitlement/price validation, SEO/canonical routing, or deployment safety.

For layering incidents inspect: DOM structure → positioning/sizing → stacking contexts → pseudo-elements → animation/paint timing → responsive constraints → targeted z-index.

Never use arbitrary huge z-index values, timeouts, duplicate controls, fake actions, or client-side trust to hide defects.

## 9. Visual/Theme Protection

The five themes are completed implementation surfaces, not an automatic backlog. Reopen only with evidence.

For future visual work test Arabic RTL, English LTR, mixed-direction content, long/short names, varied SAR prices, missing/poor images, sparse/dense content, availability, actions, fixed/sticky/modal/cart/toast stacking, readability, scanability, and conversion clarity.

## 10. Documentation Contract

At the end of every atomic task update:
- `PROJECT_STATE.md`
- `PLAN.md`
- `TASKS.md`
- dated audit/session record when material
- research record when material research was performed
- project-memory record when a new hard problem or reusable lesson is discovered

Every update records current verified position, work completed, files changed, verification evidence, risks, UNKNOWN/BLOCKED items, and exactly one next task.

## 11. Continuity Recovery Procedure

When task state conflicts:
1. Inspect `main` HEAD.
2. Inspect recent commits/diffs.
3. Inspect relevant CI evidence.
4. Inspect Vercel when deployment matters.
5. Inspect Supabase when database/security matters.
6. Search implementation and tests for the supposedly unfinished task.
7. Compare evidence to continuity files.
8. Reconcile stale documentation before implementation.
9. Never redo completed work because a stale document lists it.
10. Record the drift and prevention rule.

## 12. Current Stop Point

**Single next task: W16 Human Device & Manual Accessibility Gate.**

After W16, stop, reconcile state, and choose exactly one next atomic task from evidence.
