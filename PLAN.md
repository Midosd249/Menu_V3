# Menu V3 — Active Plan

## Status
- Status: IN_PROGRESS.
- Repository: `Midosd249/Menu_V3`.
- Canonical branch: `main`.
- Source of truth: `main`.

## Current Verified Main
- VERIFIED: canonical `main` is `8a355f5c0f14ac123e79707483ad58b27e427c64`.
- VERIFIED: R8 was merged by squash from PR #128 after GitHub Actions quality run 1437 passed on the final branch head.
- VERIFIED: the preceding application baseline was `f4111f86738a098122a7e536ae35a0ea97ed03fd`.
- VERIFIED: latest theme-hardening work and focused Gallery/Noir regression coverage remain protected.

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
- Server derives the stored variant.
- Published menus with configured WhatsApp only.
- Existing `menu_events` remains canonical through nullable experiment fields.
- Preview/owner-preview does not activate or record the experiment.
- Primary: WhatsApp-click sessions / exposed sessions.
- Guardrail: product-view sessions / exposed sessions.
- Collection target: 50 exposed sessions per variant.
- Directional interpretation only; no statistical significance claim.

## R7 — Initial Evidence Review
STATUS: IN_PROGRESS — NON-BLOCKING / INSUFFICIENT EXPOSURE

- VERIFIED: canonical table is `menu_v3.menu_events`.
- VERIFIED: current observed exposure is 1 distinct `control` session and 2 distinct `prominent` sessions.
- VERIFIED: current `control` has 0 WhatsApp-click sessions and 0 product-view sessions.
- VERIFIED: current `prominent` has 0 WhatsApp-click sessions and 1 product-view session.
- INFERRED: Control is at 2% of the 50-session target and Prominent is at 4% of the 50-session target.
- DECISION: no treatment decision is justified; continue real exposure and re-review after meaningful accumulation.

## R8 — Closed-Loop Menu Growth Engine
STATUS: CLOSED / VERIFIED / MERGED

- VERIFIED: `/studio/growth` provides a unified owner surface for Observe → Act → Measure.
- VERIFIED: deterministic recommendations use existing `StudioSnapshot` and `OwnerAnalytics` only.
- VERIFIED: thin traffic is explicitly treated as insufficient evidence.
- VERIFIED: recommendations route to existing supported Studio destinations; no automatic menu mutation was introduced.
- VERIFIED: experiment catalogue includes the active `whatsapp-cta-v1` plus `featured-item-order` and `category-entry` as design-ready opportunities.
- VERIFIED: future experiments remain inactive until baseline, isolated change, metric, guardrail, and owner-approved activation are established.
- VERIFIED: focused R8 engine tests are included in the repository `test` script.
- VERIFIED: no database/schema, authentication, authorization, tenant/branch isolation, subscription, pricing, ordering, or R6/R7 semantics were changed.
- VERIFIED: GitHub Actions run 1437 passed route generation, typecheck, tests, lint, production build, Playwright installation, all-theme browser QA, performance artifact upload, and cleanup.
- VERIFIED: PR #128 merged to `main` as `8a355f5c0f14ac123e79707483ad58b27e427c64`.

## AI Infrastructure
- VERIFIED: server-side provider abstraction.
- VERIFIED: structured routing for Inception/Mercury, Gemini, Z.AI, OpenRouter, and xKiro.
- VERIFIED: multimodal routing for Gemini, OpenRouter, Z.AI, and xKiro.
- VERIFIED: schema validation, rate limiting, prompt-injection safeguards, and human-review boundaries.
- VERIFIED: server-only credentials.

## Production / Commercial Readiness
STATUS: IN_PROGRESS — EXTERNAL EVIDENCE REMAINING

- VERIFIED: repository-side R8 implementation and CI quality gates are complete.
- VERIFIED: a Vercel Preview deployment for the R8 branch reached Ready, but this is not production evidence.
- UNKNOWN: direct current Vercel Production environment-variable values are not readable through the current GitHub connector.
- UNKNOWN: current Production deployment commit/state requires direct Vercel evidence.
- UNKNOWN: physical real-device Production QA is not available through the current connector environment.

## Release-Only Vercel Policy
Normal path:

**LOCAL DEVELOPMENT → LOCAL QA → LOCAL BROWSER / VISUAL QA → TESTS → GITHUB ACTIONS QUALITY GATES → DIFF REVIEW → ONE COHERENT RELEASE BATCH → MERGE TO MAIN → ONE VERCEL PRODUCTION DEPLOYMENT → REAL-DEVICE PRODUCTION QA → RECORD RESULT**

Do not use Vercel as the normal development loop. Do not infer production state from GitHub or HTTP 200. Do not randomly retry quota/rate/build failures.

## Current Release State
- VERIFIED: `main` is `8a355f5c0f14ac123e79707483ad58b27e427c64`.
- VERIFIED: R8 quality run 1437 passed before merge.
- VERIFIED: PR #128 is merged.
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
→ Production / Commercial Readiness
```

## Exact Next Task
### Production / Commercial Readiness — External Verification Gate

Complete only the remaining evidence-dependent work:
1. verify Vercel Production environment/configuration against the canonical Supabase target;
2. perform available authenticated/browser/QR/theme/order/RTL Production QA;
3. perform real-device QA when a real device/browser session is available;
4. record direct evidence and close the readiness milestone when all applicable checks pass.

R7 remains active independently and does not block this task.

## Session Log — 2026-09-13 — R8 Closure
- VERIFIED: R8.1, R8.2, and R8.3 are merged into `main` at `8a355f5c0f14ac123e79707483ad58b27e427c64`.
- VERIFIED: GitHub Actions run 1437 passed all configured quality stages.
- VERIFIED: no schema or protected security/ordering changes were introduced.
- UNKNOWN: production deployment and physical-device evidence remain external.

## Continuity Rule
At the end of every atomic task:
1. reconcile current Git head;
2. verify CI evidence;
3. verify deployment separately when relevant;
4. update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md`;
5. update material audit/research/project-memory records when the task reveals a durable lesson;
6. record exactly one next task;
7. stop.
