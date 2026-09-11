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

## Current Atomic Task — Onboarding Creation Recovery
### Objective
Fix the production onboarding failure shown on the final onboarding step, recover the existing orphaned tenant state, and make onboarding language suitable for restaurants, cafes, and other menu-based businesses.

### Root cause — VERIFIED
Production Vercel runtime logs show `createRestaurant failed` with PostgreSQL error `23505` on `tenants_owner_user_id_uidx`. Direct live Supabase inspection confirmed the affected authenticated owner had one tenant but zero active `tenant_members` rows. The application only checked active membership, so a previously-created tenant was treated as absent and the next request attempted a duplicate tenant insert.

### Implementation — IN PROGRESS
- Added `src/lib/menu/onboarding-recovery.ts` with server-authorized ownership recovery based only on `context.userId` and `tenants.owner_user_id`.
- Updated `src/routes/onboarding.tsx` to recover before creation, retry once after a failed creation, and reconcile the canonical `tenant_owner` authorization role.
- Changed onboarding wording from restaurant-specific language to business-neutral language without changing public menu architecture.
- Added `tests/onboarding-recovery.test.mjs` regression coverage.

### Security boundary
- Recovery does not accept client-supplied tenant IDs or roles.
- Existing authentication and tenant isolation remain in force.
- No secrets, tokens, RLS policies, dependencies, or unrelated product infrastructure were changed.

### Verification boundary
- VERIFIED: production runtime error evidence and live database schema/constraints.
- VERIFIED: branch diff is limited to the recovery helper, onboarding route, focused regression test, and continuity documentation.
- IN PROGRESS: GitHub Quality run `34542725711` is running on PR #75. Route generation, typecheck, tests, lint, and production build have already passed; Playwright runtime/browser stages are still running.
- DEPLOYMENT_BLOCKED: Vercel reports `Deployment rate limited — retry in 24 hours` for the branch. No deployment retry was attempted.

## Exact Next TODO
### Complete verification and release of onboarding creation recovery
1. Wait for PR #75 GitHub `quality` to complete.
2. If the quality gate passes, review the final diff and merge PR #75 to `main`.
3. Verify the resulting `main` CI status and Vercel status separately.
4. Because Vercel is currently rate-limited, do not retry deployment; record the exact production deployment blocker.
5. On the next available Production deployment, run one controlled onboarding attempt using a suitable unused registration flow and verify recovery, Studio access, and menu creation.
6. Stop.

## Continuity Rule
At the end of each atomic task, reconcile current Git head, CI evidence, and deployment evidence; update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`; update material audit/research/project-memory records; record exactly one next task; and stop.

## 2026-09-11 Decision Record — Onboarding Creation Recovery
- VERIFIED: this is an interrupted-onboarding data-state defect, not a missing restaurant-creation backend.
- VERIFIED: the database owner uniqueness index is functioning correctly by preventing duplicate tenant ownership.
- DECISION: recover the server-owned tenant membership instead of weakening or removing the uniqueness constraint.
- DECISION: preserve the existing tenant/menu architecture and make onboarding terminology business-neutral rather than introducing a separate product model.
- VERIFIED: no dependency, auth, RLS, tenant isolation, theme, ordering, analytics, approval-center, or Manus infrastructure was changed.

## 2026-09-11 — AI Provider Routing Milestone
- VERIFIED: PR #89 implements a replaceable server-side AI provider boundary and preserves the existing Menu Intelligence architecture.
- VERIFIED: structured AI fallback order is Inception/Mercury → Gemini → Z.AI → OpenRouter → xKiro.
- VERIFIED: multimodal image/PDF fallback order is Gemini → OpenRouter → Z.AI → xKiro.
- VERIFIED: five configured Inception keys are supported as a rotating key pool; no secret values are stored in Git.
- VERIFIED: image/PDF extraction no longer requires a hard-coded OpenAI credential.
- VERIFIED: schema validation, tenant/user rate limiting, prompt-injection safeguards, and human-review boundaries remain intact.
- VERIFIED: GitHub Quality run `34632139918` passed all stages through all-theme browser QA.
- STATUS: `READY_TO_PUSH` on the milestone branch.

## Exact Next Task — AI Provider Routing Release
1. Review PR #89 final diff against `main`.
2. Merge PR #89 as one coherent release batch.
3. Verify the resulting `main` commit and GitHub Quality independently.
4. Do not intentionally trigger Vercel while the current deployment rate-limit condition remains.
5. On the next permitted production deployment, run one controlled structured-AI smoke test and one non-sensitive image/PDF ingestion test.
6. Stop; do not automatically start another AI milestone.
