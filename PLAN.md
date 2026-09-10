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
- Platform Approval Center defect — CLOSED / VERIFIED.
- Registration-link rendering defect — CLOSED / VERIFIED on PR #73.

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

## Platform Approval Center — CLOSED / VERIFIED
### Approval controls
- VERIFIED: `فتح مركز الاعتماد` opens the existing `leads` control surface inside the Platform Owner route.
- VERIFIED: selected lead details expose restaurant, city, contact name, phone, email, status, submitted date, notes, Call, WhatsApp, Email, `تم التواصل`, `رفض الطلب`, `حفظ الملاحظات`, and `اعتماد وإنشاء رابط التسجيل`.
- VERIFIED: approval uses the existing server-authorized `approveLead` operation.
- VERIFIED: rejection uses the existing `lost` lead status through `updateLead`.

### Registration-link rendering — CLOSED / VERIFIED
- VERIFIED: `approveLead` returns the one-time `registrationUrl` after successful approval.
- VERIFIED: the previous `/admin` `Leads` component discarded that return value and showed only a generic success message.
- VERIFIED: PR #73 stores the returned URL in local component state and renders it immediately after approval.
- VERIFIED: the rendered URL has `نسخ الرابط` and `فتح الرابط` actions.
- VERIFIED: the UI explains the existing 7-day / single-use behavior.
- VERIFIED: the token is not persisted to the lead record by this fix.
- VERIFIED: no database, auth, RLS, tenant isolation, dependency, theme, or Manus infrastructure was changed.

## Release-Only Vercel Policy
Normal release path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

- Do not use Vercel for ordinary CSS/theme iteration.
- Do not intentionally trigger repeated Preview/Production deployments.
- CI success is not deployment evidence.
- `DEPLOYED` requires direct Vercel evidence.

## Exact Next TODO
### Real-device verification of the completed Platform Owner approval and onboarding flow
1. Open the latest Production application as Platform Owner.
2. Open `اعتماد العملاء الجدد`.
3. Select one real lead that has not already consumed its onboarding link.
4. Perform one controlled approval.
5. Verify the registration URL appears immediately with `نسخ الرابط` and `فتح الرابط`.
6. Open the generated URL in a separate browser context and verify the customer onboarding screen.
7. Record the direct-device result and stop.

## Continuity Rule
At the end of each atomic task, reconcile current Git/CI/deployment evidence, update continuity and material audit/research/memory records, record exactly one next task, and stop.

## 2026-09-11 Decision Record
- VERIFIED: the reported defect was a presentation/state-handling gap, not a missing onboarding backend.
- DECISION: preserve the existing server-authorized token generation and display the returned secret only in the immediate approval result.
- DECISION: do not make tokens recoverable from stored lead data; this preserves the existing one-time secret design.
- VERIFIED: GitHub Quality run `34539814074` passed all configured stages for PR #73.
- VERIFIED: Vercel Production deployment `dpl_AsU4MDSBLvqz19T4ToRDhuesinRh` is `READY` for `main` commit `66a4985e2a13c4d77a86ebfd8fa8ce8a6c1fa33f`.
