# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: canonical `main` includes the fetched `origin/main` R9 baseline through `fb76e14`; the final merge commit is recorded after this merge completes.
- VERIFIED: R9 guest relationship batch was merged by squash from PR #136 after GitHub Actions quality run 1453 passed all configured stages.
- VERIFIED: the R9 migration is portable across Supabase and local PGlite; Supabase `anon`/`authenticated` revokes remain conditional while `public` remains revoked.
- VERIFIED: R8 and all preceding protected work remain in main.

## Completed Strategic Milestones
- Premium Theme System — DONE / VERIFIED / MERGED.
- Essential, Editorial, Noir, Heritage/Taste, Gallery — protected.
- Permanent visual/functional/research quality workflow — DONE / VERIFIED.
- P0 Public Order Hardening — DONE / VERIFIED.
- P1 Production/Continuity Hardening — DONE / VERIFIED for implemented scope.
- P1-H1 package/lockfile reconciliation — CLOSED / VERIFIED.
- P1-H2 main protection — CLOSED / VERIFIED.
- P2 Growth & Differentiation — DONE / VERIFIED / DEPLOYED.
- Platform Approval Center — CLOSED / VERIFIED.
- Registration-link rendering — CLOSED / VERIFIED.
- Onboarding Creation Recovery — CLOSED / VERIFIED / MERGED.
- R2.1–R2.7 Menu Intelligence — CLOSED / VERIFIED.
- R4.1–R4.5 Owner Intelligence — CLOSED / VERIFIED.
- R5 Growth Extensions — CLOSED / VERIFIED.
- R6 bounded WhatsApp CTA experiment — CLOSED / VERIFIED for activation/measurement implementation; outcome pending real exposure.
- R8.1 Action Loop — CLOSED / VERIFIED / MERGED.
- R8.2 Evidence-based Recommendations — CLOSED / VERIFIED / MERGED.
- R8.3 Experiment Expansion — CLOSED / VERIFIED / MERGED.
- R8.4 Evidence-based Upsell — CLOSED / VERIFIED / MERGED.
- R8.5 Restaurant Discovery — CLOSED / VERIFIED / MERGED.
- R9 Guest CRM / Loyalty / Campaigns / Feedback / Retention — CLOSED / VERIFIED / MERGED.
- AI Provider Routing & Multimodal Fallback — CLOSED / VERIFIED / MERGED.
- Grounded Guest Menu Assistant — CLOSED / VERIFIED.
- Gallery + Noir theme hardening — CLOSED / VERIFIED / MERGED.
- Continuity reconciliation — CLOSED / VERIFIED / MERGED.

## R2 — Menu Intelligence Product Layer
STATUS: CLOSED / VERIFIED

```text
R2.1 Menu Health / Completeness       DONE
R2.2 Problem Detection                DONE
R2.3 Priority + Actionable Fixes      DONE
R2.4 Owner Menu Intelligence UX       DONE
R2.5 Verified Analytics Intelligence  DONE
R2.6 Professional Analytics Reports   DONE
R2.7 WhatsApp Report Sharing          DONE
```

## R4 — Owner Intelligence
STATUS: CLOSED / VERIFIED

```text
R4.1 Verified Owner Signals           DONE / VERIFIED
R4.2 Intelligence Action Center       DONE / VERIFIED
R4.3 Action Center Follow-through     DONE / VERIFIED
R4.4 Intelligence Data Quality        DONE / VERIFIED
R4.5 Owner Decision Loop              DONE / VERIFIED
```

## R5 — Growth Extensions
STATUS: CLOSED / VERIFIED

- Deterministic distribution action for published zero-activity menus.
- Uses existing OwnerAnalytics evidence and verified publication state.
- Reuses `/studio/brand`; no duplicate dashboard or route.
- No fabricated metrics or autonomous messaging.

## R6 — Experiments
STATUS: CLOSED / VERIFIED — ACTIVATION COMPLETE; OUTCOME PENDING REAL EXPOSURE

- Experiment: `whatsapp-cta-v1`.
- Stable `control` / `prominent` assignment from existing anonymous session id.
- Server derives the recorded variant.
- Participation is limited to published menus with configured WhatsApp.
- Existing `menu_events` remains canonical through nullable experiment fields.
- Preview/owner-preview does not activate or record the experiment.
- Primary: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection target: 50 exposed sessions per variant.
- Directional interpretation only; no statistical significance claim.

## R7 — Initial Evidence Review
STATUS: IN_PROGRESS — NON-BLOCKING / INSUFFICIENT EXPOSURE

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: current observed exposure remains 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: no treatment decision is justified; continue eligible real exposure.
- VERIFIED: no synthetic traffic is used and no statistical significance claim is made.

## R8 — Closed-Loop Menu Growth Engine
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: `/studio/growth` provides the unified owner-facing Observe → Act → Measure surface.
- VERIFIED: recommendations are deterministic and evidence-bound.
- VERIFIED: thin traffic is treated as insufficient evidence.
- VERIFIED: recommendations route to existing supported Studio destinations; no automatic menu mutation.
- VERIFIED: R8.1–R8.5 are complete and protected.

