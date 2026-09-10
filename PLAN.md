# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage, and Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package manifest / lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main branch protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- W16 owner-accepted results — CLOSED FOR CURRENT EXECUTION.
- P2-H1 analytics no-data UX — CLOSED / VERIFIED on PR #59.
- Platform Approval Center defect — CLOSED / VERIFIED on PR #71.

## Canonical Backend Identity
- VERIFIED: Supabase project ref `ublxptcqefujkbeepylc`.
- VERIFIED: canonical database schema is `menu_v3`.
- VERIFIED: Menu V3 is separated from legacy application data by schema boundary.

## Current Strategic Direction
Build Menu V3 as a distinctive `Premium Arabic-first Restaurant Presence Platform`: live menu + branded web presence + direct customer action + owner operations + local discoverability, while preserving existing architecture and completed work.

## Permanent Specialist Workflows
- VERIFIED: `docs/agents/design-agent.md` defines the specialist workflow for significant visual, image, layout, theme, and site-consistency work.
- VERIFIED: `docs/agents/research-connected-tools-agent.md` defines repository-first dynamic research/discovery for consequential or unfamiliar work.
- VERIFIED: `docs/automatic-specialist-routing.md` defines automatic routing/orchestration.
- VERIFIED: `docs/project-memory/manus-engineering-lessons.md` records durable Manus execution lessons and must be consulted before related changes.
- VERIFIED: all specialist roles are internal AI workflows; the user remains the sole human owner and primary developer.

## P0/P1/P2 Current Evidence
### P0 — Public Order Hardening
- VERIFIED: database-backed public-order rate limiting and idempotency are implemented.
- VERIFIED: server-side product, availability, variant, modifier, quantity, note, tenant, and price validation remains authoritative.
- VERIFIED: legacy sensitive RPC execution is closed to `anon` and `authenticated` in the canonical live database inspection.

### P1 — Production/Continuity Hardening
- VERIFIED: continuity, release, security, and deployment evidence was reconciled against repository/platform state.
- CLOSED: package manifest / lockfile reconciliation for deterministic `npm ci` installation.
- CLOSED: `main` branch protection / required status checks.
- No speculative dependency upgrade is authorized.

### P2 — Growth & Differentiation — COMPLETED / VERIFIED / DEPLOYED
- VERIFIED: advanced analytics storytelling is implemented using the canonical owner analytics source.
- VERIFIED: local visibility readiness uses only verified tenant/branch fields and does not claim Google ranking.
- VERIFIED: experimentation is hypothesis-led and does not invent results or statistical significance.
- VERIFIED: no second analytics event source was introduced.
- VERIFIED: `tests/p2-growth-differentiation.test.mjs` protects the P2 contracts.

## Protected Completed Work
- Essential, Editorial, Noir, Heritage, and Gallery implementation milestones are protected.
- Shared public-menu behavior, customer actions, authentication, authorization, tenant/branch isolation, routing, migrations, and deployment controls remain protected.
- Quick Add, Item Notes, Cart, canonical public rendering, and customer action surfaces remain protected.
- Do not create a sixth theme as a substitute for product/design strategy.
- Do not repeat Manus-completed work unless a current reproducible defect is proven.

## Current Atomic Defect — Platform Approval Center — CLOSED / VERIFIED
### Objective
Fix the user-reported behavior where `فتح مركز الاعتماد` returned to the Platform Owner overview and exposed only contact controls instead of request decision controls.

### Root cause
- The existing `/admin/onboarding` source contained the intended approval workspace, but the user-facing entry was not reliably reaching that workspace in the deployed flow.
- The actual requirement was not merely contact visibility; the Platform Owner needed a deterministic working control surface for selecting a lead and approving, rejecting, marking contacted, saving notes, and creating the registration link.

### Implemented
- `src/routes/admin.tsx`: approval entry buttons now switch directly to the existing `leads` control surface inside the Platform Owner route instead of depending on the failing approval-center navigation path.
- The lead control surface now exposes the selected request details and the existing server-authorized `approveLead` operation for `اعتماد وإنشاء رابط التسجيل`.
- The same surface exposes `تم التواصل`, `رفض الطلب`, `حفظ الملاحظات`, Call, WhatsApp, Email, and request details.
- `tests/platform-onboarding-contract.test.mjs`: regression coverage protects the deterministic entry point and the explicit decision controls.
- No database, auth, RLS, tenant isolation, dependency, theme, or Manus infrastructure was changed.

### Verification
- PR #71 merged to `main` as `d11455f5d9a69b12bed4ba7804353065dccfaa2b`.
- Final `main` quality run `34534791703` passed route generation, typecheck, tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance handling, and cleanup.
- GitHub Vercel status for the latest `main` commit is `success`.

## Release-Only Vercel Policy
Normal release path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- Do not use Vercel for ordinary CSS/theme iteration.
- Do not intentionally trigger repeated Preview/Production deployments.
- CI success is not deployment evidence.
- `DEPLOYED` requires direct Vercel evidence.

## Exact Next TODO
### Real-device verification of Platform Owner approval controls
1. Open the latest deployed `main` as Platform Owner.
2. Press `اعتماد العملاء الجدد` or `فتح مركز الاعتماد`.
3. Confirm the view changes to the lead-control surface rather than the overview.
4. Select one real lead.
5. Confirm the details and all decision controls are visible.
6. If appropriate, perform one controlled approval and verify the registration-link result.
7. Record the direct-device result and stop.

## Continuity Rule
At the end of each atomic task, reconcile current Git/CI/deployment evidence, update continuity and material audit/research/memory records, record exactly one next task, and stop.