## R9 — Guest Relationships
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: PR #136 merged into `main` as `afece1cb591566e885520b703117d0994643597a`.
- VERIFIED: owner-facing Studio guest relationship surface covers Guest CRM, Loyalty, Campaigns, Feedback, and Retention.
- VERIFIED: relationship data is server-authorized and tenant/branch scoped; owner/admin are the elevated roles used by the existing permission contract.
- VERIFIED: loyalty accounts and ledger, owner-controlled campaign drafts, and feedback records have RLS enabled and public access revoked.
- VERIFIED: retention and relationship overview are derived from existing guest/order data; no synthetic evidence is introduced.
- VERIFIED: autonomous outbound messaging, automatic rewards, autonomous campaign execution, predictive claims, and pricing mutation are excluded.
- VERIFIED: GitHub Actions quality run 1453 passed route generation, typecheck, all 265 tests, lint, production build, Playwright runtime/Chromium, all-theme browser QA, performance artifact upload, and cleanup.
- VERIFIED: the initial CI failure was a PGlite portability issue caused by unconditional `anon`/`authenticated` role revocation; the migration was hardened conditionally without weakening Supabase security semantics.

## R10
STATUS: DEFERRED / NOT STARTED

R10 is intentionally not started. Do not begin R10 until the owner explicitly authorizes it.

## AI Infrastructure
- VERIFIED: server-side provider abstraction.
- VERIFIED: structured routing for Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing for Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: schema validation, rate limiting, prompt-injection safeguards, and human-review boundaries.
- VERIFIED: server-only credentials.

## Production / Commercial Readiness
STATUS: IN_PROGRESS — EXTERNAL EVIDENCE REMAINING

- VERIFIED: repository-side R9 implementation and CI quality gates are complete.
- VERIFIED: GitHub `main` contains the R9 merge commit.
- UNKNOWN: direct current Vercel Production environment-variable values.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA.
- BLOCKED: unnecessary Vercel deployment retries must not be attempted while the known free daily deployment quota is exhausted.

## Release-Only Vercel Policy
Normal path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Do not use Vercel as the normal development loop. Do not infer production state from GitHub or HTTP 200. Do not randomly retry quota/rate/build failures.

## Current Release State
- VERIFIED: `main` is `afece1cb591566e885520b703117d0994643597a`.
- VERIFIED: PR #136 is merged.
- VERIFIED: final R9 quality run 1453 passed all configured stages.
- UNKNOWN: direct current Vercel Production deployment state and environment configuration.
- UNKNOWN: physical real-device Production QA.

## Current Strategic Direction
```text
Live Menu
→ Guest Experience
→ Menu Intelligence
→ Owner Intelligence
→ Growth Extensions
→ Experiments
→ Guest Relationships
→ Production / Commercial Readiness
```

## Saudi Food Disclosure Extension — 2026-09-13

- STATUS: `IMPLEMENTATION_IN_PROGRESS` / locally changed, not deployed.
- VERIFIED: official SFDA announcements were reviewed for caffeine disclosure, high-salt labeling, and physical-activity calorie-burn labeling.
- IMPLEMENTED: nullable sodium and caffeine fields, explicit caffeine basis, owner entry/review, public disclosure, and derived high-salt warning.
- PRESERVED: existing calories, allergen text, themes, tenant scoping, server validation, and AI non-fabrication boundaries.
- UNKNOWN: exact technical-regulation presentation, controlled allergen taxonomy, and physical-activity formula.
- NEXT: resolve pre-existing route/type-generation quality-gate errors, complete local browser QA, then prepare one release batch only after all applicable checks pass.

## Golden Demo Restaurant — 2026-09-13

- STATUS: `VERIFIED_LOCALLY` / data applied to the authorized existing tenant, not deployed.
- VERIFIED: fictional `مائدة سُرى / Sura Table`, Riyadh context, one preserved branch, 10 coherent categories, and 28 bilingual products.
- VERIFIED: Kids Menu, calories, sodium, caffeine bases, allergen combinations, availability state, empty image fields, modifier groups, and variants are represented using existing schema.
- VERIFIED: tenant owner and orders were preserved; no unrelated tenant was changed.
- VERIFIED: static five-theme contracts and all available repository QA passed.
- BLOCKED: browser visual QA is unavailable in this environment because Playwright browser binaries are absent and local PGlite schema is behind the current public-menu cache migration.
- NEXT: prepare one release batch after final diff review; do not deploy from this local task.

## Exact Next Task
### Production / Commercial Readiness — External Verification Gate

Complete only the remaining evidence-dependent work:
1. verify Vercel Production environment/configuration against canonical Supabase project `ublxptcqefujkbeepylc` and schema `menu_v3`;
2. perform available authenticated/browser/QR/theme/order/RTL Production QA;
3. perform real-device QA when a real device/browser session is available;
4. record direct evidence and close the readiness milestone when all applicable checks pass.

R7 remains active independently and does not block this task. R10 must remain untouched.

R10 remains deferred by owner decision and is not started.

## Session Log — 2026-09-13 — R9 Closure
- VERIFIED: PR #136 completed the R9 guest relationship batch and merged into `main`.
- VERIFIED: the R9 baseline commit is `afece1cb591566e885520b703117d0994643597a`; the current main merge commit is recorded after this merge completes.
- VERIFIED: quality run 1453 passed all configured stages after the R9 migration portability fix.
- VERIFIED: no protected authentication, authorization, tenant/branch isolation, subscription, ordering, R6, or R7 semantics were weakened.
- VERIFIED: R10 is explicitly deferred and not started.
- UNKNOWN/BLOCKED: Vercel Production state and real-device QA remain external evidence items; free daily deployment quota must not be retried unnecessarily.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records when the task reveals a durable lesson;
6. record exactly one next task;
7. stop.
